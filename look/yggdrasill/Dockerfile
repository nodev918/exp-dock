FROM ubuntu:18.04 AS builder
RUN apt-get update && apt-get install -y make unzip curl
WORKDIR /workspace
COPY Makefile ./
COPY src/proto ./src/proto
COPY rocks ./rocks
RUN make gen-protoc

FROM node:12.16.1-alpine
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 3001
WORKDIR /node
RUN mkdir app && chown -R node:node app
WORKDIR /node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install --production && npm cache clean --force
COPY --chown=node:node src ./src
COPY --chown=node:node rocks ./rocks
COPY --chown=node:node --from=builder /workspace/src/builds ./src/builds
CMD node src/app.js
