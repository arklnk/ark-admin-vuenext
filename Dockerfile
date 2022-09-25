FROM node:lts-alpine as builder
WORKDIR /build
# RUN npm set registry https://registry.npm.taobao.org

# setup pnpm
RUN npm install -g pnpm

COPY package.json /build/package.json
RUN pnpm bootstrap

# build
COPY ./ /build
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /build/dist/ /web
EXPOSE 80