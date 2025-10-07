require('dotenv').config()
const app = require('./src/app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor Proyecto Quipus Backend v2.0 corriendo en puerto ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🏗️  Arquitectura: Clean Architecture`)
  console.log(`📁 Estructura: src/controllers, src/services, src/repositories`)
})
