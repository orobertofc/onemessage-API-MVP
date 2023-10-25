# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.3.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

# Copy source files into the image.
COPY ./dist ./dist
COPY package.json .
COPY package-lock.json .
COPY ./src/databases/prisma.schema.prisma ./dist/databases/prisma/schema.prisma

# Install dependencies
RUN npm install --omit=dev

# Generate prisma client
RUN npx prisma generate --schema=./dist/databases/prisma/schema.prisma

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
