# VPS Deployment Guide

## Prerequisites
- Ubuntu 20.04+ VPS
- Root or sudo access
- Domain name pointed to VPS IP

## Quick Start

### 1. Initial VPS Setup
```bash
# Make setup script executable
chmod +x setup-vps.sh

# Run setup (installs Node.js, MongoDB, PM2, Nginx)
./setup-vps.sh
```

### 2. Configure Environment
```bash
# Copy production environment template
cp .env.production .env

# Edit with your values
nano .env
```

**Important:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configure Nginx
```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/frozen-food-api

# Update domain name in the file
sudo nano /etc/nginx/sites-available/frozen-food-api

# Enable site
sudo ln -s /etc/nginx/sites-available/frozen-food-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4. Install SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5. Start Application
```bash
# Install dependencies
npm ci --production

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## PM2 Commands

```bash
# View logs
pm2 logs frozen-food-api

# Monitor
pm2 monit

# Restart
pm2 restart frozen-food-api

# Stop
pm2 stop frozen-food-api

# View status
pm2 status

# Clear logs
pm2 flush
```

## Deployment Updates

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## MongoDB Security

```bash
# Enable MongoDB authentication
sudo mongo

use admin
db.createUser({
  user: "admin",
  pwd: "STRONG_PASSWORD",
  roles: ["root"]
})

use frozen-food-directory
db.createUser({
  user: "appuser",
  pwd: "STRONG_PASSWORD",
  roles: ["readWrite"]
})
exit

# Update .env with authenticated connection string
MONGODB_URI=mongodb://appuser:STRONG_PASSWORD@localhost:27017/frozen-food-directory
```

## Performance Optimization

### MongoDB Indexes
```bash
node -e "
import('./src/config/database.js').then(async ({default: connectDB}) => {
  await connectDB();
  const mongoose = await import('mongoose');
  
  // Add indexes
  await mongoose.connection.collection('products').createIndex({ name: 1 });
  await mongoose.connection.collection('products').createIndex({ category: 1 });
  await mongoose.connection.collection('products').createIndex({ isActive: 1 });
  await mongoose.connection.collection('enquiries').createIndex({ status: 1 });
  await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
  
  console.log('Indexes created');
  process.exit(0);
});
"
```

### PM2 Cluster Mode
The ecosystem.config.cjs is configured to use all CPU cores automatically.

## Monitoring

```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db frozen-food-directory --out /backups/mongo_$DATE
tar -czf /backups/uploads_$DATE.tar.gz uploads/
find /backups -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
```

## Troubleshooting

### Check logs
```bash
pm2 logs frozen-food-api --lines 100
```

### Check MongoDB status
```bash
sudo systemctl status mongod
```

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check port availability
```bash
sudo netstat -tulpn | grep 5002
```

## Security Checklist

- [ ] Strong JWT_SECRET generated
- [ ] MongoDB authentication enabled
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] .env file secured (chmod 600)
- [ ] Regular backups scheduled
- [ ] PM2 logs rotation enabled
- [ ] Nginx rate limiting configured

## Performance Metrics

Expected performance with PM2 cluster mode:
- **Response time:** < 100ms for most endpoints
- **Throughput:** 1000+ req/sec
- **Memory:** ~200MB per instance
- **CPU:** Distributed across all cores

## Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/error.log`
3. MongoDB logs: `/var/log/mongodb/mongod.log`
