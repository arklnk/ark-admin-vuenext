FROM node:lts-alpine as builder
WORKDIR /ark-admin-vuenext
# RUN npm set registry https://registry.npm.taobao.org

# setup pnpm
RUN npm install -g pnpm

COPY package.json /ark-admin-vuenext/package.json
# support imagemin: https://github.com/imagemin/mozjpeg-bin/issues/47
RUN pnpm bootstrap

# build
COPY ./ /ark-admin-vuenext
RUN pnpm build

FROM nginx as production
RUN mkdir /web
COPY --from=builder /ark-admin-vuenext/dist/ /web
COPY --from=builder /ark-admin-vuenext/build/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80