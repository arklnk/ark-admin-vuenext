FROM node:lts-alpine as builder
WORKDIR /build

# 安装pnpm
RUN npm install -g pnpm

# 安装开发期依赖
COPY package.json pnpm-lock.yaml ./
RUN pnpm bootstrap

# 构建项目
COPY ./ /build
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /build/dist/ /web
EXPOSE 80