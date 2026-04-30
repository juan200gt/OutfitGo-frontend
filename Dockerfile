# Compilar la aplicación Angular
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Servir con Nginx
FROM nginx:alpine
# Copiar el build compilado de Angular 19
COPY --from=build /app/dist/outfit-go-angular19/browser /usr/share/nginx/html
# Copiar configuración de Nginx (Reverse Proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]