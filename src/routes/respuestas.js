const express = require('express')
const RespuestaController = require('../controllers/RespuestaController')
const { validarRespuestaReto1, validarRespuestaReto2, validarRespuestaReto3 } = require('../middleware/validation')

const router = express.Router()
const respuestaController = new RespuestaController()

// POST /api/respuestas/reto1 - Guardar respuesta del Reto 1
router.post('/reto1', validarRespuestaReto1, respuestaController.guardarRespuestaReto1.bind(respuestaController))

// POST /api/respuestas/reto2 - Guardar respuesta del Reto 2
router.post('/reto2', validarRespuestaReto2, respuestaController.guardarRespuestaReto2.bind(respuestaController))

// POST /api/respuestas/reto3 - Guardar respuesta del Reto 3
router.post('/reto3', validarRespuestaReto3, respuestaController.guardarRespuestaReto3.bind(respuestaController))

// GET /api/respuestas/sesion/:sesionId - Obtener todas las respuestas de una sesión
router.get('/sesion/:sesionId', respuestaController.obtenerRespuestasSesion.bind(respuestaController))

// GET /api/respuestas/sesion/:sesionId/estadisticas - Obtener estadísticas de respuestas
router.get('/sesion/:sesionId/estadisticas', respuestaController.obtenerEstadisticasRespuestas.bind(respuestaController))

// GET /api/respuestas/sesion/:sesionId/puntuacion - Calcular puntuación total de una sesión
router.get('/sesion/:sesionId/puntuacion', respuestaController.calcularPuntuacionTotalSesion.bind(respuestaController))

// GET /api/respuestas/sesion/:sesionId/progreso/:reto - Obtener progreso de un reto específico
router.get('/sesion/:sesionId/progreso/:reto', respuestaController.obtenerProgresoReto.bind(respuestaController))

module.exports = router
