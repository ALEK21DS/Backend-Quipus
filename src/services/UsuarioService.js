const UsuarioRepository = require('../repositories/UsuarioRepository')

class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository()
  }

  // Crear usuario con validaciones
  async crearUsuario(usuarioData) {
    const { nombre, apellido, edad, curso } = usuarioData
    
    // Validar datos requeridos
    if (!nombre || !apellido || !edad || !curso) {
      throw new Error('Datos incompletos: nombre, apellido, edad y curso son requeridos')
    }
    
    // Validar edad
    if (isNaN(edad) || edad < 5 || edad > 100) {
      throw new Error('La edad debe ser un número entre 5 y 100 años')
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.exists(nombre, apellido, curso)
    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con ese nombre, apellido y curso')
    }
    
    // Determinar si es admin
    const esAdmin = this.esAdmin(nombre.trim().toUpperCase(), apellido.trim().toUpperCase())
    
    // Crear usuario
    return await this.usuarioRepository.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      edad: parseInt(edad),
      curso: curso.trim(),
      esAdmin: esAdmin
    })
  }

  // Obtener usuario por ID
  async obtenerUsuarioPorId(id) {
    if (!id) {
      throw new Error('ID de usuario es requerido')
    }
    
    const usuario = await this.usuarioRepository.findById(id)
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    return usuario
  }

  // Buscar usuarios por nombre y apellido
  async buscarUsuarios(nombre, apellido) {
    if (!nombre && !apellido) {
      throw new Error('Al menos uno de los parámetros (nombre o apellido) es requerido')
    }
    
    return await this.usuarioRepository.findByNombreApellido(nombre, apellido)
  }

  // Obtener todos los usuarios con paginación
  async obtenerTodosUsuarios(limit = 50, offset = 0) {
    if (limit > 100) limit = 100 // Limitar máximo 100 resultados
    if (offset < 0) offset = 0
    
    return await this.usuarioRepository.findAll(limit, offset)
  }

  // Actualizar usuario
  async actualizarUsuario(id, usuarioData) {
    if (!id) {
      throw new Error('ID de usuario es requerido')
    }
    
    // Verificar que el usuario existe
    const usuarioExistente = await this.usuarioRepository.findById(id)
    if (!usuarioExistente) {
      throw new Error('Usuario no encontrado')
    }
    
    // Validar edad si se proporciona
    if (usuarioData.edad && (isNaN(usuarioData.edad) || usuarioData.edad < 5 || usuarioData.edad > 100)) {
      throw new Error('La edad debe ser un número entre 5 y 100 años')
    }
    
    // Preparar datos para actualización
    const datosActualizacion = {}
    if (usuarioData.nombre) datosActualizacion.nombre = usuarioData.nombre.trim()
    if (usuarioData.apellido) datosActualizacion.apellido = usuarioData.apellido.trim()
    if (usuarioData.edad) datosActualizacion.edad = parseInt(usuarioData.edad)
    if (usuarioData.curso) datosActualizacion.curso = usuarioData.curso.trim()
    if (typeof usuarioData.activo === 'boolean') datosActualizacion.activo = usuarioData.activo
    
    return await this.usuarioRepository.update(id, datosActualizacion)
  }

  // Eliminar usuario (soft delete)
  async eliminarUsuario(id) {
    if (!id) {
      throw new Error('ID de usuario es requerido')
    }
    
    // Verificar que el usuario existe
    const usuarioExistente = await this.usuarioRepository.findById(id)
    if (!usuarioExistente) {
      throw new Error('Usuario no encontrado')
    }
    
    return await this.usuarioRepository.softDelete(id)
  }

  // Obtener estadísticas de usuarios
  async obtenerEstadisticas() {
    return await this.usuarioRepository.getStats()
  }

  // Validar si es admin
  esAdmin(nombre, apellido) {
    return nombre === 'ADMIN' && apellido === 'ADMIN'
  }
}

module.exports = UsuarioService
