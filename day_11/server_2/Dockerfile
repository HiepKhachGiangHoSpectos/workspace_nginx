FROM node:20-alpine
WORKDIR /app
COPY app.js .
RUN npm init -y && npm install express
CMD ["node", "app.js"]
