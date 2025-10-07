const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para Vercel y entornos serverless
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

// Configuración específica para entornos serverless (Vercel)
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  prismaConfig.datasources = {
    db: {
      url: process.env.DATABASE_URL,
    },
  }
  
  // Configuración de connection pooling para evitar "prepared statement already exists"
  prismaConfig.datasourceUrl = process.env.DATABASE_URL
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

module.exports = prisma
