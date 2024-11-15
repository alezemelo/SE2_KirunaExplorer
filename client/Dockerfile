# use node as base image
FROM node:22

# sets up working directory inside container
WORKDIR /usr/src/app

# copies package json and package lock json
COPY package*.json ./

# installs dependencies
RUN npm install

# copies code and data
COPY . .

# builds the frontend, needed only in production
# RUN npm run build

# exposes port
EXPOSE 5173

# serve the frontend
CMD ["npm", "run", "dev"]