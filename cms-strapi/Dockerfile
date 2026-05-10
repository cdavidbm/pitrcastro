# Imagen de Strapi v5 para correr en producción / servidor de pruebas.
#
# Diseño:
#   - Single-stage (suficiente para POC; multi-stage luego cuando importe el tamaño)
#   - Build del admin SI con NODE_ENV=production (`npm run build`)
#   - Runtime con `npm run start` (no watcher, no recompilación en runtime)
#   - Usuario no-root (`node`) para runtime
#
# Uso desde la raíz del repo (ver docker-compose.yml):
#   docker compose --profile server up -d --build

FROM node:20-alpine

# Build deps para sharp/vips (procesamiento de imágenes que Strapi usa
# para previsualizaciones del media library, aunque no usemos uploads
# heavy-duty, las dependencias nativas siguen requiriéndose en build).
RUN apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git

WORKDIR /opt/app

# Instalar dependencias primero para aprovechar capa de cache si solo
# cambia el código fuente.
COPY package.json package-lock.json ./
RUN npm ci --quiet

COPY . .

# Build del admin con NODE_ENV=production
ENV NODE_ENV=production
RUN npm run build

# Permisos: el usuario node debe poder leer/escribir uploads y .tmp.
RUN chown -R node:node /opt/app

USER node

EXPOSE 1337

CMD ["npm", "run", "start"]
