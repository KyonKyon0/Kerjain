import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Use DIRECT_URL in local development if available, or DATABASE_URL
  const connectionString = (process.env.NODE_ENV !== 'production' && process.env.DIRECT_URL)
    ? process.env.DIRECT_URL
    : (process.env.DATABASE_URL || process.env.DIRECT_URL)

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // Strict connection pooling to prevent Supabase PgBouncer pool exhaustion (max 15 limit)
    max: 2,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: true,
  })

  pool.on('error', (err) => {
    console.error('Unexpected Supabase PG Pool error:', err.message)
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
