# Base
FROM node:10.16.0 AS base

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm ci

# Dev
FROM base AS dev

COPY --from=base /app/node_modules ./node_modules

COPY . .

CMD npm run dev

# Build
FROM base AS build

COPY --from=base /app/node_modules ./node_modules

ARG VUE_MODE

ENV VUE_MODE=$VUE_MODE

COPY . .

RUN npm run build -- --mode ${VUE_MODE}

# Release
FROM node:10-alpine AS release

WORKDIR /app

COPY . .

COPY --from=build /app/dist ./dist

RUN npm ci --only=production

EXPOSE 80

CMD npm run start
