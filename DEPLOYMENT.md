# Deployment Guide - Drive Management System

This guide covers deploying the Drive Management System to various cloud platforms.

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or self-hosted MongoDB)
- Cloudinary account for file uploads
- Email service account (Gmail, Mailtrap, SendGrid, etc.)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## 🚀 Local Development Setup

### Quick Start

1. **Copy environment template:**
```bash
cp backend/.env.example backend/.env
cp Frontend/.env.example Frontend/.env.local
```

2. **Configure environment variables:**
Edit `backend/.env` with your values:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

3. **Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

4. **Frontend Setup (new terminal):**
```bash
cd Frontend
npm install
npm run dev
```

**Services will be available at:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## ☁️ Cloud Deployment Options

### Option 1: AWS EC2 + RDS

**Backend Deployment:**

1. **Launch EC2 Instance:**
   - Use Ubuntu 22.04 LTS AMI
   - Open ports: 80, 443, 5000, 5173
   - Create/use existing security group

2. **Connect and Setup:**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install MongoDB client (optional, for testing)
sudo apt install -y mongodb-org-shell
```

3. **Clone and Deploy:**
```bash
git clone https://github.com/yourusername/drive-management.git
cd drive-management

# Backend Setup
cd backend
cp .env.example .env
nano .env  # Edit with production values
npm install

# Start with PM2
pm2 start server.js --name "drive-api"
pm2 save

# Frontend Setup (from root directory)
cd ../Frontend
cp .env.example .env.local
nano .env.local  # Edit API URL
npm install
npm run build  # Create production build

# Copy build to public directory
cd ../
```

4. **Setup Nginx Reverse Proxy:**
```bash
sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/drive-management
```

**Nginx Config:**
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

6. **Enable and start Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/drive-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 2: Railway.app (Recommended for beginners)

**Backend:**

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables from `.env.example`
6. Configure MongoDB:
   - Add MongoDB plugin in Railway
   - Update `MONGODB_URI` to Railway's MongoDB URL
7. Deploy

**Frontend:**

1. In Railway, create new service
2. Select "GitHub repo" → your project
3. Set build command: `npm run build`
4. Set start command: `npm run preview`
5. Add environment: `VITE_API_BASE_URL=your-railway-backend-url/api`

---

### Option 3: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables:
   - `VITE_API_BASE_URL`: Your Render backend URL
7. Deploy

**Backend on Render:**

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Environment: Node
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables
8. Deploy

---

### Option 4: DigitalOcean App Platform

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
3. Click "Create Apps"
4. Select GitHub repository
5. Configure services:
   - **Backend Service:**
     - Source: GitHub repo
     - Build: `npm install && npm start`
     - Environment type: Node.js
   - **Frontend Service:**
     - Source: GitHub repo
     - Build: `npm install && npm run build`
     - HTTP routes: `/api` → backend

6. Add database:
   - Create managed MongoDB
   - Update connection string in backend env

7. Deploy

---

## 🔐 Production Best Practices

### Security

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique `JWT_SECRET`
   - Rotate credentials regularly

2. **CORS Configuration:**
   - Update `CORS_ORIGIN` to your domain
   - Remove `credentials: true` if not needed

3. **Database:**
   - Enable MongoDB authentication
   - Use IP whitelisting
   - Enable SSL/TLS connections
   - Regular backups

4. **Email Service:**
   - Use app-specific passwords (not main password)
   - Enable 2FA on email account
   - Consider SendGrid/Mailgun for production

5. **Cloudinary:**
   - Use API key restrictions
   - Enable signed uploads
   - Monitor usage

### Monitoring

1. **Logs:**
   - Use cloud provider's logging service
   - Monitor error rates
   - Set up alerts

2. **Performance:**
   - Monitor API response times
   - Track database queries
   - Use CDN for static assets

3. **Uptime:**
   - Enable health checks
   - Auto-restart with PM2 (`pm2 save` and `pm2 startup`)
   - Set up status page

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build backend
        run: |
          cd backend
          npm install
          # Add build step if needed
      
      - name: Build frontend
        run: |
          cd Frontend
          npm install
          npm run build
      
      - name: Deploy to server
        run: |
          # SSH into server and pull latest code
          # Restart services with PM2
```

---

## 📊 Monitoring & Maintenance

### Regular Tasks

- **Weekly:** Check logs for errors
- **Monthly:** Update dependencies
- **Monthly:** Backup database
- **Quarterly:** Security audit
- **Quarterly:** Performance review

### Useful Commands

```bash
# View PM2 logs
pm2 logs drive-api

# Monitor processes
pm2 monit

# Restart backend
pm2 restart drive-api

# Stop backend
pm2 stop drive-api

# Delete process
pm2 delete drive-api

# Update backend (from project directory)
cd backend
git pull
npm install
pm2 restart drive-api

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# Backup MongoDB
mongodump --uri="mongodb://user:pass@host:27017/driveDB" --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb://user:pass@host:27017/" ./backup
```

---

## 🆘 Troubleshooting

### Backend not connecting to MongoDB
- Verify `MONGODB_URI` connection string
- Check network connectivity to MongoDB host
- Verify credentials

### Frontend not fetching API
- Confirm `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Verify backend is running

### Email not sending
- Check email credentials
- Verify email service is configured
- Check logs for errors
- Test with Mailtrap first

### SSL certificate issues
- Verify domain points to server
- Check certificate expiration
- Renew with: `certbot renew`

---

## 📞 Support Resources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

Last Updated: May 2026
