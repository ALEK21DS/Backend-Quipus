const SesionService = require('../services/SesionService')

class SesionController {
  constructor() {
    this.sesionService = new SesionService()
  }

  // Crear nueva sesión
  async crearSesion(req, res) {
    try {
      const { usuarioId } = req.body
      const sesion = await this.sesionService.crearSesion(usuarioId)
      
      res.status(201).json({
        success: true,
        message: 'Sesión de juego iniciada',
        data: sesion
      })
    } catch (error) {
      console.error('Error al crear sesión:', error)
      
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          message: error.message
        })
      }
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
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

  // Obtener sesión por ID
  async obtenerSesionPorId(req, res) {
    try {
      const { id } = req.params
      const sesion = await this.sesionService.obtenerSesionPorId(id)
      
      res.json({
        success: true,
        data: sesion
      })
    } catch (error) {
      console.error('Error al obtener sesión:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Sesión no encontrada',
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

  // Completar sesión
  async completarSesion(req, res) {
    try {
      const { id } = req.params
      const sesion = await this.sesionService.completarSesion(id, req.body)
      
      res.json({
        success: true,
        message: 'Sesión completada exitosamente',
        data: sesion
      })
    } catch (error) {
      console.error('Error al completar sesión:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Sesión no encontrada',
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

  // Obtener sesiones de un usuario
  async obtenerSesionesUsuario(req, res) {
    try {
      const { usuarioId } = req.params
      const { limite = 10, offset = 0 } = req.query
      
      const sesiones = await this.sesionService.obtenerSesionesUsuario(
        usuarioId, 
        parseInt(limite), 
        parseInt(offset)
      )
      
      res.json({
        success: true,
        data: sesiones,
        total: sesiones.length,
        paginacion: {
          limite: parseInt(limite),
          offset: parseInt(offset)
        }
      })
    } catch (error) {
      console.error('Error al obtener sesiones del usuario:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ID es requerido',
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

  // Obtener tabla de puntuaciones
  async obtenerTablaPuntuaciones(req, res) {
    try {
      const { limite = 50, offset = 0, ordenar = 'puntuacionTotal' } = req.query
      
      const resultado = await this.sesionService.obtenerTablaPuntuaciones(
        parseInt(limite), 
        parseInt(offset), 
        ordenar
      )
      
      res.json({
        success: true,
        ...resultado
      })
    } catch (error) {
      console.error('Error al obtener tabla de puntuaciones:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Obtener puntuaciones por curso
  async obtenerPuntuacionesPorCurso(req, res) {
    try {
      const { curso } = req.params
      const { limite = 50, offset = 0 } = req.query
      
      const resultado = await this.sesionService.obtenerPuntuacionesPorCurso(
        curso, 
        parseInt(limite), 
        parseInt(offset)
      )
      
      res.json({
        success: true,
        ...resultado
      })
    } catch (error) {
      console.error('Error al obtener puntuaciones por curso:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'Nombre del curso es requerido',
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

  // Obtener puntuaciones de un usuario
  async obtenerPuntuacionesUsuario(req, res) {
    try {
      const { usuarioId } = req.params
      const resultado = await this.sesionService.obtenerPuntuacionesUsuario(usuarioId)
      
      res.json({
        success: true,
        ...resultado
      })
    } catch (error) {
      console.error('Error al obtener puntuaciones del usuario:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ID es requerido',
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

  // Obtener estadísticas generales
  async obtenerEstadisticasGenerales(req, res) {
    try {
      const estadisticas = await this.sesionService.obtenerEstadisticasGenerales()
      
      res.json({
        success: true,
        data: estadisticas
      })
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Finalizar sesión por tiempo agotado
  async finalizarPorTiempoAgotado(req, res) {
    try {
      const { id } = req.params
      const sesion = await this.sesionService.finalizarPorTiempoAgotado(id)
      
      res.json({
        success: true,
        message: 'Sesión finalizada por tiempo agotado',
        data: sesion
      })
    } catch (error) {
      console.error('Error al finalizar sesión por tiempo agotado:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Sesión no encontrada',
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

  // Finalizar sesión por salida manual
  async finalizarPorSalidaManual(req, res) {
    try {
      const { id } = req.params
      const sesion = await this.sesionService.finalizarPorSalidaManual(id)
      
      res.json({
        success: true,
        message: 'Sesión finalizada por salida manual',
        data: sesion
      })
    } catch (error) {
      console.error('Error al finalizar sesión por salida manual:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Sesión no encontrada',
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
}

module.exports = SesionController
