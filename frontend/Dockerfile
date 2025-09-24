# Use Bun official image for better performance
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Install dependencies using Bun (much faster than npm)
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy all files
COPY . .

# Expose port
EXPOSE 5102

# Start development server with Bun
CMD ["bun", "run", "dev"]