// Configuración específica para Vercel
const { PrismaClient } = require('@prisma/client')

// Configuración optimizada para Vercel Serverless
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Configuración para evitar problemas de conexión en serverless
  __internal: {
    engine: {
      connectTimeout: 60000,
      queryTimeout: 60000,
    },
  },
})

// Manejo de desconexión en Vercel
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

module.exports = prisma
