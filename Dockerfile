FROM node:18-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy the rest of the application code
COPY . .

# Set environment variables for development
ENV NODE_ENV=development
ENV HOSTNAME="0.0.0.0"

# Expose the default Next.js dev port
EXPOSE 3000

# Start the Next.js application in development mode
CMD \
if [ -f yarn.lock ]; then yarn run dev; \
elif [ -f package-lock.json ]; then npm run dev; \
elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run dev; \
else echo "Lockfile not found." && exit 1; \
fi