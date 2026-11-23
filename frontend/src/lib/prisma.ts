import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Use DIRECT_URL in local development if available, or DATABASE_URL
  const connectionString = (process.env.NODE_ENV !== 'production' && process.env.DIRECT_URL)
    ? process.env.DIRECT_URL
    : (process.env.DATABASE_URL || process.env.DIRECT_URL)

  const isLocal = !connectionString || connectionString.includes('127.0.0.1') || connectionString.includes('localhost')

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    // Generous pool for local self-hosted PostgreSQL, defensive for remote
    max: isLocal ? 10 : 2,
    idleTimeoutMillis: isLocal ? 10000 : 1000,
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: true,
  })

  pool.on('error', (err) => {
    console.error('Unexpected PG Pool error:', err.message)
  })
  
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ 
    adapter,
    log: ['error']
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
