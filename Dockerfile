FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5050
EXPOSE 3000

CMD ["npm", "run", "start"]