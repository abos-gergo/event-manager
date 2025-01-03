FROM node:23-alpine3.20 AS node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM httpd
COPY --from=node /app/dist/event-manager/browser /usr/local/apache2/htdocs
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf
