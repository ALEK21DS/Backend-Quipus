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
    // Limpiar datos: eliminar campos con nombres incorrectos (snake_case)
    const cleanData = { ...sesionData };
    delete cleanData.fecha_fin;
    delete cleanData.fecha_inicio;
    delete cleanData.tiempo_total;
    delete cleanData.tiempo_agotado;
    delete cleanData.razon_fin_juego;
    delete cleanData.puntuacion_total;
    delete cleanData.puntuacion_reto1;
    delete cleanData.puntuacion_reto2;
    delete cleanData.puntuacion_reto3;
    delete cleanData.ejercicios_completados_reto3;
    delete cleanData.puntuacion_notas;
    delete cleanData.usuario_id;
    
    return await prisma.sesionJuego.update({
      where: { id },
      data: {
        ...cleanData,
        fechaFin: new Date()
      },
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
