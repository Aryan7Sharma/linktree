# =============================================
# OrangeLink Backend Dockerfile
# Multi-stage build for minimal production image
# =============================================

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations

RUN addgroup -g 1001 -S nodejs && adduser -S orangelink -u 1001
USER orangelink

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "dist/server.js"]
