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


  // Obtener detalles completos de una sesión para mostrar en la vista de notas
  async obtenerDetallesSesion(req, res) {
    try {
      const { sesionId } = req.params

      if (!sesionId) {
        return res.status(400).json({
          success: false,
          error: 'ID de sesión es requerido'
        })
      }

      // Obtener información de la sesión
      const SesionService = require('../services/SesionService')
      const sesionService = new SesionService()
      const sesion = await sesionService.obtenerSesionPorId(sesionId)

      // Obtener todas las respuestas
      const respuestas = await this.respuestaService.obtenerRespuestasSesion(sesionId)

      // Obtener la nota real de la base de datos
      const NotaRepository = require('../repositories/NotaRepository')
      const notaRepository = new NotaRepository()
      const notasUsuario = await notaRepository.findBySesion(sesionId)
      const notaSistema = notasUsuario.find(n => n.tipoNota === 'SISTEMA')
      
      // Usar la nota real de la base de datos, o calcular si no existe
      const notaReal = notaSistema?.calificacion || sesion.puntuacionNotas || 0

      // Calcular detalles basados en las respuestas (para el desglose)
      const detallesNota = this.calcularDetallesNota(respuestas, notaReal)

      res.json({
        success: true,
        data: {
          sesion: {
            id: sesion.id,
            fechaInicio: sesion.fechaInicio,
            fechaFin: sesion.fechaFin,
            tiempoTotal: sesion.tiempoTotal,
            completado: sesion.completado,
            tiempoAgotado: sesion.tiempoAgotado,
            usuario: sesion.usuario
          },
          respuestas,
          detallesNota
        }
      })
    } catch (error) {
      console.error('Error al obtener detalles de la sesión:', error)

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

  // Calcular detalles de la nota (sobre 10)
  calcularDetallesNota(respuestas, notaReal = null) {
    // Reto 1: 4 preguntas, cada una vale 0.25 puntos (total 1 punto)
    const reto1Correctas = respuestas.reto1.filter(r => r.esCorrecto).length
    const notaReto1 = reto1Correctas * 0.25

    // Reto 2: 4 casillas, cada una vale 0.5 puntos (total 2 puntos)
    let casillasCorrectas = 0
    if (respuestas.reto2.length > 0) {
      const respuesta = respuestas.reto2[0]
      try {
        const respuestasUsuario = JSON.parse(respuesta.respuestaUsuario)
        const respuestasCorrectas = JSON.parse(respuesta.respuestaCorrecta)
        
        // Contar casillas correctas
        for (let i = 1; i <= 4; i++) {
          if (respuestasUsuario[`blank-${i}`] === respuestasCorrectas[`blank-${i}`]) {
            casillasCorrectas++
          }
        }
      } catch (e) {
        // Si hay error al parsear, usar el campo esCorrecto
        casillasCorrectas = respuesta.esCorrecto ? 4 : 0
      }
    }
    const notaReto2 = casillasCorrectas * 0.5

    // Reto 3: Calcular por diferencia usando la nota real de la BD
    // Esto garantiza que la suma sea exacta
    let puntosReto3 = 0
    let ejerciciosCompletados = 0
    
    respuestas.reto3.forEach(ejercicio => {
      if (ejercicio.completado) {
        ejerciciosCompletados++
      }
    })
    
    // Calcular nota del Reto 3 por diferencia para que la suma sea exacta
    let notaReto3
    if (notaReal !== null) {
      notaReto3 = Math.max(0, notaReal - notaReto1 - notaReto2)
      puntosReto3 = Math.round(notaReto3 * 10)
    } else {
      // Si no hay nota real, calcular desde las respuestas (fallback)
      respuestas.reto3.forEach(ejercicio => {
        if (ejercicio.completado) {
          const intentoMaximo = Math.max(
            ejercicio.validacion1Intento,
            ejercicio.validacion2Intento,
            ejercicio.validacion3Intento
          )
          const errores = intentoMaximo - 1
          const puntosEjercicio = Math.max(0, 7 - errores)
          puntosReto3 += puntosEjercicio
        }
      })
      notaReto3 = puntosReto3 / 10
    }

    // IMPORTANTE: Usar la nota real de la base de datos si está disponible
    const notaTotal = notaReal !== null ? notaReal : (notaReto1 + notaReto2 + notaReto3)

    return {
      reto1: {
        correctas: reto1Correctas,
        total: 4,
        nota: notaReto1,
        notaMaxima: 1
      },
      reto2: {
        casillasCorrectas: casillasCorrectas,
        total: 4,
        nota: notaReto2,
        notaMaxima: 2
      },
      reto3: {
        completados: ejerciciosCompletados,
        total: 10,
        nota: notaReto3,
        notaMaxima: 7,
        puntosObtenidos: puntosReto3
      },
      notaTotal: parseFloat(notaTotal.toFixed(2)),
      notaMaxima: 10
    }
  }

}

module.exports = RespuestaController
