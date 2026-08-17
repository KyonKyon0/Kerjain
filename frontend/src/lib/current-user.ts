import { verifyToken } from './auth'
import prisma from './prisma'

// Fast in-memory user cache with 15-second TTL to eliminate parallel DB query bottlenecks on serverless
interface CachedUser {
  user: any;
  expiresAt: number;
}

const userCache = new Map<string, CachedUser>();

export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]
  const now = Date.now()

  // 1. Instant Cache Hit (0ms response)
  const cached = userCache.get(token)
  if (cached && cached.expiresAt > now) {
    return cached.user
  }

  // 2. Fast JWT verification
  const payload = await verifyToken(token)

  if (!payload || !payload.sub) {
    return null
  }

  // 3. Database query for authoritative user fields
  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      avatar_url: true,
      gender: true,
    }
  })

  if (user) {
    // Store in cache for 15s to accelerate parallel dashboard queries
    userCache.set(token, {
      user,
      expiresAt: now + 15000
    });

    // Cleanup expired cache entries
    if (userCache.size > 300) {
      for (const [k, v] of userCache.entries()) {
        if (v.expiresAt <= now) userCache.delete(k);
      }
    }
  }

  return user || null
}
