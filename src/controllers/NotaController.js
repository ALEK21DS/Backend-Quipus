const NotaService = require('../services/NotaService')

class NotaController {
  constructor() {
    this.notaService = new NotaService()
  }

  // Crear nota
  async crearNota(req, res) {
    try {
      const nota = await this.notaService.crearNota(req.body)
      
      res.status(201).json({
        success: true,
        message: 'Nota creada exitosamente',
        data: nota
      })
    } catch (error) {
      console.error('Error al crear nota:', error)
      
      if (error.message.includes('requeridos') || error.message.includes('no encontrado') || error.message.includes('inválido')) {
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

  // Obtener todas las notas
  async obtenerTodasNotas(req, res) {
    try {
      const { limite = 100, offset = 0, curso } = req.query
      const resultado = await this.notaService.obtenerTodasNotas(
        parseInt(limite), 
        parseInt(offset), 
        curso
      )
      
      res.json({
        success: true,
        data: resultado,
        total: resultado.length,
        paginacion: {
          limite: parseInt(limite),
          offset: parseInt(offset)
        }
      })
    } catch (error) {
      console.error('Error al obtener notas:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Obtener nota por ID
  async obtenerNotaPorId(req, res) {
    try {
      const { id } = req.params
      const nota = await this.notaService.obtenerNotaPorId(id)
      
      res.json({
        success: true,
        data: nota
      })
    } catch (error) {
      console.error('Error al obtener nota:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Nota no encontrada',
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

  // Obtener notas de un usuario
  async obtenerNotasUsuario(req, res) {
    try {
      const { usuarioId } = req.params
      const notas = await this.notaService.obtenerNotasUsuario(usuarioId)
      
      res.json({
        success: true,
        data: notas,
        total: notas.length
      })
    } catch (error) {
      console.error('Error al obtener notas del usuario:', error)
      
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

  // Actualizar nota
  async actualizarNota(req, res) {
    try {
      const { id } = req.params
      const nota = await this.notaService.actualizarNota(id, req.body)
      
      res.json({
        success: true,
        message: 'Nota actualizada exitosamente',
        data: nota
      })
    } catch (error) {
      console.error('Error al actualizar nota:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Nota no encontrada',
          message: error.message
        })
      }
      
      if (error.message.includes('requerido') || error.message.includes('inválido')) {
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

  // Eliminar nota
  async eliminarNota(req, res) {
    try {
      const { id } = req.params
      await this.notaService.eliminarNota(id)
      
      res.json({
        success: true,
        message: 'Nota eliminada exitosamente'
      })
    } catch (error) {
      console.error('Error al eliminar nota:', error)
      
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          error: 'Nota no encontrada',
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

  // Buscar notas por contenido
  async buscarNotasPorContenido(req, res) {
    try {
      const { searchTerm } = req.query
      const { limite = 50 } = req.query
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          error: 'Término de búsqueda es requerido'
        })
      }
      
      const notas = await this.notaService.buscarNotasPorContenido(searchTerm, parseInt(limite))
      
      res.json({
        success: true,
        data: notas,
        total: notas.length,
        searchTerm
      })
    } catch (error) {
      console.error('Error al buscar notas:', error)
      
      if (error.message.includes('caracteres')) {
        return res.status(400).json({
          success: false,
          error: 'Término de búsqueda inválido',
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

  // Obtener estadísticas de notas
  async obtenerEstadisticasNotas(req, res) {
    try {
      const estadisticas = await this.notaService.obtenerEstadisticasNotas()
      
      res.json({
        success: true,
        data: estadisticas
      })
    } catch (error) {
      console.error('Error al obtener estadísticas de notas:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  // Crear nota del sistema
  async crearNotaSistema(req, res) {
    try {
      const { usuarioId, sesionId, mensaje } = req.body
      
      if (!usuarioId || !mensaje) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ID y mensaje son requeridos'
        })
      }
      
      const nota = await this.notaService.crearNotaSistema(usuarioId, sesionId, mensaje)
      
      res.status(201).json({
        success: true,
        message: 'Nota del sistema creada exitosamente',
        data: nota
      })
    } catch (error) {
      console.error('Error al crear nota del sistema:', error)
      
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

  // Crear nota de profesor
  async crearNotaProfesor(req, res) {
    try {
      const { usuarioId, contenido, sesionId } = req.body
      
      if (!usuarioId || !contenido) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ID y contenido son requeridos'
        })
      }
      
      const nota = await this.notaService.crearNotaProfesor(usuarioId, contenido, sesionId)
      
      res.status(201).json({
        success: true,
        message: 'Nota de profesor creada exitosamente',
        data: nota
      })
    } catch (error) {
      console.error('Error al crear nota de profesor:', error)
      
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

  // Obtener notas por tipo
  async obtenerNotasPorTipo(req, res) {
    try {
      const { tipoNota } = req.params
      const { limite = 100, offset = 0 } = req.query
      
      const notas = await this.notaService.obtenerNotasPorTipo(
        tipoNota, 
        parseInt(limite), 
        parseInt(offset)
      )
      
      res.json({
        success: true,
        data: notas,
        total: notas.length,
        tipoNota,
        paginacion: {
          limite: parseInt(limite),
          offset: parseInt(offset)
        }
      })
    } catch (error) {
      console.error('Error al obtener notas por tipo:', error)
      
      if (error.message.includes('inválido')) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de nota inválido',
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

module.exports = NotaController
