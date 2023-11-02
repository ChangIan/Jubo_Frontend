
FROM node:18-alpine as build-env

WORKDIR /jubo

COPY ./ /jubo

RUN \
  set -ex \
  && ls -al \
  && cp -f .env.production .env

RUN npm install \
  && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html/dist

COPY --from=build-env /jubo/build ./

COPY --from=build-env /jubo/nginx-jubo.conf /etc/nginx/conf.d/nginx-jubo.conf

RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
