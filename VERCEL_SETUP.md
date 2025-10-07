# Configuración para Vercel

## Variables de Entorno Requeridas

Para que el backend funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en el dashboard de Vercel:

### 1. DATABASE_URL
```
DATABASE_URL=postgresql://usuario:password@host:puerto/nombre_db
```

### 2. DIRECT_URL (Opcional para Vercel Postgres)
```
DIRECT_URL=postgresql://usuario:password@host:puerto/nombre_db
```

### 3. NODE_ENV
```
NODE_ENV=production
```

### 4. VERCEL (Automático)
```
VERCEL=1
```

## Configuración en Vercel

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Agrega las variables mencionadas arriba

## Base de Datos Recomendada

Para producción, se recomienda usar:
- **PostgreSQL** (compatible con Prisma)
- **Vercel Postgres** (opción nativa de Vercel)
- **PlanetScale** (MySQL compatible)
- **Supabase** (PostgreSQL)

## Pasos de Despliegue

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará automáticamente la configuración del `vercel.json`
4. El despliegue se realizará automáticamente

## Estructura de Archivos para Vercel

```
├── api/
│   └── index.js          # Handler principal para Vercel
├── src/                  # Código fuente de la aplicación
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
├── vercel.json           # Configuración de Vercel
└── package.json          # Dependencias y scripts
```

## Notas Importantes

- El archivo `api/index.js` actúa como punto de entrada para las funciones serverless
- La configuración de CORS incluye dominios de Vercel
- Prisma se genera automáticamente durante el build
- El timeout máximo está configurado a 30 segundos

## Debugging

### Endpoints de Prueba

1. **Endpoint básico**: `https://tu-dominio.vercel.app/test`
   - Prueba simple sin base de datos
   - Debería funcionar siempre

2. **Health check**: `https://tu-dominio.vercel.app/health`
   - Prueba la conexión a la base de datos
   - Verifica que Prisma funcione

### Verificar Logs

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Haz clic en la función que falla
5. Revisa los logs para ver el error específico

### Problemas Comunes

- **Error 500**: Generalmente por falta de `DATABASE_URL`
- **Timeout**: Problemas de conexión a la base de datos
- **Prisma errors**: Esquema no generado o variables de entorno incorrectas
