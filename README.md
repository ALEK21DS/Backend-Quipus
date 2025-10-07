# 🎮 Proyecto Quipus Backend

Backend para el juego educativo "Los Nudos del Saber: Aventura Matemática" implementado con Clean Architecture.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con separación clara de responsabilidades:

```
backend/
├── src/
│   ├── controllers/     # Manejo de HTTP requests/responses
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos (Prisma)
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── utils/           # Utilidades y helpers
│   ├── config/          # Configuración de la aplicación
│   └── app.js           # Configuración de Express
├── prisma/
│   └── schema.prisma    # Esquema de base de datos
├── server.js            # Punto de entrada
└── .env                 # Variables de entorno
```

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos (Supabase)
- **Clean Architecture** - Patrón arquitectónico

## 📋 Características

### 🎯 Sistema de Juego
- **3 Retos matemáticos** con puntuación independiente
- **Sistema de tiempo** con penalizaciones
- **Puntuación por intentos** (100/50/25 puntos)
- **Bonus por velocidad** de respuesta
- **Tabla de notas** (0-10) basada en ejercicios completados

### 👥 Gestión de Usuarios
- **Registro de estudiantes** con validación
- **Búsqueda por nombre/apellido**
- **Sistema de admin** (ADMIN/ADMIN)
- **Estadísticas de rendimiento**

### 📊 Sistema de Puntuaciones
- **Puntuación total** por sesión
- **Desglose por retos**
- **Rankings por curso**
- **Estadísticas generales**

### 📝 Sistema de Notas
- **Notas de profesores**
- **Notas automáticas del sistema**
- **Búsqueda por contenido**
- **Filtrado por tipo**

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp config.example.js .env

# Editar .env con tus credenciales de Supabase
```

4. **Configurar base de datos**
```bash
# Generar cliente Prisma
npm run db:generate

# Inicializar tablas en Supabase (si es necesario)
node setup-database.js
```

5. **Ejecutar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### 👥 Usuarios (`/api/usuarios`)
- `GET /` - Obtener todos los usuarios
- `GET /:id` - Obtener usuario por ID
- `POST /` - Crear nuevo usuario
- `PUT /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario
- `GET /buscar/:nombre/:apellido` - Buscar usuarios
- `GET /verificar-admin` - Verificar si es admin

### 🎮 Sesiones (`/api/sesiones`)
- `POST /` - Crear nueva sesión
- `GET /:id` - Obtener sesión por ID
- `PUT /:id` - Completar sesión
- `GET /usuario/:usuarioId` - Sesiones de un usuario
- `GET /puntuaciones/tabla` - Tabla de puntuaciones
- `GET /puntuaciones/curso/:curso` - Puntuaciones por curso
- `GET /estadisticas/generales` - Estadísticas generales

### 🎯 Respuestas (`/api/respuestas`)
- `POST /reto1` - Guardar respuesta Reto 1
- `POST /reto2` - Guardar respuesta Reto 2
- `POST /reto3` - Guardar respuesta Reto 3
- `GET /sesion/:sesionId` - Respuestas de una sesión
- `GET /sesion/:sesionId/puntuacion` - Calcular puntuación total

### 📝 Notas (`/api/notas`)
- `GET /` - Obtener todas las notas
- `POST /` - Crear nueva nota
- `GET /:id` - Obtener nota por ID
- `PUT /:id` - Actualizar nota
- `DELETE /:id` - Eliminar nota
- `GET /usuario/:usuarioId` - Notas de un usuario
- `GET /buscar` - Buscar notas por contenido

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con nodemon

# Producción
npm start           # Servidor en producción

# Base de datos
npm run db:generate # Generar cliente Prisma
npm run db:push     # Sincronizar esquema
npm run db:migrate  # Crear migraciones
npm run db:studio   # Abrir Prisma Studio
```

## 🔒 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://..."

# Supabase
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Servidor
PORT=3001
NODE_ENV=development
```

## 📈 Sistema de Puntuación

### Reto 1 (4 preguntas independientes)
- **1er intento**: 100 puntos + bonus tiempo
- **2do intento**: 50 puntos + bonus tiempo
- **3er intento**: 25 puntos + bonus tiempo

### Reto 2 (1 pregunta con 4 opciones)
- Mismo sistema que Reto 1

### Reto 3 (10 ejercicios con 3 validaciones cada uno)
- **Cada validación** tiene puntuación independiente
- **Ejercicio completado** = las 3 validaciones correctas
- **Tabla de notas** = número de ejercicios completados (0-10)

## 🐳 Docker

El proyecto incluye configuración Docker para facilitar el despliegue:

```bash
# Construir y levantar el contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f quipus-backend

# Detener
docker-compose down
```

## 🎯 Próximas Características

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Logging avanzado
- [ ] Tests unitarios
- [ ] Documentación Swagger
- [x] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
"# Backend-Quipus" 
