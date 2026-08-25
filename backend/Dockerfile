FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
