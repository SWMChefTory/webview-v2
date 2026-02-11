# Multi-stage build for production-ready ARM64 Next.js image

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder

# Build arguments for environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_STT_URL
ARG NEXT_PUBLIC_AMPLITUDE_API_KEY

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_STT_URL=$NEXT_PUBLIC_STT_URL
ENV NEXT_PUBLIC_AMPLITUDE_API_KEY=$NEXT_PUBLIC_AMPLITUDE_API_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_APPLE_CLIENT_ID=$NEXT_PUBLIC_APPLE_CLIENT_ID

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the app (output: 'standalone' creates optimized production build)
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000 (Next.js default)
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Next.js server
CMD ["node", "server.js"]
