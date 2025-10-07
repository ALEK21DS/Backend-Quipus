const UsuarioService = require('../services/UsuarioService')

class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService()
  }

  // Crear usuario
  async crearUsuario(req, res) {
    try {
      const usuario = await this.usuarioService.crearUsuario(req.body)
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuario,
        esAdmin: usuario.esAdmin  // Incluir esAdmin en la respuesta
      })
    } catch (error) {
      console.error('Error al crear usuario:', error)
      
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({
          success: false,
          error: 'Usuario ya existe',
          message: error.message
        })
      }
      
      if (error.message.includes('Datos incompletos') || error.message.includes('edad')) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          message: error.message
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Obtener todos los usuarios
  async obtenerTodosUsuarios(req, res) {
    try {
      const { limite = 50, offset = 0 } = req.query
      const usuarios = await this.usuarioService.obtenerTodosUsuarios(parseInt(limite), parseInt(offset))
      
      res.json({
        success: true,
        data: usuarios,
        total: usuarios.length,
        paginacion: {
          limite: parseInt(limite),
          offset: parseInt(offset)
        }
      })
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Obtener usuario por ID
  async obtenerUsuarioPorId(req, res) {
    try {
      const { id } = req.params
      const usuario = await this.usuarioService.obtenerUsuarioPorId(id)
      
      res.json({
        success: true,
        data: usuario
      })
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          message: error.message
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Buscar usuarios
  async buscarUsuarios(req, res) {
    try {
      const { nombre, apellido } = req.params
      const usuarios = await this.usuarioService.buscarUsuarios(nombre, apellido)
      
      res.json({
        success: true,
        data: usuarios,
        total: usuarios.length
      })
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
      
      if (error.message.includes('parámetros')) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros inválidos',
          message: error.message
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Actualizar usuario
  async actualizarUsuario(req, res) {
    try {
      const { id } = req.params
      const usuario = await this.usuarioService.actualizarUsuario(id, req.body)
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuario
      })
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          message: error.message
        })
      }
      
      if (error.message.includes('edad')) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          message: error.message
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Eliminar usuario
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params
      const usuario = await this.usuarioService.eliminarUsuario(id)
      
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: usuario
      })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          message: error.message
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Obtener estadísticas
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await this.usuarioService.obtenerEstadisticas()
      
      res.json({
        success: true,
        data: estadisticas
      })
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Verificar si es admin
  async verificarAdmin(req, res) {
    try {
      const { nombre, apellido } = req.query
      
      if (!nombre || !apellido) {
        return res.status(400).json({
          success: false,
          error: 'Nombre y apellido son requeridos'
        })
      }
      
      const esAdmin = this.usuarioService.esAdmin(nombre, apellido)
      
      res.json({
        success: true,
        data: {
          esAdmin,
          nombre,
          apellido
        }
      })
    } catch (error) {
      console.error('Error al verificar admin:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }
}

module.exports = UsuarioController
