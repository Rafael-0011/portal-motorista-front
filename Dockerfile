# Dockerfile - Portal Motorista Frontend (Desenvolvimento)

FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema (se necessário)
RUN apk add --no-cache libc6-compat

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta 3000
EXPOSE 3000

# Comando para desenvolvimento (hot reload)
CMD ["npm", "run", "dev"]
