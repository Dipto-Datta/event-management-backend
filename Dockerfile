
# # Use official Node.js base image
# FROM node:18

# # Create app directory
# WORKDIR /app

# # Install app dependencies
# COPY package*.json ./
# RUN npm install

# # Copy app source code
# COPY . .

# # Expose backend port
# EXPOSE 5000

# # Start the application
# CMD ["node", "server.js"]

# for development purpose ---- // ---//

# Dockerfile.dev
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install nodemon globally for hot-reload
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

