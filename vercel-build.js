// Script de build principal para Vercel
const { execSync } = require('child_process')

console.log('🚀 Iniciando build completo para Vercel...')

try {
  // Limpiar cache de Prisma
  console.log('🧹 Limpiando cache de Prisma...')
  execSync('rm -rf node_modules/.prisma', { stdio: 'inherit' })
  
  // Generar cliente de Prisma
  console.log('📦 Generando cliente de Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('✅ Build completado exitosamente para Vercel')
} catch (error) {
  console.error('❌ Error durante el build:', error.message)
  process.exit(1)
}
