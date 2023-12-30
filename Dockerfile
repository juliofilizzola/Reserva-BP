FROM node:16 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY .env.example .env

# Install app dependencies
RUN yarn

COPY . .

CMD ["yarn", "run", "start:dev"]


#FROM node:16
#
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/dist ./dist
#
#EXPOSE 3000
#CMD [ "npm", "run", "start:prod" ]

#FROM node:16
#
## Set the working directory inside the container
#RUN mkdir -p /usr/src/app
#COPY . /usr/src/app
#WORKDIR /usr/src/app
#
## Install app dependencies
#COPY package.json /usr/src/app/
#RUN yarn
#RUN cat .env.example > .env
## Bundle app source
#COPY . .
#
## Expose the port your app will run on
#EXPOSE 3000
## Command to run your application
#CMD ["yarn", "run", "start:dev"]
