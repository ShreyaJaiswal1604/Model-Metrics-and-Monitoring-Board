# Stage 1: Build the React app
FROM node:16-alpine as build
WORKDIR /app
# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./
RUN npm install
# Copy the rest of your app source code
COPY . .
# Build the app for production. This creates the build folder.
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine
# Remove the default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy the React build output to the nginx html folder
COPY --from=build /app/build /usr/share/nginx/html
# (Optional) Copy a custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 so the container is accessible
EXPOSE 80
# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
