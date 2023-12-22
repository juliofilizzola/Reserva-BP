# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn

# Bundle app source
COPY . .

# Expose the port your app will run on
EXPOSE 3000
# Command to run your application
CMD ["yarn", "run", "start:dev"]