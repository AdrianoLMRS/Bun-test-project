# Build website with node
FROM node:bookworm-slim AS build
WORKDIR /app

# Create a .env file (I tried to use compose for this but it didn't work)
RUN echo "VITE_PORT=3000" > .env

COPY . .
# Install dependencies
RUN npm ci
# Build the website
RUN npm run build

# Serve static website with nginx
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]