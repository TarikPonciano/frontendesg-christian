# Etapa 1: Construir a aplicação
FROM node:16-alpine as build-step
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etapa 2: Servir a aplicação
FROM nginx:1.21-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
