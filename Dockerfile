# Dockerfile para Backend Quipus
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache \
    openssl \
    libc6-compat

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

EXPOSE 3001

# Comando para desarrollo (con hot-reload)
CMD ["npm", "run", "dev"]
