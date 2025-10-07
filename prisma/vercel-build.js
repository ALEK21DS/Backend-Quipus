// Script de build específico para Vercel
const { execSync } = require('child_process')

console.log('🚀 Iniciando build para Vercel...')

try {
  console.log('📦 Generando cliente de Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('✅ Cliente de Prisma generado exitosamente')
  console.log('🎯 Build completado para Vercel')
} catch (error) {
  console.error('❌ Error durante el build:', error.message)
  process.exit(1)
}
