# Official Dockerfile for the Bun-based backend application
FROM oven/bun:1
WORKDIR /usr/src/app

# Copy package files e instalar dependências de produção
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copiar todo o código do backend
COPY . .

# Expor porta do backend
EXPOSE 3000/tcp

# Rodar o app com Bun
USER bun
ENTRYPOINT ["bun", "run", "index.ts"]