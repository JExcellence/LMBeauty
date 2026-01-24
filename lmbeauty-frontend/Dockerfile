# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for Next.js environment variables
# These can be overridden in Coolify build settings
ARG NEXT_PUBLIC_API_URL=https://api.lmbeauty.de/api
ARG NEXT_PUBLIC_BACKEND_URL=https://api.lmbeauty.de

# Set environment variables for the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

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

# Copy everything from builder
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
