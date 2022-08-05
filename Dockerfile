FROM node:lts-alpine as builder
WORKDIR /sf-vuenext-admin
# RUN npm set registry https://registry.npm.taobao.org

# setup pnpm
RUN npm install -g pnpm

COPY package.json /sf-vuenext-admin/package.json
# support imagemin: https://github.com/imagemin/mozjpeg-bin/issues/47
RUN pnpm bootstrap

# build
COPY ./ /sf-vuenext-admin
RUN pnpm build

FROM nginx as production
RUN mkdir /web
COPY --from=builder /sf-vuenext-admin/dist/ /web
COPY --from=builder /sf-vuenext-admin/build/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80