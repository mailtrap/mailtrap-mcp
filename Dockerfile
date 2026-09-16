FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS production-dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime

LABEL org.opencontainers.image.title="Mailtrap MCP Server" \
      org.opencontainers.image.description="Official MCP server for Mailtrap" \
      org.opencontainers.image.source="https://github.com/mailtrap/mailtrap-mcp" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json LICENSE.txt ./

USER node

ENTRYPOINT ["node", "dist/index.js"]
