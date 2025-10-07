const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Error de validación de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Conflicto de datos',
      message: 'Ya existe un registro con estos datos únicos'
    })
  }

  // Error de registro no encontrado en Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Registro no encontrado',
      message: 'El registro solicitado no existe'
    })
  }

  // Error de conexión a la base de datos
  if (err.code === 'P1001') {
    return res.status(503).json({
      success: false,
      error: 'Servicio no disponible',
      message: 'Error de conexión a la base de datos'
    })
  }

  // Error de sintaxis SQL
  if (err.code === 'P2014') {
    return res.status(400).json({
      success: false,
      error: 'Error de relación',
      message: 'No se puede realizar esta operación debido a relaciones existentes'
    })
  }

  // Error de validación de JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'El formato del JSON enviado es inválido'
    })
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      message: err.message
    })
  }

  // Error de autorización
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: 'Token de acceso inválido o expirado'
    })
  }

  // Error de permisos
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado',
      message: 'No tienes permisos para realizar esta acción'
    })
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  })
}

module.exports = errorHandler
