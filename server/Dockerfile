# use node js
FROM node:22

# this is the working directory inside the container
WORKDIR /use/src/app

# copies package json and package lock json
COPY package*.json ./

# install dependencies
RUN npm install

# copy application code and files
COPY . .

# expose port
EXPOSE 3000

# starts the backend server
CMD ["npm", "start"]
