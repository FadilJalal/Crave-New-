FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Seed super admin on first run, then start server
CMD ["sh", "-c", "node seedSuperAdmin.js && node server.js"]

EXPOSE 4000
