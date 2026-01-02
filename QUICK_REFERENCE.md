# Quick Reference - VPS Commands

## Initial Setup
```bash
chmod +x setup-vps.sh deploy.sh healthcheck.sh
./setup-vps.sh
cp .env.production .env
nano .env  # Configure your environment
```

## Deployment
```bash
./deploy.sh
```

## PM2 Management
```bash
npm run pm2:start      # Start application
npm run pm2:restart    # Restart application
npm run pm2:stop       # Stop application
npm run pm2:logs       # View logs
npm run pm2:monit      # Monitor resources
pm2 status             # Check status
```

## Database
```bash
# Create indexes for performance
node src/scripts/createIndexes.mjs

# Seed admin user
npm run seed:admin
```

## Nginx
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
sudo nginx -t  # Test configuration
```

## SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run  # Test renewal
```

## Monitoring
```bash
# View logs
pm2 logs frozen-food-api --lines 100

# Monitor resources
pm2 monit

# Check health
curl http://localhost:5002/api/health
```

## Troubleshooting
```bash
# Check if port is in use
sudo netstat -tulpn | grep 5002

# Check MongoDB
sudo systemctl status mongod
mongo --eval "db.adminCommand('ping')"

# Check disk space
df -h

# Check memory
free -h

# Restart everything
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongod
```

## Performance
Expected metrics with PM2 cluster mode:
- Response time: < 100ms
- Throughput: 1000+ req/sec
- Memory per instance: ~200MB
- Auto-scaling across all CPU cores
