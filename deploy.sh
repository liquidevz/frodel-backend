#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Create logs directory
mkdir -p logs

# Restart PM2
pm2 restart ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
