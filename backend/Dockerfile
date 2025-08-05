FROM node:23-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create uploads directory with proper permissions
RUN mkdir -p uploads/contact_images uploads/profile_pictures uploads/default && \
    chown -R node:node uploads

# Copy environment file for Docker
COPY .env.docker .env

# Use non-root user
USER node

# Expose port 8000
EXPOSE 8000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]