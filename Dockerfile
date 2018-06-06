FROM node:8.11.2-alpine
WORKDIR /app
ADD . .
RUN npm install
RUN npm install -g serve
RUN npm run build
RUN mv /app/build /
RUN rm -rf /app/*
CMD cd / && serve -s build
