const validarUsuario = (req, res, next) => {
  const { nombre, apellido, edad, curso } = req.body

  // Validar campos requeridos
  if (!nombre || !apellido || !edad || !curso) {
    return res.status(400).json({
      success: false,
      error: 'Campos requeridos faltantes',
      message: 'nombre, apellido, edad y curso son requeridos'
    })
  }

  // Validar tipos de datos
  if (typeof nombre !== 'string' || typeof apellido !== 'string' || typeof curso !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Tipos de datos inválidos',
      message: 'nombre, apellido y curso deben ser strings'
    })
  }

  // Validar edad
  const edadNum = parseInt(edad)
  if (isNaN(edadNum) || edadNum < 5 || edadNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'Edad inválida',
      message: 'La edad debe ser un número entre 5 y 100 años'
    })
  }

  // Validar longitud de strings
  if (nombre.trim().length < 2 || nombre.trim().length > 50) {
    return res.status(400).json({
      success: false,
      error: 'Nombre inválido',
      message: 'El nombre debe tener entre 2 y 50 caracteres'
    })
  }

  if (apellido.trim().length < 2 || apellido.trim().length > 50) {
    return res.status(400).json({
      success: false,
      error: 'Apellido inválido',
      message: 'El apellido debe tener entre 2 y 50 caracteres'
    })
  }

  if (curso.trim().length < 2 || curso.trim().length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Curso inválido',
      message: 'El curso debe tener entre 2 y 100 caracteres'
    })
  }

  next()
}

const validarSesion = (req, res, next) => {
  const { usuarioId } = req.body

  if (!usuarioId) {
    return res.status(400).json({
      success: false,
      error: 'Usuario ID requerido',
      message: 'El ID del usuario es obligatorio'
    })
  }

  // Validar formato de CUID (generado por Prisma)
  // CUID tiene formato: c + timestamp + counter + fingerprint + random
  // Ejemplo: cmgfjwwau0002vqgtlhv7odkg (25 caracteres alfanuméricos)
  const cuidRegex = /^c[a-z0-9]{24}$/i
  if (!cuidRegex.test(usuarioId)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de ID inválido',
      message: 'El ID del usuario tiene un formato inválido'
    })
  }

  next()
}

const validarRespuestaReto1 = (req, res, next) => {
  const { sesionId, preguntaNumero, respuestaUsuario, tiempoRespuesta } = req.body

  if (!sesionId || !preguntaNumero || !respuestaUsuario || !tiempoRespuesta) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos',
      message: 'sesionId, preguntaNumero, respuestaUsuario y tiempoRespuesta son requeridos'
    })
  }

  // Validar número de pregunta
  if (preguntaNumero < 1 || preguntaNumero > 4) {
    return res.status(400).json({
      success: false,
      error: 'Número de pregunta inválido',
      message: 'La pregunta debe estar entre 1 y 4'
    })
  }

  // Validar respuesta
  if (!['A', 'B', 'C', 'D'].includes(respuestaUsuario.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: 'Respuesta inválida',
      message: 'La respuesta debe ser A, B, C o D'
    })
  }

  // Validar tiempo
  if (typeof tiempoRespuesta !== 'number' || tiempoRespuesta < 0) {
    return res.status(400).json({
      success: false,
      error: 'Tiempo inválido',
      message: 'El tiempo de respuesta debe ser un número positivo'
    })
  }

  next()
}

const validarRespuestaReto2 = (req, res, next) => {
  const { sesionId, respuestaUsuario, tiempoRespuesta } = req.body

  if (!sesionId || !tiempoRespuesta) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos',
      message: 'sesionId y tiempoRespuesta son requeridos'
    })
  }

  // Validar respuesta (puede ser string o JSON con las respuestas de los espacios en blanco)
  if (!respuestaUsuario) {
    return res.status(400).json({
      success: false,
      error: 'Respuesta inválida',
      message: 'respuestaUsuario es requerido'
    })
  }

  // Validar tiempo
  if (typeof tiempoRespuesta !== 'number' || tiempoRespuesta < 0) {
    return res.status(400).json({
      success: false,
      error: 'Tiempo inválido',
      message: 'El tiempo de respuesta debe ser un número positivo'
    })
  }

  next()
}

const validarRespuestaReto3 = (req, res, next) => {
  const { sesionId, ejercicioNumero } = req.body

  if (!sesionId || !ejercicioNumero) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos',
      message: 'sesionId y ejercicioNumero son requeridos'
    })
  }

  // Validar número de ejercicio
  if (ejercicioNumero < 1 || ejercicioNumero > 10) {
    return res.status(400).json({
      success: false,
      error: 'Número de ejercicio inválido',
      message: 'El ejercicio debe estar entre 1 y 10'
    })
  }

  next()
}

const validarNota = (req, res, next) => {
  const { usuarioId, contenido, tipoNota } = req.body

  if (!usuarioId || !contenido) {
    return res.status(400).json({
      success: false,
      error: 'Campos requeridos faltantes',
      message: 'usuarioId y contenido son requeridos'
    })
  }

  // Validar contenido
  if (typeof contenido !== 'string' || contenido.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Contenido inválido',
      message: 'El contenido debe tener al menos 5 caracteres'
    })
  }

  // Validar tipo de nota si se proporciona
  if (tipoNota && !['PROFESOR', 'SISTEMA', 'USUARIO'].includes(tipoNota)) {
    return res.status(400).json({
      success: false,
      error: 'Tipo de nota inválido',
      message: 'El tipo de nota debe ser PROFESOR, SISTEMA o USUARIO'
    })
  }

  next()
}

const validarPaginacion = (req, res, next) => {
  const { limite, offset } = req.query

  // Validar límite
  if (limite && (isNaN(limite) || parseInt(limite) < 1 || parseInt(limite) > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Límite inválido',
      message: 'El límite debe ser un número entre 1 y 100'
    })
  }

  // Validar offset
  if (offset && (isNaN(offset) || parseInt(offset) < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Offset inválido',
      message: 'El offset debe ser un número mayor o igual a 0'
    })
  }

  next()
}

module.exports = {
  validarUsuario,
  validarSesion,
  validarRespuestaReto1,
  validarRespuestaReto2,
  validarRespuestaReto3,
  validarNota,
  validarPaginacion
}
