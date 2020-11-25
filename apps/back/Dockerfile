FROM node:10-alpine as base

WORKDIR /back

COPY package.json .

COPY package-lock.json .

RUN npm ci

EXPOSE 3000

# Dev
FROM base as dev

COPY . .

COPY --from=base /back/node_modules ./node_modules

CMD ["npm", "run", "dev"]

# Release
FROM node:10-alpine as release

COPY . .

COPY --from=base /back/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
