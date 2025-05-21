FROM node:20.18.1-alpine AS base

# Etapa de instalar las dependencias
FROM base AS deps
# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Etapa de build de la app nextJS
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa de correr la app NextJS
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Esto se pone solo si tienes imagenes en la carpeta public
# COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cambiamos el puerto del 3000 al 8080, ya que Cloud Run utiliza ese puerto por defecto
EXPOSE 8080

ENV PORT=8080

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
