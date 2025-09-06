# 🚀 EcoFinds Deployment Guide

This guide will help you deploy your fully functional EcoFinds marketplace to various platforms.

## 📋 Pre-Deployment Checklist

- ✅ Node.js 16+ installed
- ✅ MySQL database configured
- ✅ Environment variables set
- ✅ All dependencies installed
- ✅ Application tested locally

## 🔧 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/ANASF1412/Oddo-EcoFinds.git
cd Oddo-EcoFinds

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup MySQL database
mysql -u root -p
CREATE DATABASE oddo;
CREATE USER 'dev_user'@'localhost';
GRANT ALL PRIVILEGES ON oddo.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;

# 5. Start the application
npm start
# Visit: http://localhost:3000
```

## 🌐 Production Deployment Options

### Option 1: Heroku Deployment

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create new Heroku app
heroku create your-ecofinds-app

# 4. Add MySQL database
heroku addons:create cleardb:ignite

# 5. Configure environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-this

# 6. Get database URL
heroku config:get CLEARDB_DATABASE_URL
# Copy the connection details and set them individually:
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASS=your-db-pass
heroku config:set DB_NAME=your-db-name

# 7. Deploy to Heroku
git add .
git commit -m "Deploy EcoFinds to Heroku"
git push heroku main

# 8. Open your app
heroku open
```

### Option 2: Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Add environment variables in Vercel Dashboard
# Go to your project settings and add:
# - NODE_ENV=production
# - JWT_SECRET=your-secret-key
# - Database connection details

# 5. Add MySQL database (external)
# Use PlanetScale, Railway, or any MySQL provider
# Update connection details in Vercel dashboard
```

### Option 3: Digital Ocean Droplet

```bash
# 1. Create Ubuntu droplet on Digital Ocean
# 2. SSH into your server
ssh root@your-server-ip

# 3. Update system
apt update && apt upgrade -y

# 4. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 5. Install MySQL
apt install mysql-server -y
mysql_secure_installation

# 6. Clone your repository
git clone https://github.com/ANASF1412/Oddo-EcoFinds.git
cd Oddo-EcoFinds

# 7. Install dependencies
npm install --production

# 8. Setup environment
cp .env.example .env
nano .env  # Edit with your settings

# 9. Setup database
mysql -u root -p
CREATE DATABASE oddo;
CREATE USER 'ecofinds'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON oddo.* TO 'ecofinds'@'localhost';
FLUSH PRIVILEGES;

# 10. Install PM2 for process management
npm install -g pm2

# 11. Start application
pm2 start server.js --name ecofinds
pm2 startup
pm2 save

# 12. Setup Nginx reverse proxy (optional)
apt install nginx -y
nano /etc/nginx/sites-available/ecofinds
# Add your Nginx configuration

# 13. Setup SSL with Let's Encrypt
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

### Option 4: Docker Deployment

```bash
# 1. Build Docker image
docker build -t ecofinds .

# 2. Run with Docker Compose
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

## 🔒 Security Configuration

### Environment Variables

```env
# Production environment variables
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret-change-this
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASS=your-secure-database-password
DB_NAME=your-database-name

# Optional: Database connection pooling
DB_CONNECTION_LIMIT=10
DB_TIMEOUT=60000
```

### Security Best Practices

1. **Change default passwords**
2. **Use strong JWT secret**
3. **Enable HTTPS/SSL**
4. **Configure CORS properly**
5. **Use environment variables for secrets**
6. **Regular security updates**
7. **Database backups**
8. **Monitor application logs**

## 📊 Post-Deployment

### Verify Deployment

```bash
# 1. Health check
curl https://your-domain.com/api/health

# 2. API endpoints
curl https://your-domain.com/api

# 3. Frontend
curl https://your-domain.com

# 4. Database connection
# Check application logs for successful database connection
```

### Demo Account

Your deployed application includes a demo account:
- **Email**: john@email.com
- **Password**: password123

### Sample Data

The application comes with:
- ✅ 7 sample users
- ✅ 15+ products across all categories
- ✅ Complete marketplace experience

## 🔧 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check database credentials in .env
   - Verify database server is running
   - Check firewall settings

2. **Port already in use**
   - Change PORT in .env file
   - Kill process using the port

3. **Missing environment variables**
   - Verify all required variables in .env
   - Check spelling and syntax

4. **CORS errors**
   - Update allowed origins in server.js
   - Check frontend domain configuration

### Monitoring

```bash
# Check application logs
# Heroku: heroku logs --tail
# PM2: pm2 logs ecofinds
# Docker: docker-compose logs -f

# Monitor performance
# PM2: pm2 monit
```

## 🎉 Success!

Your EcoFinds marketplace is now deployed and ready for users!

**What users can do:**
- ✅ Browse 15+ sustainable products
- ✅ Register new accounts
- ✅ Login with demo credentials
- ✅ Search and filter products
- ✅ Experience professional UI/UX
- ✅ Mobile-responsive design

**Next Steps:**
1. Add more products
2. Configure email notifications
3. Set up analytics
4. Add payment processing
5. Implement advanced features

---

**Need help?** Create an issue on GitHub: https://github.com/ANASF1412/Oddo-EcoFinds/issues
