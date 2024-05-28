# Use the official Node.js image.
# Use a smaller version of the node image.
FROM node:18-alpine

# Set the working directory.
WORKDIR /

# Copy package.json and package-lock.json to the working directory.
COPY package.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application files to the working directory.
COPY . .

# Build the TypeScript code.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 8000

# Define the command to run the application.
CMD ["node", "dist/server.js"]
