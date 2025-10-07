const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para Vercel
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

// Configuración específica para Vercel
if (process.env.VERCEL) {
  prismaConfig.datasources = {
    db: {
      url: process.env.DATABASE_URL,
    },
  }
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Manejo de desconexión en Vercel
if (process.env.VERCEL) {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

module.exports = prisma
