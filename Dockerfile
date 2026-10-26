# Stage 1: Build-Umgebung
FROM node:20-alpine AS build

WORKDIR /app

# Paketdateien kopieren
COPY package*.json ./

# Abhängigkeiten frisch für Linux-Alpine installieren (behebt das Rolldown/Musl-Problem)
RUN npm install

# Restlichen Quellcode kopieren
COPY . .

# Produktion-Build ausführen
RUN npm run build

# Stage 2: Nginx Webserver für das Hosting
FROM nginx:alpine

# Gebaute Dateien aus Stage 1 in den Nginx-Ordner kopieren
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]