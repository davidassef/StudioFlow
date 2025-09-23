FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 5102

# Start development server
CMD ["npm", "run", "dev"]