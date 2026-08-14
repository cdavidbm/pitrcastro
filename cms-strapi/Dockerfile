# Imagen de Strapi v5 para correr en producción / servidor de pruebas.
#
# Diseño:
#   - Una sola etapa de construcción
#   - Build del admin con NODE_ENV=production (`pnpm build`)
#   - Runtime con `pnpm start` (no watcher, no recompilación en runtime)
#   - Usuario no-root (`node`) para runtime
#   - pnpm vía corepack (incluido en la imagen node:20-alpine)
#
# Uso desde la raíz del repo (ver docker-compose.yml):
#   docker compose --profile server up -d --build

FROM node:22-alpine

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

# Activar corepack y preparar pnpm de la versión pineada en package.json.
# corepack viene con node:22. `enable` instala los shims; `prepare` baja la
# versión exacta indicada en `packageManager`.
RUN corepack enable

WORKDIR /opt/app

# Instalar dependencias primero para aprovechar capa de cache si solo
# cambia el código fuente. .npmrc también para que la config de pnpm aplique.
COPY package.json pnpm-lock.yaml .npmrc ./

# sharp trae su propia libvips compilada. Si detecta la del sistema
# (vips-dev, instalada arriba) intenta compilarse contra ella y falla dentro
# de Alpine. Con esto usa su binario, que es lo que queremos.
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

RUN corepack prepare pnpm@10.34.1 --activate && \
    pnpm install --frozen-lockfile

COPY . .

# Build del admin con NODE_ENV=production
ENV NODE_ENV=production
RUN pnpm build

# Permisos: el usuario node debe poder leer/escribir uploads y .tmp.
RUN chown -R node:node /opt/app

USER node

EXPOSE 1337

CMD ["pnpm", "start"]
