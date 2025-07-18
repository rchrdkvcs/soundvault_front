FROM node:latest AS base

# Install bun
WORKDIR /app
RUN npm install -g bun@latest

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json ./
RUN bun install

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json ./
RUN bun install --production

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN bun run build

# Production stage
FROM base
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
