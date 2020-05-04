FROM node:14 AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app ./
COPY ./dist/apps/api/main.js ./
RUN mkdir -p ./public
COPY ./dist/apps/converter/index.html ./public/
COPY ./dist/apps/converter/currency-exchange.js ./public/
COPY ./dist/apps/converter/currency-exchange-es5.js ./public/
COPY ./dist/apps/converter/favicon.ico ./public/

CMD ["node", "main.js"]


