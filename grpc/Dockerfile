FROM node:16.13.2-alpine
# need these for native libraries like bcrypt
#RUN apk update && apk add coreutils py-pip g++ make && rm -rf /var/cache/apk/*
WORKDIR /app
COPY . ./
RUN yarn install
