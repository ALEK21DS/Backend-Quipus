const express = require('express')
const UsuarioController = require('../controllers/UsuarioController')
const { validarUsuario, validarPaginacion } = require('../middleware/validation')

const router = express.Router()
const usuarioController = new UsuarioController()

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', validarPaginacion, usuarioController.obtenerTodosUsuarios.bind(usuarioController))

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId.bind(usuarioController))

// POST /api/usuarios - Crear nuevo usuario
router.post('/', validarUsuario, usuarioController.crearUsuario.bind(usuarioController))

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', usuarioController.actualizarUsuario.bind(usuarioController))

// DELETE /api/usuarios/:id - Eliminar usuario (soft delete)
router.delete('/:id', usuarioController.eliminarUsuario.bind(usuarioController))

// GET /api/usuarios/buscar/:nombre/:apellido - Buscar usuario por nombre y apellido
router.get('/buscar/:nombre/:apellido', usuarioController.buscarUsuarios.bind(usuarioController))

// GET /api/usuarios/estadisticas - Obtener estadísticas de usuarios
router.get('/estadisticas', usuarioController.obtenerEstadisticas.bind(usuarioController))

// GET /api/usuarios/verificar-admin - Verificar si es admin
router.get('/verificar-admin', usuarioController.verificarAdmin.bind(usuarioController))

module.exports = router
