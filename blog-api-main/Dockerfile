# Use an official Node runtime as the parent image
FROM node:18-alpine

# Install netcat
RUN apk add --no-cache netcat-openbsd

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the current directory contents into the container at /app
COPY . .

# Build the TypeScript code
RUN yarn build

RUN yarn add sharp --ignore-engines 

# Make seeder.sh executable
COPY seeder.sh ./

RUN chmod +x seeder.sh

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["node", "dist/index.js"]