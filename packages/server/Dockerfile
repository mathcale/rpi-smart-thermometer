FROM node:16.15.0-alpine3.15 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN yarn build

# ---

FROM node:16.15.0-alpine3.15

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json ./
COPY --from=builder --chown=node:node /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
RUN ls -lah

CMD ["node", "dist/server.js"]