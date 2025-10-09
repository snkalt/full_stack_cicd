# Step 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source files
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Use nginx to serve the built files
FROM nginx:alpine

# Copy the production build to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
