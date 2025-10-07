const express = require('express')
const NotaController = require('../controllers/NotaController')
const { validarNota, validarPaginacion } = require('../middleware/validation')

const router = express.Router()
const notaController = new NotaController()

// GET /api/notas - Obtener tabla de notas (solo admin)
router.get('/', validarPaginacion, notaController.obtenerTodasNotas.bind(notaController))

// GET /api/notas/:id - Obtener nota por ID
router.get('/:id', notaController.obtenerNotaPorId.bind(notaController))

// POST /api/notas - Crear nueva nota
router.post('/', validarNota, notaController.crearNota.bind(notaController))

// PUT /api/notas/:id - Actualizar nota
router.put('/:id', notaController.actualizarNota.bind(notaController))

// DELETE /api/notas/:id - Eliminar nota
router.delete('/:id', notaController.eliminarNota.bind(notaController))

// GET /api/notas/usuario/:usuarioId - Obtener notas de un usuario específico
router.get('/usuario/:usuarioId', notaController.obtenerNotasUsuario.bind(notaController))

// GET /api/notas/buscar - Buscar notas por contenido
router.get('/buscar', notaController.buscarNotasPorContenido.bind(notaController))

// GET /api/notas/estadisticas - Obtener estadísticas de notas
router.get('/estadisticas', notaController.obtenerEstadisticasNotas.bind(notaController))

// POST /api/notas/sistema - Crear nota del sistema
router.post('/sistema', notaController.crearNotaSistema.bind(notaController))

// POST /api/notas/profesor - Crear nota de profesor
router.post('/profesor', notaController.crearNotaProfesor.bind(notaController))

// GET /api/notas/tipo/:tipoNota - Obtener notas por tipo
router.get('/tipo/:tipoNota', validarPaginacion, notaController.obtenerNotasPorTipo.bind(notaController))

module.exports = router
