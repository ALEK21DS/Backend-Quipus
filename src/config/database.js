const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para Vercel y entornos serverless
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Evitar "prepared statement already exists" en serverless
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

// Solo cachear en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = prisma
