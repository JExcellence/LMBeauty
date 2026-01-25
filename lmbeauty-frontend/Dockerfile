# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for Next.js environment variables
# These can be overridden in Coolify build settings
# Empty NEXT_PUBLIC_API_URL makes API calls relative (uses Next.js API routes)
ARG NEXT_PUBLIC_API_URL=
ARG NEXT_PUBLIC_BACKEND_URL=https://api.lmbeauty.de
ARG BACKEND_URL=https://api.lmbeauty.de

# Set environment variables for the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application with environment variables
RUN npm run build

# ---- Runner ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built application and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/next-sitemap.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
