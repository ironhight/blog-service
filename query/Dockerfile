FROM node:12.18.1

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]