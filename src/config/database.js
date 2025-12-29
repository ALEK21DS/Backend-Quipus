const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para Vercel y entornos serverless
// Aumentar límite de conexiones para evitar timeouts
let databaseUrl = process.env.DATABASE_URL

// Agregar parámetros de conexión si no están presentes
if (databaseUrl && !databaseUrl.includes('connection_limit')) {
  const separator = databaseUrl.includes('?') ? '&' : '?'
  databaseUrl = `${databaseUrl}${separator}connection_limit=10&pool_timeout=20`
}

const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Evitar "prepared statement already exists" en serverless
  datasources: {
    db: {
      url: databaseUrl
    }
  }
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

// Solo cachear en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = prisma
