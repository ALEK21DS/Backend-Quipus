// Script de build específico para Vercel - Solución oficial de Prisma
const { execSync } = require('child_process')

console.log('🚀 Iniciando build para Vercel con Prisma...')

try {
  // Generar cliente de Prisma
  console.log('📦 Generando cliente de Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Verificar que se generó correctamente
  console.log('✅ Cliente de Prisma generado exitosamente')
  console.log('🎯 Build completado para Vercel')
} catch (error) {
  console.error('❌ Error durante el build de Prisma:', error.message)
  process.exit(1)
}
