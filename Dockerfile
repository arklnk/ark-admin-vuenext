FROM node:lts-alpine as builder
WORKDIR /sf-vuenext-admin
# RUN npm set registry https://registry.npm.taobao.org

COPY package.json /sf-vuenext-admin/package.json
# support imagemin: https://github.com/imagemin/mozjpeg-bin/issues/47
RUN apk --no-cache add shadow \                                                                   
    gcc \                                                                                         
    musl-dev \                                                                                    
    autoconf \                                                                                    
    automake \                                                                                    
    make \                                                                                        
    libtool \                                                                                     
    nasm \                                                                                        
    tiff \                                                                                        
    jpeg \                                                                                        
    zlib \                                                                                        
    zlib-dev \                                                                                    
    file \                                                                                        
    pkgconf \                                                                                     
    && yarn bootstrap

# build
COPY ./ /sf-vuenext-admin
RUN yarn build

FROM nginx as production
RUN mkdir /web
COPY --from=builder /sf-vuenext-admin/dist/ /web
COPY --from=builder /sf-vuenext-admin/build/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80