import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10, // Allows parallel queries without queuing bottlenecks
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

// Always persist on globalThis across warm serverless invocations
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
} else {
  globalThis.prisma = prisma
}

export default prisma
