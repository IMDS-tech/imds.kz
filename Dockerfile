FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --ignore-scripts
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S imds && adduser -S imds -G imds
COPY --from=builder /app/public ./public
COPY --from=builder --chown=imds:imds /app/.next/standalone ./
COPY --from=builder --chown=imds:imds /app/.next/static ./.next/static
USER imds
EXPOSE 3000
CMD ["node","server.js"]
