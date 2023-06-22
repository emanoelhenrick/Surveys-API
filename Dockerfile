FROM node:18
WORKDIR /usr/src/auth-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 10000
CMD npm start