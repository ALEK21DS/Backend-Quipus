const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

// Configuración optimizada para Vercel y entornos serverless
// Optimizado específicamente para Supabase con PgBouncer (puerto 6543)
let databaseUrl = process.env.DATABASE_URL

// Detectar si es Supabase (pooler en puerto 6543)
const isSupabase = databaseUrl && databaseUrl.includes('pooler.supabase.com')

// Agregar parámetros de conexión si no están presentes
if (databaseUrl && !databaseUrl.includes('connection_limit')) {
  const separator = databaseUrl.includes('?') ? '&' : '?'
  
  if (isSupabase) {
    // Configuración optimizada para Supabase PgBouncer
    // Supabase ya maneja PgBouncer, solo necesitamos limitar conexiones
    databaseUrl = `${databaseUrl}${separator}connection_limit=5&pool_timeout=10&connect_timeout=10`
  } else {
    // Para otros proveedores
    databaseUrl = `${databaseUrl}${separator}connection_limit=5&pool_timeout=10&pgbouncer=true`
  }
}

const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  // Configuración para evitar "prepared statement already exists" en serverless
  // Especialmente importante con Supabase PgBouncer + Vercel
  __internal: {
    engine: {
      // En Vercel (serverless), evitar problemas con prepared statements
      ...(process.env.VERCEL && {
        useUds: false,
      }),
    },
  },
}

// CRÍTICO: Siempre usar singleton, incluso en producción
// Esto evita múltiples instancias de Prisma Client que causan el error
const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig)

// Cachear en TODOS los entornos (incluyendo producción/Vercel)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Manejo de desconexión limpia en serverless
if (process.env.VERCEL) {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

module.exports = prisma
