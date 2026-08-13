import { verifyToken } from './auth'
import prisma from './prisma'

export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]
  const payload = await verifyToken(token)

  if (!payload || !payload.sub) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string }
  })

  if (!user) {
    return null
  }

  const { hashed_password, ...userWithoutPassword } = user
  return userWithoutPassword
}
