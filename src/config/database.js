const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para diferentes entornos
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

// Configuración específica para Vercel/producción
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  prismaConfig.datasources = {
    db: {
      url: process.env.DATABASE_URL,
    },
  }
  prismaConfig.__internal = {
    engine: {
      connectTimeout: 60000,
      queryTimeout: 60000,
    },
  }
}

const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Manejo de desconexión en Vercel
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

module.exports = prisma
