FROM node:lts-alpine as builder
WORKDIR /sf-vuenext-admin
# RUN npm set registry https://registry.npm.taobao.org
# cache step
COPY package.json /sf-vuenext-admin/package.json
RUN yarn
# build
COPY ./ /sf-vuenext-admin
RUN yarn build

FROM nginx as production
RUN mkdir /web
COPY --from=builder /sf-vuenext-admin/dist/ /web
COPY --from=builder /sf-vuenext-admin/build/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80