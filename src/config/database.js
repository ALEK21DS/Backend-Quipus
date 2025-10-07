const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración simplificada para Vercel
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

module.exports = prisma
