const { PrismaClient } = require('@prisma/client')

async function initDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Inicializando base de datos...')
    
    // Crear tabla de usuarios
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        edad INTEGER NOT NULL,
        curso VARCHAR(100) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT NOW(),
        activo BOOLEAN DEFAULT true,
        UNIQUE(nombre, apellido, curso)
      );
    `
    console.log('✅ Tabla usuarios creada')
    
    // Crear enum para razón de fin de juego
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "RazonFinJuego" AS ENUM ('COMPLETADO', 'TIEMPO_AGOTADO', 'SALIDA_MANUAL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    console.log('✅ Enum RazonFinJuego creado')
    
    // Crear tabla de sesiones de juego
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SesionJuego" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        fecha_inicio TIMESTAMP DEFAULT NOW(),
        fecha_fin TIMESTAMP,
        tiempo_total INTEGER,
        completado BOOLEAN DEFAULT false,
        tiempo_agotado BOOLEAN DEFAULT false,
        razon_fin_juego "RazonFinJuego" DEFAULT 'COMPLETADO',
        puntuacion_total INTEGER DEFAULT 0,
        puntuacion_reto1 INTEGER DEFAULT 0,
        puntuacion_reto2 INTEGER DEFAULT 0,
        puntuacion_reto3 INTEGER DEFAULT 0,
        puntuacion_notas INTEGER DEFAULT 0
      );
    `
    console.log('✅ Tabla SesionJuego creada')
    
    // Crear tabla de respuestas Reto 1
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "RespuestaReto1" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        sesion_id TEXT NOT NULL REFERENCES "SesionJuego"(id) ON DELETE CASCADE,
        pregunta_numero INTEGER NOT NULL,
        pregunta TEXT NOT NULL,
        opciones TEXT[] NOT NULL,
        respuesta_correcta TEXT NOT NULL,
        respuesta_usuario TEXT NOT NULL,
        es_correcto BOOLEAN NOT NULL,
        intento_numero INTEGER NOT NULL DEFAULT 1,
        tiempo_respuesta INTEGER NOT NULL,
        puntuacion_base INTEGER NOT NULL DEFAULT 0,
        puntuacion_total INTEGER NOT NULL DEFAULT 0,
        UNIQUE(sesion_id, pregunta_numero)
      );
    `
    console.log('✅ Tabla RespuestaReto1 creada')
    
    // Crear tabla de respuestas Reto 2
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "RespuestaReto2" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        sesion_id TEXT NOT NULL REFERENCES "SesionJuego"(id) ON DELETE CASCADE,
        pregunta TEXT NOT NULL,
        opciones TEXT[] NOT NULL,
        respuesta_correcta TEXT NOT NULL,
        respuesta_usuario TEXT NOT NULL,
        es_correcto BOOLEAN NOT NULL,
        intento_numero INTEGER NOT NULL DEFAULT 1,
        tiempo_respuesta INTEGER NOT NULL,
        puntuacion_base INTEGER NOT NULL DEFAULT 0,
        puntuacion_total INTEGER NOT NULL DEFAULT 0
      );
    `
    console.log('✅ Tabla RespuestaReto2 creada')
    
    // Crear enum para tipo de nota
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "TipoNota" AS ENUM ('PROFESOR', 'SISTEMA', 'USUARIO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    console.log('✅ Enum TipoNota creado')
    
    // Crear tabla de respuestas Reto 3
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "RespuestaReto3" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        sesion_id TEXT NOT NULL REFERENCES "SesionJuego"(id) ON DELETE CASCADE,
        ejercicio_numero INTEGER NOT NULL,
        ecuacion_original TEXT NOT NULL,
        validacion1_correcta BOOLEAN NOT NULL,
        validacion1_intento INTEGER NOT NULL DEFAULT 1,
        validacion1_tiempo INTEGER NOT NULL DEFAULT 0,
        validacion1_puntuacion INTEGER NOT NULL DEFAULT 0,
        respuesta_usuario1 TEXT NOT NULL DEFAULT '',
        validacion2_correcta BOOLEAN NOT NULL,
        validacion2_intento INTEGER NOT NULL DEFAULT 1,
        validacion2_tiempo INTEGER NOT NULL DEFAULT 0,
        validacion2_puntuacion INTEGER NOT NULL DEFAULT 0,
        respuesta_usuario2 TEXT NOT NULL DEFAULT '',
        validacion3_correcta BOOLEAN NOT NULL,
        validacion3_intento INTEGER NOT NULL DEFAULT 1,
        validacion3_tiempo INTEGER NOT NULL DEFAULT 0,
        validacion3_puntuacion INTEGER NOT NULL DEFAULT 0,
        respuesta_usuario3 TEXT NOT NULL DEFAULT '',
        puntuacion_total INTEGER NOT NULL DEFAULT 0,
        bonus_tiempo INTEGER NOT NULL DEFAULT 0,
        completado BOOLEAN NOT NULL DEFAULT false,
        UNIQUE(sesion_id, ejercicio_numero)
      );
    `
    console.log('✅ Tabla RespuestaReto3 creada')
    
    // Agregar columna bonus_tiempo si no existe
    await prisma.$executeRaw`
      ALTER TABLE "RespuestaReto3" ADD COLUMN IF NOT EXISTS bonus_tiempo INTEGER NOT NULL DEFAULT 0;
    `;
    console.log('✅ Columna bonus_tiempo agregada a RespuestaReto3')
    
    // Crear tabla de notas
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "NotaJuego" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        sesion_id TEXT REFERENCES "SesionJuego"(id) ON DELETE CASCADE,
        contenido TEXT NOT NULL,
        calificacion DOUBLE PRECISION,
        tipo_nota "TipoNota" NOT NULL DEFAULT 'SISTEMA',
        fecha_creacion TIMESTAMP DEFAULT NOW()
      );
    `
    console.log('✅ Tabla NotaJuego creada')
    
    // Agregar columna calificacion si no existe (para tablas existentes)
    await prisma.$executeRaw`
      ALTER TABLE "NotaJuego" 
      ADD COLUMN IF NOT EXISTS calificacion DOUBLE PRECISION;
    `
    console.log('✅ Columna calificacion agregada/verificada')
    
    console.log('🎉 ¡Base de datos inicializada correctamente!')
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()
