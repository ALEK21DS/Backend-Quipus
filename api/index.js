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
  
  // Handler de emergencia
  const express = require('express')
  const emergencyApp = express()
  
  emergencyApp.get('*', (req, res) => {
    res.status(500).json({
      success: false,
      error: 'Error de inicialización',
      message: 'La aplicación no pudo inicializarse correctamente'
    })
  })
  
  module.exports = emergencyApp
}
