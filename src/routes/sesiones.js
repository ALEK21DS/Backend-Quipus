const express = require('express')
const SesionController = require('../controllers/SesionController')
const { validarSesion, validarPaginacion } = require('../middleware/validation')

const router = express.Router()
const sesionController = new SesionController()

// POST /api/sesiones - Crear nueva sesión de juego
router.post('/', validarSesion, sesionController.crearSesion.bind(sesionController))

// GET /api/sesiones/:id - Obtener sesión por ID
router.get('/:id', sesionController.obtenerSesionPorId.bind(sesionController))

// PUT /api/sesiones/:id - Actualizar sesión (completar juego)
router.put('/:id', sesionController.completarSesion.bind(sesionController))

// GET /api/sesiones/usuario/:usuarioId - Obtener sesiones de un usuario
router.get('/usuario/:usuarioId', validarPaginacion, sesionController.obtenerSesionesUsuario.bind(sesionController))

// GET /api/sesiones/puntuaciones/tabla - Obtener tabla de puntuaciones general
router.get('/puntuaciones/tabla', validarPaginacion, sesionController.obtenerTablaPuntuaciones.bind(sesionController))

// GET /api/sesiones/puntuaciones/curso/:curso - Obtener puntuaciones por curso
router.get('/puntuaciones/curso/:curso', validarPaginacion, sesionController.obtenerPuntuacionesPorCurso.bind(sesionController))

// GET /api/sesiones/puntuaciones/usuario/:usuarioId - Obtener puntuaciones de un usuario específico
router.get('/puntuaciones/usuario/:usuarioId', sesionController.obtenerPuntuacionesUsuario.bind(sesionController))

// GET /api/sesiones/estadisticas - Obtener estadísticas generales
router.get('/estadisticas/generales', sesionController.obtenerEstadisticasGenerales.bind(sesionController))

// PUT /api/sesiones/:id/finalizar/tiempo - Finalizar sesión por tiempo agotado
router.put('/:id/finalizar/tiempo', sesionController.finalizarPorTiempoAgotado.bind(sesionController))

// PUT /api/sesiones/:id/finalizar/manual - Finalizar sesión por salida manual
router.put('/:id/finalizar/manual', sesionController.finalizarPorSalidaManual.bind(sesionController))

module.exports = router
