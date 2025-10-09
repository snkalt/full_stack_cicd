# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the backend port (adjust if your app uses another port)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
