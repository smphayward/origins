# Tutorial: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:16

# Create app directory
WORKDIR /usr/origins

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./dist .

EXPOSE 8080
CMD [ "node", "origins-server.js" ]