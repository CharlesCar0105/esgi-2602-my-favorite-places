FROM node:25.6.1-alpine3.23 as dev
WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn


FROM node:25.6.1-alpine3.23 as build
WORKDIR /app

COPY ./package.json ./package.json
COPY --from=dev /app/node_modules ./node_modules
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
RUN yarn build

FROM node:25.6.1-alpine3.23 as deps
WORKDIR /app
COPY ./package.json ./package.json
RUN yarn --production

FROM node:25.6.1-alpine3.23 as main
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ./package.json ./package.json
CMD yarn start