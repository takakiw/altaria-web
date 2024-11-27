FROM node:alpine3.20 AS builder

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com && npm install && npm run build

FROM nginx:latest

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/

RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html