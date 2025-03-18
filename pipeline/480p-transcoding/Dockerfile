# Use a base image with Node.js and necessary tools
FROM node:18-alpine

# Install FFmpeg
RUN apk update && apk add --no-cache ffmpeg

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if using Node.js)
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Set the command to run when the container starts
CMD ["node", "your-app.js"] # Replace with your application's entry point
