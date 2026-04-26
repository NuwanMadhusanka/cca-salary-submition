# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn build

# ---- Production stage ----
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-engines --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
