import { verifyToken } from './auth'
import prisma from './prisma'

export interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  gender: string | null;
}

// Fast in-memory user cache with 15-second TTL and hard max capacity to eliminate parallel DB query bottlenecks on serverless
interface CachedUser {
  user: CurrentUserProfile;
  expiresAt: number;
}

const MAX_CACHE_SIZE = 500;
const userCache = new Map<string, CachedUser>();

/**
 * Invalidate cached user immediately when profile/role/password changes
 */
export function invalidateUserCache(userId?: string) {
  if (!userId) {
    userCache.clear();
    return;
  }
  for (const [token, item] of userCache.entries()) {
    if (item.user && item.user.id === userId) {
      userCache.delete(token);
    }
  }
}

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
    // Evict expired or oldest entries if hard capacity reached
    if (userCache.size >= MAX_CACHE_SIZE) {
      let evicted = 0;
      for (const [k, v] of userCache.entries()) {
        if (v.expiresAt <= now || evicted < 50) {
          userCache.delete(k);
          evicted++;
        }
      }
    }

    // Store in cache for 15s to accelerate parallel dashboard queries
    userCache.set(token, {
      user,
      expiresAt: now + 15000
    });
  }

  return user || null
}
