const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Importar rutas
const usuariosRoutes = require('./routes/usuarios')
const sesionesRoutes = require('./routes/sesiones')
const respuestasRoutes = require('./routes/respuestas')
const notasRoutes = require('./routes/notas')

// Importar middleware
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'https://frontend-quipus.vercel.app',
    'https://proyecto-quipus.vercel.app',
    /\.vercel\.app$/
  ], // Frontend React + Vercel deployments
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
  })
}

// Rutas
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/sesiones', sesionesRoutes)
app.use('/api/respuestas', respuestasRoutes)
app.use('/api/notas', notasRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Proyecto Quipus Backend funcionando correctamente',
    version: '2.0.0',
    architecture: 'Clean Architecture'
  })
})

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido al Backend del Proyecto Quipus',
    version: '2.0.0',
    architecture: 'Clean Architecture',
    endpoints: {
      usuarios: '/api/usuarios',
      sesiones: '/api/sesiones',
      respuestas: '/api/respuestas',
      notas: '/api/notas',
      health: '/health'
    },
    features: {
      'Clean Architecture': 'Separación de responsabilidades',
      'Repository Pattern': 'Acceso a datos abstraído',
      'Service Layer': 'Lógica de negocio centralizada',
      'Controller Layer': 'Manejo de HTTP requests/responses',
      'Validation Middleware': 'Validación de datos de entrada',
      'Error Handling': 'Manejo centralizado de errores',
      'Prisma ORM': 'Acceso a base de datos tipo-safe'
    }
  })
})

// Manejo de errores (debe ir al final)
app.use(errorHandler)

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableEndpoints: { 
      usuarios: '/api/usuarios',
      sesiones: '/api/sesiones',
      respuestas: '/api/respuestas',
      notas: '/api/notas',
      health: '/health'
    }
  })
})

module.exports = app
