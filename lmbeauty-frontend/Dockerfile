# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ---- Runner ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy everything from builder
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
