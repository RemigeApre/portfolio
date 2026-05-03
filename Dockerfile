# Multi-stage Dockerfile pour le service web (Astro).
# Trois targets :
#   - dev      : monte le source en volume, npm install + astro dev (hot reload)
#   - builder  : prod build (npm ci + astro build)
#   - runner   : image finale legere qui sert le build statique

# ──────────── DEV ────────────
FROM node:22-alpine AS dev
WORKDIR /app
EXPOSE 3000
# La commande passe par le compose. Voir docker-compose.yml.

# ──────────── BUILDER ────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ──────────── RUNNER (prod) ────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Scripts d'init Directus (setup.mjs) : doivent rester dans l'image pour permettre
# `docker compose exec web node /app/directus/setup.mjs` après chaque deploy.
COPY --from=builder /app/directus ./directus
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
