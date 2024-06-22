FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/ 

RUN npm install

COPY . .

#npm run prisma:generate

RUN npm run build

CMD [ "npm", "run", "start:dev" ]