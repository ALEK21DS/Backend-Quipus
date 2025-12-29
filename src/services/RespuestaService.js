const RespuestaRepository = require('../repositories/RespuestaRepository')
const SesionRepository = require('../repositories/SesionRepository')
const { 
  calcularPuntuacionPreguntaReto1,
  calcularPuntuacionPreguntaReto2,
  calcularPuntuacionValidacion,
  calcularPuntuacionEjercicioReto3,
  calcularPuntuacionBase,
  calcularBonusTiempo,
  calcularBonusTiempoReto1,
  calcularBonusTiempoReto2,
  calcularBonusTiempoReto3
} = require('../utils/puntuacion')

class RespuestaService {
  constructor() {
    this.respuestaRepository = new RespuestaRepository()
    this.sesionRepository = new SesionRepository()
  }

  // ================================
  // RETO 1: 4 PREGUNTAS INDEPENDIENTES
  // ================================
  
  async guardarRespuestaReto1(datos) {
    const {
      sesionId,
      preguntaNumero,
      pregunta = `Pregunta ${datos.preguntaNumero} del Reto 1`,  // Valor por defecto
      respuestaCorrecta,  // Ahora viene desde el frontend
      respuestaUsuario,
      tiempoRespuesta
    } = datos
    
    // Validaciones
    if (!sesionId || !preguntaNumero || !respuestaUsuario || !respuestaCorrecta) {
      throw new Error('Datos incompletos para Reto 1')
    }
    
    // Verificar que la sesión existe
    const sesion = await this.sesionRepository.findById(sesionId)
    if (!sesion) {
      throw new Error('Sesión no encontrada')
    }
    
    // Verificar si ya existe una respuesta para esta pregunta
    const respuestaExistente = await this.respuestaRepository.findRespuestaReto1BySesionAndPregunta(sesionId, preguntaNumero)
    
    const esCorrecto = respuestaUsuario === respuestaCorrecta
    const intentoNumero = respuestaExistente ? respuestaExistente.intentoNumero + 1 : 1
    
    // Calcular puntuación base y bonus de tiempo por separado
    const puntuacionBase = calcularPuntuacionBase(intentoNumero)
    const bonusTiempo = calcularBonusTiempoReto1(tiempoRespuesta) // Bonus específico para Reto 1
    const puntuacionTotal = puntuacionBase + bonusTiempo
    
    const respuestaData = {
      sesionId,
      preguntaNumero,
      pregunta,
      // Omitir opciones para evitar problemas con Json en PostgreSQL
      respuestaCorrecta,
      respuestaUsuario,
      esCorrecto,
      intentoNumero,
      tiempoRespuesta,
      puntuacionBase,
      bonusTiempo,
      puntuacionTotal
    }
    
    let respuesta
    if (respuestaExistente) {
      respuesta = await this.respuestaRepository.updateRespuestaReto1(respuestaExistente.id, respuestaData)
    } else {
      respuesta = await this.respuestaRepository.createRespuestaReto1(respuestaData)
    }
    
    // Si la respuesta es correcta, actualizar la nota del juego
    // Cada pregunta correcta vale 2.5 puntos, se divide entre 10 para obtener la nota
    if (esCorrecto) {
      const NotaService = require('./NotaService')
      const notaService = new NotaService()
      try {
        await notaService.actualizarNotaJuego(sesion.usuarioId, sesionId, 2.5)
      } catch (error) {
        console.error('Error al actualizar nota del juego:', error)
        // No lanzar error para no interrumpir el flujo
      }
    }
    
    return respuesta
  }

  // ================================
  // RETO 2: 1 PREGUNTA CON 4 OPCIONES
  // ================================
  
  async guardarRespuestaReto2(datos) {
    const {
      sesionId,
      pregunta = 'Completar texto sobre factorización',  // Valor por defecto
      respuestaCorrecta,  // JSON string con las respuestas correctas
      respuestaUsuario,   // JSON string con las respuestas del usuario
      casillasCorrectas = 0,  // Número de casillas correctas (0-4)
      totalCasillas = 4,      // Total de casillas
      tiempoRespuesta
    } = datos
    
    // Validaciones
    if (!sesionId || !respuestaUsuario) {
      throw new Error('Datos incompletos para Reto 2')
    }
    
    // Verificar que la sesión existe
    const sesion = await this.sesionRepository.findById(sesionId)
    if (!sesion) {
      throw new Error('Sesión no encontrada')
    }
    
    // Verificar si ya existe una respuesta para el Reto 2
    const respuestaExistente = await this.respuestaRepository.findRespuestaReto2BySesion(sesionId)
    
    // Todas las casillas deben estar correctas para marcar como correcto
    const esCorrecto = casillasCorrectas === totalCasillas
    const intentoNumero = respuestaExistente ? respuestaExistente.intentoNumero + 1 : 1
    
    // Calcular puntuación proporcional basada en casillas correctas
    const puntuacionBaseMaxima = calcularPuntuacionBase(intentoNumero)
    const bonusTiempoMaximo = calcularBonusTiempoReto2(tiempoRespuesta) // Bonus específico para Reto 2
    const puntuacionMaxima = puntuacionBaseMaxima + bonusTiempoMaximo
    
    const puntuacionBase = Math.floor((puntuacionBaseMaxima * casillasCorrectas) / totalCasillas)
    const bonusTiempo = Math.floor((bonusTiempoMaximo * casillasCorrectas) / totalCasillas)
    const puntuacionTotal = puntuacionBase + bonusTiempo
    
    const respuestaData = {
      sesionId,
      pregunta,
      // Omitir opciones para evitar problemas con Json en PostgreSQL
      respuestaCorrecta,
      respuestaUsuario,
      esCorrecto,
      intentoNumero,
      tiempoRespuesta,
      puntuacionBase,
      bonusTiempo,
      puntuacionTotal
    }
    
    let respuesta
    if (respuestaExistente) {
      respuesta = await this.respuestaRepository.updateRespuestaReto2(respuestaExistente.id, respuestaData)
    } else {
      respuesta = await this.respuestaRepository.createRespuestaReto2(respuestaData)
    }
    
    // Calcular puntos obtenidos: cada blank correcto vale 5 puntos
    const puntosObtenidos = casillasCorrectas * 5
    
    // Actualizar la nota del juego: puntos obtenidos / 10
    if (puntosObtenidos > 0) {
      const NotaService = require('./NotaService')
      const notaService = new NotaService()
      try {
        await notaService.actualizarNotaJuego(sesion.usuarioId, sesionId, puntosObtenidos)
      } catch (error) {
        console.error('Error al actualizar nota del juego:', error)
        // No lanzar error para no interrumpir el flujo
      }
    }
    
    return respuesta
  }

  // ================================
  // RETO 3: 10 EJERCICIOS CON 3 VALIDACIONES
  // ================================
  
  async guardarRespuestaReto3(datos) {
    const {
      sesionId,
      ejercicioNumero,
      ecuacionOriginal = 'Ecuación no especificada',  // Valor por defecto
      validacion1 = { correcta: true, intento: 1, tiempo: 10, respuesta: 'Validación 1' },
      validacion2 = { correcta: true, intento: 1, tiempo: 10, respuesta: 'Validación 2' },
      validacion3 = { correcta: true, intento: 1, tiempo: 10, respuesta: 'Validación 3' },
      puntuacionFinal = 0  // Puntuación final del ejercicio (0-7)
    } = datos
    
    // Validaciones
    if (!sesionId || !ejercicioNumero) {
      throw new Error('Datos incompletos para Reto 3')
    }
    
    // Verificar que la sesión existe (con timeout más largo)
    let sesion
    try {
      sesion = await Promise.race([
        this.sesionRepository.findById(sesionId),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al buscar sesión')), 15000)
        )
      ])
    } catch (error) {
      console.error('Error al buscar sesión:', error)
      throw new Error('Error al verificar sesión. Intenta nuevamente.')
    }
    
    if (!sesion) {
      throw new Error('Sesión no encontrada')
    }
    
    // Calcular puntuaciones individuales usando la función que incluye bonus de tiempo
    const puntuacion1 = validacion1.correcta ? 
      calcularPuntuacionValidacion(validacion1.intento, validacion1.tiempo) : 0
    const puntuacion2 = validacion2.correcta ? 
      calcularPuntuacionValidacion(validacion2.intento, validacion2.tiempo) : 0
    const puntuacion3 = validacion3.correcta ? 
      calcularPuntuacionValidacion(validacion3.intento, validacion3.tiempo) : 0
    
    const puntuacionTotal = puntuacion1 + puntuacion2 + puntuacion3
    const completado = validacion1.correcta && validacion2.correcta && validacion3.correcta
    
    // Calcular bonus de tiempo total
    const bonusTiempo1 = validacion1.correcta ? calcularBonusTiempoReto3(validacion1.tiempo) : 0
    const bonusTiempo2 = validacion2.correcta ? calcularBonusTiempoReto3(validacion2.tiempo) : 0
    const bonusTiempo3 = validacion3.correcta ? calcularBonusTiempoReto3(validacion3.tiempo) : 0
    const bonusTiempo = bonusTiempo1 + bonusTiempo2 + bonusTiempo3
    
    // Verificar si ya existe una respuesta para este ejercicio (con timeout)
    let respuestaExistente
    try {
      respuestaExistente = await Promise.race([
        this.respuestaRepository.findRespuestaReto3BySesionAndEjercicio(sesionId, ejercicioNumero),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al buscar respuesta existente')), 15000)
        )
      ])
    } catch (error) {
      console.error('Error al buscar respuesta existente:', error)
      // Continuar como si no existiera para no bloquear el flujo
      respuestaExistente = null
    }
    
    const respuestaData = {
      sesionId,
      ejercicioNumero,
      ecuacionOriginal,
      validacion1Correcta: validacion1.correcta,
      validacion1Intento: validacion1.intento,
      validacion1Tiempo: validacion1.tiempo,
      validacion1Puntuacion: puntuacion1,
      respuestaUsuario1: validacion1.respuesta,
      validacion2Correcta: validacion2.correcta,
      validacion2Intento: validacion2.intento,
      validacion2Tiempo: validacion2.tiempo,
      validacion2Puntuacion: puntuacion2,
      respuestaUsuario2: validacion2.respuesta,
      validacion3Correcta: validacion3.correcta,
      validacion3Intento: validacion3.intento,
      validacion3Tiempo: validacion3.tiempo,
      validacion3Puntuacion: puntuacion3,
      respuestaUsuario3: validacion3.respuesta,
      puntuacionTotal,
      completado,
      bonusTiempo
    }
    
    let respuesta
    if (respuestaExistente) {
      respuesta = await this.respuestaRepository.updateRespuestaReto3(respuestaExistente.id, respuestaData)
    } else {
      respuesta = await this.respuestaRepository.createRespuestaReto3(respuestaData)
    }
    
    // Actualizar la nota del juego: puntuación final / 10
    // La puntuación final ya viene calculada desde el frontend (7 puntos iniciales - penalizaciones)
    if (puntuacionFinal > 0) {
      const NotaService = require('./NotaService')
      const notaService = new NotaService()
      try {
        await notaService.actualizarNotaJuego(sesion.usuarioId, sesionId, puntuacionFinal)
      } catch (error) {
        console.error('Error al actualizar nota del juego:', error)
        // No lanzar error para no interrumpir el flujo
      }
    }
    
    return respuesta
  }

  // ================================
  // MÉTODOS GENERALES
  // ================================
  
  async obtenerRespuestasSesion(sesionId) {
    if (!sesionId) {
      throw new Error('ID de sesión es requerido')
    }
    
    return await this.respuestaRepository.getRespuestasBySesion(sesionId)
  }

  async obtenerEstadisticasRespuestas(sesionId) {
    if (!sesionId) {
      throw new Error('ID de sesión es requerido')
    }
    
    return await this.respuestaRepository.getEstadisticasRespuestas(sesionId)
  }

  // Calcular puntuación total de una sesión
  async calcularPuntuacionTotalSesion(sesionId) {
    const respuestas = await this.obtenerRespuestasSesion(sesionId)
    
    let puntuacionTotal = 0
    let puntuacionReto1 = 0
    let puntuacionReto2 = 0
    let puntuacionReto3 = 0
    let ejerciciosCompletadosReto3 = 0
    
    // Sumar puntuaciones del Reto 1
    respuestas.reto1.forEach(respuesta => {
      puntuacionReto1 += respuesta.puntuacionTotal
    })
    
    // Sumar puntuaciones del Reto 2
    respuestas.reto2.forEach(respuesta => {
      puntuacionReto2 += respuesta.puntuacionTotal
    })
    
    // Sumar puntuaciones del Reto 3
    respuestas.reto3.forEach(respuesta => {
      puntuacionReto3 += respuesta.puntuacionTotal
      if (respuesta.completado) {
        ejerciciosCompletadosReto3++
      }
    })
    
    puntuacionTotal = puntuacionReto1 + puntuacionReto2 + puntuacionReto3
    
    return {
      puntuacionTotal,
      puntuacionReto1,
      puntuacionReto2,
      puntuacionReto3,
      ejerciciosCompletadosReto3,
      puntuacionNotas: ejerciciosCompletadosReto3 // Para tabla de notas (0-10)
    }
  }
}

module.exports = RespuestaService
