const prisma = require('../config/database')

class RespuestaRepository {
  // ================================
  // RETO 1: 4 PREGUNTAS INDEPENDIENTES
  // ================================
  
  async createRespuestaReto1(respuestaData) {
    return await prisma.respuestaReto1.create({
      data: respuestaData
    })
  }

  async updateRespuestaReto1(id, respuestaData) {
    return await prisma.respuestaReto1.update({
      where: { id },
      data: respuestaData
    })
  }

  async findRespuestaReto1BySesionAndPregunta(sesionId, preguntaNumero) {
    return await prisma.respuestaReto1.findFirst({
      where: {
        sesionId,
        preguntaNumero
      }
    })
  }

  // ================================
  // RETO 2: 1 PREGUNTA CON 4 OPCIONES
  // ================================
  
  async createRespuestaReto2(respuestaData) {
    return await prisma.respuestaReto2.create({
      data: respuestaData
    })
  }

  async updateRespuestaReto2(id, respuestaData) {
    return await prisma.respuestaReto2.update({
      where: { id },
      data: respuestaData
    })
  }

  async findRespuestaReto2BySesion(sesionId) {
    return await prisma.respuestaReto2.findFirst({
      where: { sesionId }
    })
  }

  // ================================
  // RETO 3: 10 EJERCICIOS CON 3 VALIDACIONES
  // ================================
  
  async createRespuestaReto3(respuestaData) {
    // Usar upsert para evitar errores de unicidad
    return await prisma.respuestaReto3.upsert({
      where: {
        sesionId_ejercicioNumero: {
          sesionId: respuestaData.sesionId,
          ejercicioNumero: respuestaData.ejercicioNumero
        }
      },
      update: respuestaData,
      create: respuestaData
    })
  }

  async updateRespuestaReto3(id, respuestaData) {
    return await prisma.respuestaReto3.update({
      where: { id },
      data: respuestaData
    })
  }

  async findRespuestaReto3BySesionAndEjercicio(sesionId, ejercicioNumero) {
    return await prisma.respuestaReto3.findFirst({
      where: {
        sesionId,
        ejercicioNumero
      }
    })
  }

  // ================================
  // MÉTODOS GENERALES
  // ================================
  
  async getRespuestasBySesion(sesionId) {
    const respuestas = {
      reto1: await prisma.respuestaReto1.findMany({
        where: { sesionId },
        orderBy: { preguntaNumero: 'asc' }
      }),
      reto2: await prisma.respuestaReto2.findMany({
        where: { sesionId }
      }),
      reto3: await prisma.respuestaReto3.findMany({
        where: { sesionId },
        orderBy: { ejercicioNumero: 'asc' }
      })
    }
    
    return respuestas
  }

  async getEstadisticasRespuestas(sesionId) {
    const respuestas = await this.getRespuestasBySesion(sesionId)
    
    // Calcular estadísticas
    const totalPreguntasReto1 = respuestas.reto1.length
    const correctasReto1 = respuestas.reto1.filter(r => r.esCorrecto).length
    
    const totalPreguntasReto2 = respuestas.reto2.length
    const correctasReto2 = respuestas.reto2.filter(r => r.esCorrecto).length
    
    const totalEjerciciosReto3 = respuestas.reto3.length
    const completadosReto3 = respuestas.reto3.filter(r => r.completado).length
    
    return {
      reto1: {
        total: totalPreguntasReto1,
        correctas: correctasReto1,
        porcentaje: totalPreguntasReto1 > 0 ? (correctasReto1 / totalPreguntasReto1) * 100 : 0
      },
      reto2: {
        total: totalPreguntasReto2,
        correctas: correctasReto2,
        porcentaje: totalPreguntasReto2 > 0 ? (correctasReto2 / totalPreguntasReto2) * 100 : 0
      },
      reto3: {
        total: totalEjerciciosReto3,
        completados: completadosReto3,
        porcentaje: totalEjerciciosReto3 > 0 ? (completadosReto3 / totalEjerciciosReto3) * 100 : 0
      }
    }
  }
}

module.exports = RespuestaRepository
