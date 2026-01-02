#!/bin/bash

# Health check script for monitoring
API_URL="http://localhost:5002/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ API is healthy"
    exit 0
else
    echo "❌ API is down (HTTP $RESPONSE)"
    # Restart PM2 if unhealthy
    pm2 restart frozen-food-api
    exit 1
fi
