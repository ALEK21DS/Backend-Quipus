const NotaRepository = require('../repositories/NotaRepository')
const UsuarioRepository = require('../repositories/UsuarioRepository')
const SesionRepository = require('../repositories/SesionRepository')

class NotaService {
  constructor() {
    this.notaRepository = new NotaRepository()
    this.usuarioRepository = new UsuarioRepository()
    this.sesionRepository = new SesionRepository()
  }

  // Crear nota
  async crearNota(datosNota) {
    const { usuarioId, sesionId, contenido, tipoNota = 'SISTEMA' } = datosNota
    
    // Validaciones
    if (!usuarioId || !contenido) {
      throw new Error('Usuario ID y contenido son requeridos')
    }
    
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findById(usuarioId)
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    // Si se proporciona sesionId, verificar que existe
    if (sesionId) {
      const sesion = await this.sesionRepository.findById(sesionId)
      if (!sesion) {
        throw new Error('Sesión no encontrada')
      }
    }
    
    // Validar tipo de nota
    const tiposValidos = ['PROFESOR', 'SISTEMA', 'USUARIO']
    if (!tiposValidos.includes(tipoNota)) {
      throw new Error('Tipo de nota inválido')
    }
    
    return await this.notaRepository.create({
      usuarioId,
      sesionId: sesionId || null,
      contenido: contenido.trim(),
      tipoNota
    })
  }

  // Obtener todas las notas con filtros
  async obtenerTodasNotas(limit = 100, offset = 0, curso = null, nombre = null, apellido = null, edad = null) {
    if (limit > 200) limit = 200 // Limitar máximo 200 resultados
    if (offset < 0) offset = 0
    
    const resultado = await this.notaRepository.findAll(limit, offset, curso, nombre, apellido, edad)
    return resultado
  }

  // Obtener notas de un usuario específico
  async obtenerNotasUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error('Usuario ID es requerido')
    }
    
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findById(usuarioId)
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    
    return await this.notaRepository.findByUsuario(usuarioId)
  }

  // Obtener nota por ID
  async obtenerNotaPorId(id) {
    if (!id) {
      throw new Error('ID de nota es requerido')
    }
    
    const nota = await this.notaRepository.findById(id)
    if (!nota) {
      throw new Error('Nota no encontrada')
    }
    
    return nota
  }

  // Actualizar nota
  async actualizarNota(id, datosActualizacion) {
    const { contenido, tipoNota } = datosActualizacion
    
    if (!id) {
      throw new Error('ID de nota es requerido')
    }
    
    if (!contenido) {
      throw new Error('Contenido es requerido')
    }
    
    // Verificar que la nota existe
    const notaExistente = await this.notaRepository.findById(id)
    if (!notaExistente) {
      throw new Error('Nota no encontrada')
    }
    
    // Validar tipo de nota si se proporciona
    if (tipoNota) {
      const tiposValidos = ['PROFESOR', 'SISTEMA', 'USUARIO']
      if (!tiposValidos.includes(tipoNota)) {
        throw new Error('Tipo de nota inválido')
      }
    }
    
    return await this.notaRepository.update(id, {
      contenido: contenido.trim(),
      ...(tipoNota && { tipoNota })
    })
  }

  // Eliminar nota
  async eliminarNota(id) {
    if (!id) {
      throw new Error('ID de nota es requerido')
    }
    
    // Verificar que la nota existe
    const notaExistente = await this.notaRepository.findById(id)
    if (!notaExistente) {
      throw new Error('Nota no encontrada')
    }
    
    return await this.notaRepository.delete(id)
  }

  // Buscar notas por contenido
  async buscarNotasPorContenido(searchTerm, limit = 50) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
    }
    
    return await this.notaRepository.searchByContent(searchTerm.trim(), limit)
  }

  // Obtener estadísticas de notas
  async obtenerEstadisticasNotas() {
    return await this.notaRepository.getStats()
  }

  // Crear nota automática del sistema
  async crearNotaSistema(usuarioId, sesionId, mensaje) {
    return await this.crearNota({
      usuarioId,
      sesionId,
      contenido: `[SISTEMA] ${mensaje}`,
      tipoNota: 'SISTEMA'
    })
  }

  // Crear nota de profesor
  async crearNotaProfesor(usuarioId, contenido, sesionId = null) {
    return await this.crearNota({
      usuarioId,
      sesionId,
      contenido: `[PROFESOR] ${contenido}`,
      tipoNota: 'PROFESOR'
    })
  }

  // Obtener notas por tipo
  async obtenerNotasPorTipo(tipoNota, limit = 100, offset = 0) {
    const tiposValidos = ['PROFESOR', 'SISTEMA', 'USUARIO']
    if (!tiposValidos.includes(tipoNota)) {
      throw new Error('Tipo de nota inválido')
    }
    
    // Implementar filtro por tipo en el repositorio si es necesario
    const todasLasNotas = await this.obtenerTodasNotas(limit, offset)
    return todasLasNotas.filter(nota => nota.tipoNota === tipoNota)
  }

  // Actualizar o crear nota del juego sumando puntos
  // IMPORTANTE: Se valida por sesionId, no por notaId, porque cada sesión tiene su propia nota del sistema
  // Un usuario puede tener múltiples sesiones (múltiples intentos), cada una con su propia nota
  async actualizarNotaJuego(usuarioId, sesionId, puntosObtenidos) {
    if (!usuarioId || !sesionId || puntosObtenidos === undefined) {
      throw new Error('Usuario ID, Sesión ID y puntos obtenidos son requeridos')
    }

    // Convertir puntos a nota del juego (dividir entre 10)
    const notaAgregar = puntosObtenidos / 10

    // Buscar nota existente del sistema para esta sesión específica
    // Cada sesión tiene su propia nota del sistema que se va actualizando progresivamente
    const notasExistentes = await this.notaRepository.findBySesion(sesionId)
    const notaSistema = notasExistentes.find(n => n.tipoNota === 'SISTEMA')

    if (notaSistema) {
      // Actualizar nota existente de esta sesión sumando la nueva nota
      // Se usa el ID de la nota para actualizar, pero se validó por sesionId
      const calificacionAnterior = notaSistema.calificacion || 0
      const nuevaCalificacion = Math.min(10, calificacionAnterior + notaAgregar) // Máximo 10
      
      return await this.notaRepository.update(notaSistema.id, {
        calificacion: nuevaCalificacion
      })
    } else {
      // Crear nueva nota del sistema para esta sesión
      // Verificar que la sesión existe
      const sesion = await this.sesionRepository.findById(sesionId)
      if (!sesion) {
        throw new Error('Sesión no encontrada')
      }

      return await this.notaRepository.create({
        usuarioId,
        sesionId,
        contenido: `Nota del juego: ${notaAgregar.toFixed(2)}/10`,
        calificacion: Math.min(10, notaAgregar), // Máximo 10
        tipoNota: 'SISTEMA'
      })
    }
  }
}

module.exports = NotaService
