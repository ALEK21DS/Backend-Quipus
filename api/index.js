// Handler para Vercel Serverless Functions
require('dotenv').config()

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

try {
  const app = require('../src/app')
  module.exports = app
} catch (error) {
  console.error('Error loading app:', error)
  console.error('Error stack:', error.stack)
  
  // Handler de emergencia
  const express = require('express')
  const emergencyApp = express()
  
  emergencyApp.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      error: 'Error de inicialización',
      message: 'La aplicación no pudo inicializarse correctamente',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      hint: 'Verifica las variables de entorno DATABASE_URL y que Prisma Client esté generado'
    })
  })
  
  module.exports = emergencyApp
}
