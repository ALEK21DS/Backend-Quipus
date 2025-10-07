const prisma = require('../config/database')

class UsuarioRepository {
  // Crear usuario
  async create(usuarioData) {
    return await prisma.usuario.create({
      data: usuarioData
    })
  }

  // Buscar usuario por ID
  async findById(id) {
    return await prisma.usuario.findUnique({
      where: { id },
      include: {
        sesiones: {
          orderBy: { fechaInicio: 'desc' },
          take: 1
        }
      }
    })
  }

  // Buscar usuario por nombre y apellido
  async findByNombreApellido(nombre, apellido) {
    return await prisma.usuario.findMany({
      where: {
        nombre: { contains: nombre, mode: 'insensitive' },
        apellido: { contains: apellido, mode: 'insensitive' },
        activo: true
      },
      include: {
        sesiones: {
          orderBy: { fechaInicio: 'desc' },
          take: 1
        }
      }
    })
  }

  // Verificar si usuario existe
  async exists(nombre, apellido, curso) {
    return await prisma.usuario.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        apellido: { equals: apellido, mode: 'insensitive' },
        curso: { equals: curso, mode: 'insensitive' }
      }
    })
  }

  // Obtener todos los usuarios
  async findAll(limit = 50, offset = 0) {
    return await prisma.usuario.findMany({
      orderBy: { fechaRegistro: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sesiones: {
          orderBy: { fechaInicio: 'desc' },
          take: 1
        }
      }
    })
  }

  // Actualizar usuario
  async update(id, usuarioData) {
    return await prisma.usuario.update({
      where: { id },
      data: usuarioData
    })
  }

  // Soft delete usuario
  async softDelete(id) {
    return await prisma.usuario.update({
      where: { id },
      data: { activo: false }
    })
  }

  // Obtener estadísticas de usuarios
  async getStats() {
    const total = await prisma.usuario.count()
    const activos = await prisma.usuario.count({ where: { activo: true } })
    const inactivos = await prisma.usuario.count({ where: { activo: false } })
    
    return { total, activos, inactivos }
  }
}

module.exports = UsuarioRepository
