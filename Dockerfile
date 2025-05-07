# Dockerfile
FROM node:23-alpine

# Create directory for the app
WORKDIR /app

# Copy dependency files
COPY dist ./dist
COPY package*.json ./

# Install node dependencies
# RUN npm install
COPY node_modules ./node_modules

# Run MonitorLin
CMD ["node", "dist/main"]
