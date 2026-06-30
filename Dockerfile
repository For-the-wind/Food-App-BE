FROM node:alpine

WORKDIR /rode-be-api

COPY . .

WORKDIR /rode-be-api/services/rest-management

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]