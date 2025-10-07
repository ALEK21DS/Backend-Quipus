const RespuestaService = require('../services/RespuestaService')

class RespuestaController {
  constructor() {
    this.respuestaService = new RespuestaService()
  }

  // Guardar respuesta del Reto 1
  async guardarRespuestaReto1(req, res) {
    try {
      const respuesta = await this.respuestaService.guardarRespuestaReto1(req.body)
      
      res.status(201).json({
        success: true,
        message: 'Respuesta del Reto 1 guardada',
        data: respuesta
      })
    } catch (error) {
      console.error('Error al guardar respuesta Reto 1:', error)
      
      if (error.message.includes('incompletos') || error.message.includes('no encontrada')) {
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

  // Guardar respuesta del Reto 2
  async guardarRespuestaReto2(req, res) {
    try {
      const respuesta = await this.respuestaService.guardarRespuestaReto2(req.body)
      
      res.status(201).json({
        success: true,
        message: 'Respuesta del Reto 2 guardada',
        data: respuesta
      })
    } catch (error) {
      console.error('Error al guardar respuesta Reto 2:', error)
      
      if (error.message.includes('incompletos') || error.message.includes('no encontrada')) {
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

  // Guardar respuesta del Reto 3
  async guardarRespuestaReto3(req, res) {
    try {
      const respuesta = await this.respuestaService.guardarRespuestaReto3(req.body)
      
      res.status(201).json({
        success: true,
        message: 'Respuesta del Reto 3 guardada',
        data: respuesta
      })
    } catch (error) {
      console.error('Error al guardar respuesta Reto 3:', error)
      
      if (error.message.includes('incompletos') || error.message.includes('no encontrada')) {
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

  // Obtener respuestas de una sesión
  async obtenerRespuestasSesion(req, res) {
    try {
      const { sesionId } = req.params
      const respuestas = await this.respuestaService.obtenerRespuestasSesion(sesionId)
      
      res.json({
        success: true,
        data: respuestas
      })
    } catch (error) {
      console.error('Error al obtener respuestas de la sesión:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'ID de sesión es requerido',
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

  // Obtener estadísticas de respuestas
  async obtenerEstadisticasRespuestas(req, res) {
    try {
      const { sesionId } = req.params
      const estadisticas = await this.respuestaService.obtenerEstadisticasRespuestas(sesionId)
      
      res.json({
        success: true,
        data: estadisticas
      })
    } catch (error) {
      console.error('Error al obtener estadísticas de respuestas:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'ID de sesión es requerido',
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

  // Calcular puntuación total de una sesión
  async calcularPuntuacionTotalSesion(req, res) {
    try {
      const { sesionId } = req.params
      const puntuacion = await this.respuestaService.calcularPuntuacionTotalSesion(sesionId)
      
      res.json({
        success: true,
        data: puntuacion
      })
    } catch (error) {
      console.error('Error al calcular puntuación total:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'ID de sesión es requerido',
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

  // Obtener progreso de un reto específico
  async obtenerProgresoReto(req, res) {
    try {
      const { sesionId, reto } = req.params
      
      if (!['reto1', 'reto2', 'reto3'].includes(reto)) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de reto inválido',
          message: 'El reto debe ser: reto1, reto2 o reto3'
        })
      }
      
      const respuestas = await this.respuestaService.obtenerRespuestasSesion(sesionId)
      const progreso = respuestas[reto] || []
      
      // Calcular progreso específico según el reto
      let estadisticas = {}
      
      switch (reto) {
        case 'reto1':
          estadisticas = {
            total: progreso.length,
            correctas: progreso.filter(r => r.esCorrecto).length,
            completado: progreso.length === 4 && progreso.every(r => r.esCorrecto)
          }
          break
          
        case 'reto2':
          estadisticas = {
            total: progreso.length,
            correctas: progreso.filter(r => r.esCorrecto).length,
            completado: progreso.length === 1 && progreso[0]?.esCorrecto
          }
          break
          
        case 'reto3':
          estadisticas = {
            total: progreso.length,
            completados: progreso.filter(r => r.completado).length,
            completado: progreso.length === 10 && progreso.every(r => r.completado)
          }
          break
      }
      
      res.json({
        success: true,
        data: {
          reto,
          respuestas: progreso,
          estadisticas
        }
      })
    } catch (error) {
      console.error('Error al obtener progreso del reto:', error)
      
      if (error.message.includes('requerido')) {
        return res.status(400).json({
          success: false,
          error: 'ID de sesión es requerido',
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

module.exports = RespuestaController
