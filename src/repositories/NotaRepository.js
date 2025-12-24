const prisma = require('../config/database')

class NotaRepository {
  // Crear nota
  async create(notaData) {
    return await prisma.notaJuego.create({
      data: notaData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true,
            edad: true
          }
        },
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }

  // Buscar nota por ID
  async findById(id) {
    return await prisma.notaJuego.findUnique({
      where: { id },
      include: {
        usuario: true,
        sesion: true
      }
    })
  }

  // Obtener todas las notas
  async findAll(limit = 100, offset = 0, curso = null) {
    let whereClause = {
      usuario: {
        esAdmin: false // Excluir notas del admin
      }
    }
    
    if (curso) {
      whereClause.usuario = {
        ...whereClause.usuario,
        curso: {
          equals: curso,
          mode: 'insensitive'
        }
      }
    }
    
    return await prisma.notaJuego.findMany({
      where: whereClause,
      orderBy: { fechaCreacion: 'desc' },
      take: limit,
      skip: offset,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true,
            edad: true
          }
        },
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }

  // Obtener notas de un usuario
  async findByUsuario(usuarioId) {
    return await prisma.notaJuego.findMany({
      where: { usuarioId },
      orderBy: { fechaCreacion: 'desc' },
      include: {
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }

  // Obtener notas de una sesión
  async findBySesion(sesionId) {
    return await prisma.notaJuego.findMany({
      where: { sesionId },
      orderBy: { fechaCreacion: 'desc' },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true,
            edad: true
          }
        },
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }

  // Actualizar nota
  async update(id, notaData) {
    return await prisma.notaJuego.update({
      where: { id },
      data: notaData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true,
            edad: true
          }
        },
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }

  // Eliminar nota
  async delete(id) {
    return await prisma.notaJuego.delete({
      where: { id }
    })
  }

  // Obtener estadísticas de notas
  async getStats() {
    const totalNotas = await prisma.notaJuego.count({
      where: {
        usuario: {
          esAdmin: false // Excluir notas del admin
        }
      }
    })
    
    const notasPorTipo = await prisma.notaJuego.groupBy({
      by: ['tipoNota'],
      _count: true
    })
    
    const notasPorCurso = await prisma.notaJuego.groupBy({
      by: ['usuario'],
      _count: true,
      include: {
        usuario: {
          select: {
            curso: true
          }
        }
      }
    })
    
    return {
      totalNotas,
      notasPorTipo,
      notasPorCurso
    }
  }

  // Buscar notas por contenido
  async searchByContent(searchTerm, limit = 50) {
    return await prisma.notaJuego.findMany({
      where: {
        contenido: {
          contains: searchTerm,
          mode: 'insensitive'
        },
        usuario: {
          esAdmin: false // Excluir notas del admin
        }
      },
      orderBy: { fechaCreacion: 'desc' },
      take: limit,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            curso: true,
            edad: true
          }
        },
        sesion: {
          select: {
            id: true,
            fechaInicio: true,
            puntuacionTotal: true,
            puntuacionNotas: true
          }
        }
      }
    })
  }
}

module.exports = NotaRepository
