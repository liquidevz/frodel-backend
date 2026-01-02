#!/bin/bash

echo "🔧 Setting up VPS for Frozen Food Backend..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create logs directory
mkdir -p logs

# Install dependencies
npm ci --production

# Setup PM2 startup
pm2 startup systemd -u $USER --hp $HOME
pm2 start ecosystem.config.cjs --env production
pm2 save

echo "✅ VPS setup complete!"
echo "📝 Next steps:"
echo "1. Configure .env file with production values"
echo "2. Setup Nginx reverse proxy (see nginx.conf)"
echo "3. Install SSL certificate with certbot"
