FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci --legacy-peer-deps
COPY . /app

RUN npm run build:prod

FROM nginx:alpine
COPY dynamic-env.json /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d/default.conf
COPY scripts/40-write-runtime-env.sh /docker-entrypoint.d/40-write-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/40-write-runtime-env.sh

COPY --from=build /app/dist/OwneyBeauty/browser /usr/share/nginx/html

EXPOSE 80
