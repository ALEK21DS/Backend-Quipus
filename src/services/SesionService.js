const SesionRepository = require('../repositories/SesionRepository')
const UsuarioRepository = require('../repositories/UsuarioRepository')
const { calcularPuntuacionTotalReto1, calcularPuntuacionNotas } = require('../utils/puntuacion')

class SesionService {
  constructor() {
    this.sesionRepository = new SesionRepository()
    this.usuarioRepository = new UsuarioRepository()
  }

  // Crear nueva sesión de juego
  async crearSesion(usuarioId) {
    if (!usuarioId) {
      throw new Error('Usuario ID es requerido')
    }
    
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findById(usuarioId)
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    return await this.sesionRepository.create(usuarioId)
  }

  // Obtener sesión por ID
  async obtenerSesionPorId(id) {
    if (!id) {
      throw new Error('ID de sesión es requerido')
    }
    
    const sesion = await this.sesionRepository.findById(id)
    if (!sesion) {
      throw new Error('Sesión no encontrada')
    }
    
    return sesion
  }

  // Completar sesión de juego
  async completarSesion(id, datosCompletado) {
    if (!id) {
      throw new Error('ID de sesión es requerido')
    }
    
    // Verificar que la sesión existe
    const sesionExistente = await this.sesionRepository.findById(id)
    if (!sesionExistente) {
      throw new Error('Sesión no encontrada')
    }
    
    // Calcular puntuaciones de todos los retos
    const RespuestaService = require('./RespuestaService')
    const respuestaService = new RespuestaService()
    const puntuaciones = await respuestaService.calcularPuntuacionTotalSesion(id)
    
    // Calcular tiempo total si no se proporciona
    const tiempoTotal = datosCompletado.tiempoTotal || 
      (datosCompletado.fechaFin ? 
        Math.floor((new Date(datosCompletado.fechaFin) - new Date(sesionExistente.fechaInicio)) / 1000) : 
        null
      )
    
    // Preparar datos de actualización incluyendo puntuaciones
    const datosActualizacion = {
      ...datosCompletado,
      tiempoTotal,
      fechaFin: new Date(),
      puntuacionTotal: puntuaciones.puntuacionTotal,
      puntuacionReto1: puntuaciones.puntuacionReto1,
      puntuacionReto2: puntuaciones.puntuacionReto2,
      puntuacionReto3: puntuaciones.puntuacionReto3,
      ejerciciosCompletadosReto3: puntuaciones.ejerciciosCompletadosReto3,
      puntuacionNotas: puntuaciones.puntuacionNotas
    }
    
    // Actualizar la sesión
    const sesionActualizada = await this.sesionRepository.update(id, datosActualizacion)
    
    // Generar notas automáticas del sistema
    await this.generarNotasAutomaticas(sesionActualizada, puntuaciones)
    
    return sesionActualizada
  }

  // Generar notas automáticas basadas en el desempeño
  async generarNotasAutomaticas(sesion, puntuaciones) {
    // No generar notas si el usuario es admin
    const usuario = await this.usuarioRepository.findById(sesion.usuarioId)
    if (usuario && usuario.esAdmin) {
      return // No guardar notas del admin
    }
    
    const NotaRepository = require('../repositories/NotaRepository')
    const notaRepository = new NotaRepository()
    
    // Usar puntuacionNotas (0-10) que ya viene calculada desde el frontend
    // Esta se calcula como puntuacionTotal / 10
    const calificacion = puntuaciones.puntuacionNotas || 0
    
    // Solo crear nota si la calificación es mayor a 0
    if (calificacion === 0) {
      return // No crear nota si la calificación es 0
    }
    
    // Calcular porcentaje total del juego (sobre 100 puntos)
    const porcentajeTotal = (puntuaciones.puntuacionTotal / 100) * 100
    
    // Generar mensaje de retroalimentación
    let mensaje = ''
    if (calificacion === 10) {
      mensaje = `¡Excelente! Obtuviste la máxima calificación. Puntuación total: ${puntuaciones.puntuacionTotal}/100 puntos (${Math.round(porcentajeTotal)}%).`
    } else if (calificacion >= 7) {
      mensaje = `¡Muy bien! Obtuviste ${calificacion}/10. Puntuación total: ${puntuaciones.puntuacionTotal}/100 puntos (${Math.round(porcentajeTotal)}%). ¡Sigue practicando!`
    } else if (calificacion >= 5) {
      mensaje = `Buen esfuerzo. Obtuviste ${calificacion}/10. Puntuación total: ${puntuaciones.puntuacionTotal}/100 puntos (${Math.round(porcentajeTotal)}%). Te recomendamos repasar los conceptos.`
    } else {
      mensaje = `Obtuviste ${calificacion}/10. Puntuación total: ${puntuaciones.puntuacionTotal}/100 puntos (${Math.round(porcentajeTotal)}%). ¡Sigue practicando y no te rindas!`
    }
    
    // Verificar si ya existe una nota para esta sesión y actualizarla, o crear una nueva
    try {
      const notasExistentes = await notaRepository.findBySesion(sesion.id)
      const notaSistema = notasExistentes.find(n => n.tipoNota === 'SISTEMA' && n.sesionId === sesion.id)
      
      if (notaSistema) {
        // Actualizar nota existente
        await notaRepository.update(notaSistema.id, {
          contenido: mensaje,
          calificacion: calificacion
        })
      } else {
        // Crear nueva nota
        await notaRepository.create({
          usuarioId: sesion.usuarioId,
          sesionId: sesion.id,
          contenido: mensaje,
          calificacion: calificacion,
          tipoNota: 'SISTEMA'
        })
      }
    } catch (error) {
      console.error('Error al crear/actualizar nota:', error)
    }
  }

  // Obtener sesiones de un usuario
  async obtenerSesionesUsuario(usuarioId, limit = 10, offset = 0) {
    if (!usuarioId) {
      throw new Error('Usuario ID es requerido')
    }
    
    return await this.sesionRepository.findByUsuario(usuarioId, limit, offset)
  }

  // Obtener tabla de puntuaciones general
  async obtenerTablaPuntuaciones(limit = 50, offset = 0, ordenar = 'puntuacionTotal') {
    const sesiones = await this.sesionRepository.findCompletadas(limit, offset, ordenar)
    const stats = await this.sesionRepository.getStats()
    
    return {
      data: sesiones,
      total: stats.totalSesiones,
      promedio: stats.promedioPuntuacion,
      paginacion: {
        limite: limit,
        offset: offset,
        total: stats.totalSesiones
      }
    }
  }

  // Obtener puntuaciones por curso
  async obtenerPuntuacionesPorCurso(curso, limit = 50, offset = 0) {
    if (!curso) {
      throw new Error('Nombre del curso es requerido')
    }
    
    const sesiones = await this.sesionRepository.findByCurso(curso, limit, offset)
    const totalSesiones = await this.sesionRepository.findByCurso(curso, 1000, 0) // Para contar total
    
    return {
      data: sesiones,
      total: totalSesiones.length,
      curso: curso,
      paginacion: {
        limite: limit,
        offset: offset,
        total: totalSesiones.length
      }
    }
  }

  // Obtener puntuaciones de un usuario específico
  async obtenerPuntuacionesUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error('Usuario ID es requerido')
    }
    
    return await this.sesionRepository.getStatsByUsuario(usuarioId)
  }

  // Obtener estadísticas generales
  async obtenerEstadisticasGenerales() {
    const stats = await this.sesionRepository.getStats()
    const totalUsuarios = await this.usuarioRepository.getStats()
    
    return {
      ...stats,
      totalUsuarios: totalUsuarios.activos
    }
  }

  // Finalizar sesión por tiempo agotado
  async finalizarPorTiempoAgotado(id) {
    if (!id) {
      throw new Error('ID de sesión es requerido')
    }
    
    const datosFinalizacion = {
      completado: false,
      tiempoAgotado: true,
      razonFinJuego: 'TIEMPO_AGOTADO',
      fechaFin: new Date()
    }
    
    return await this.sesionRepository.update(id, datosFinalizacion)
  }

  // Finalizar sesión por salida manual
  async finalizarPorSalidaManual(id) {
    if (!id) {
      throw new Error('ID de sesión es requerido')
    }
    
    const datosFinalizacion = {
      completado: false,
      tiempoAgotado: false,
      razonFinJuego: 'SALIDA_MANUAL',
      fechaFin: new Date()
    }
    
    return await this.sesionRepository.update(id, datosFinalizacion)
  }
}

module.exports = SesionService
