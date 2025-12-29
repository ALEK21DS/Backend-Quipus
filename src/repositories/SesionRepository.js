const prisma = require('../config/database')

class SesionRepository {
  // Crear nueva sesión
  async create(usuarioId) {
    return await prisma.sesionJuego.create({
      data: {
        usuarioId,
        fechaInicio: new Date()
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true
          }
        }
      }
    })
  }

  // Buscar sesión por ID
  async findById(id) {
    return await prisma.sesionJuego.findUnique({
      where: { id },
      include: {
        usuario: true,
        respuestasReto1: true,
        respuestasReto2: true,
        respuestasReto3: true,
        notas: true
      }
    })
  }

  // Actualizar sesión
  async update(id, sesionData) {
    // Limpiar datos: eliminar campos con nombres incorrectos (snake_case) y convertirlos a camelCase
    const cleanData = { ...sesionData };
    
    // Convertir campos snake_case a camelCase
    if (cleanData.fecha_fin !== undefined) {
      cleanData.fechaFin = cleanData.fecha_fin;
      delete cleanData.fecha_fin;
    }
    if (cleanData.fecha_inicio !== undefined) {
      cleanData.fechaInicio = cleanData.fecha_inicio;
      delete cleanData.fecha_inicio;
    }
    if (cleanData.tiempo_total !== undefined) {
      cleanData.tiempoTotal = cleanData.tiempo_total;
      delete cleanData.tiempo_total;
    }
    if (cleanData.tiempo_agotado !== undefined) {
      cleanData.tiempoAgotado = cleanData.tiempo_agotado;
      delete cleanData.tiempo_agotado;
    }
    if (cleanData.razon_fin_juego !== undefined) {
      cleanData.razonFinJuego = cleanData.razon_fin_juego;
      delete cleanData.razon_fin_juego;
    }
    if (cleanData.puntuacion_total !== undefined) {
      cleanData.puntuacionTotal = cleanData.puntuacion_total;
      delete cleanData.puntuacion_total;
    }
    if (cleanData.puntuacion_reto1 !== undefined) {
      cleanData.puntuacionReto1 = cleanData.puntuacion_reto1;
      delete cleanData.puntuacion_reto1;
    }
    if (cleanData.puntuacion_reto2 !== undefined) {
      cleanData.puntuacionReto2 = cleanData.puntuacion_reto2;
      delete cleanData.puntuacion_reto2;
    }
    if (cleanData.puntuacion_reto3 !== undefined) {
      cleanData.puntuacionReto3 = cleanData.puntuacion_reto3;
      delete cleanData.puntuacion_reto3;
    }
    if (cleanData.ejercicios_completados_reto3 !== undefined) {
      cleanData.ejerciciosCompletadosReto3 = cleanData.ejercicios_completados_reto3;
      delete cleanData.ejercicios_completados_reto3;
    }
    if (cleanData.puntuacion_notas !== undefined) {
      cleanData.puntuacionNotas = cleanData.puntuacion_notas;
      delete cleanData.puntuacion_notas;
    }
    if (cleanData.usuario_id !== undefined) {
      cleanData.usuarioId = cleanData.usuario_id;
      delete cleanData.usuario_id;
    }
    
    // Si no se proporciona fechaFin explícitamente, usar la fecha actual
    if (!cleanData.fechaFin) {
      cleanData.fechaFin = new Date();
    }
    
    return await prisma.sesionJuego.update({
      where: { id },
      data: cleanData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true
          }
        },
        respuestasReto1: true,
        respuestasReto2: true,
        respuestasReto3: true
      }
    })
  }

  // Obtener sesiones de un usuario
  async findByUsuario(usuarioId, limit = 10, offset = 0) {
    return await prisma.sesionJuego.findMany({
      where: { usuarioId },
      orderBy: { fechaInicio: 'desc' },
      take: limit,
      skip: offset,
      include: {
        respuestasReto1: true,
        respuestasReto2: true,
        respuestasReto3: true
      }
    })
  }

  // Obtener sesiones completadas
  async findCompletadas(limit = 50, offset = 0, ordenar = 'puntuacionTotal') {
    return await prisma.sesionJuego.findMany({
      where: { 
        completado: true,
        usuario: {
          esAdmin: false // Excluir sesiones del admin
        }
      },
      orderBy: { [ordenar]: 'desc' },
      take: limit,
      skip: offset,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true
          }
        }
      }
    })
  }

  // Obtener sesiones por curso
  async findByCurso(curso, limit = 50, offset = 0) {
    return await prisma.sesionJuego.findMany({
      where: {
        completado: true,
        usuario: {
          curso: {
            equals: curso,
            mode: 'insensitive'
          },
          esAdmin: false // Excluir sesiones del admin
        }
      },
      orderBy: { puntuacionTotal: 'desc' },
      take: limit,
      skip: offset,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true
          }
        }
      }
    })
  }

  // Obtener estadísticas de sesiones
  async getStats() {
    const totalSesiones = await prisma.sesionJuego.count({
      where: { 
        completado: true,
        usuario: {
          esAdmin: false // Excluir sesiones del admin
        }
      }
    })
    
    const promedioPuntuacion = await prisma.sesionJuego.aggregate({
      where: { 
        completado: true,
        usuario: {
          esAdmin: false // Excluir sesiones del admin
        }
      },
      _avg: { puntuacionTotal: true }
    })
    
    const topPuntuaciones = await prisma.sesionJuego.findMany({
      where: { 
        completado: true,
        usuario: {
          esAdmin: false // Excluir sesiones del admin
        }
      },
      orderBy: { puntuacionTotal: 'desc' },
      take: 10,
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            curso: true
          }
        }
      }
    })
    
    return {
      totalSesiones,
      promedioPuntuacion: promedioPuntuacion._avg.puntuacionTotal || 0,
      topPuntuaciones
    }
  }

  // Obtener estadísticas de un usuario
  async getStatsByUsuario(usuarioId) {
    const sesiones = await prisma.sesionJuego.findMany({
      where: {
        usuarioId,
        completado: true
      },
      include: {
        respuestasReto1: true,
        respuestasReto2: true,
        respuestasReto3: true
      }
    })
    
    const estadisticas = await prisma.sesionJuego.aggregate({
      where: {
        usuarioId,
        completado: true
      },
      _count: true,
      _avg: {
        puntuacionTotal: true,
        puntuacionReto1: true,
        puntuacionReto2: true,
        puntuacionReto3: true,
        puntuacionNotas: true
      },
      _max: {
        puntuacionTotal: true
      }
    })
    
    return {
      sesiones,
      estadisticas: {
        totalSesiones: estadisticas._count,
        promedioTotal: estadisticas._avg.puntuacionTotal || 0,
        promedioReto1: estadisticas._avg.puntuacionReto1 || 0,
        promedioReto2: estadisticas._avg.puntuacionReto2 || 0,
        promedioReto3: estadisticas._avg.puntuacionReto3 || 0,
        promedioNotas: estadisticas._avg.puntuacionNotas || 0,
        mejorPuntuacion: estadisticas._max.puntuacionTotal || 0
      }
    }
  }
}

module.exports = SesionRepository
