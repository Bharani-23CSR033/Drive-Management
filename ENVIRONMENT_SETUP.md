# Environment Setup Guide

This guide walks you through setting up all required services and environment variables for the Drive Management System.

## 📋 Table of Contents

1. [MongoDB Setup](#mongodb-setup)
2. [Cloudinary Setup](#cloudinary-setup)
3. [Email Service Setup](#email-service-setup)
4. [JWT Configuration](#jwt-configuration)
5. [Environment Files](#environment-files)

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster:**
   - Click "Create a Deployment"
   - Select "Shared" (free tier)
   - Choose your region (closest to your users)
   - Cluster name: `drive-management`
   - Click "Create"

3. **Setup Security:**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses

4. **Create Database User:**
   - Go to "Security" → "Database Access"
   - Click "Add a Database User"
   - Username: `drivemgmt`
   - Password: Generate strong password (save it!)
   - Role: `Atlas Admin`
   - Click "Create User"

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Choose Node.js version
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `driveDB`

   **Format:** `mongodb+srv://drivemgmt:password@cluster.mongodb.net/driveDB?retryWrites=true&w=majority`

### Option 2: Local MongoDB

```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod  # or as a service

# Verify connection
mongosh  # or mongo
```

**Connection String:** `mongodb://localhost:27017/driveDB`

---

## 🖼️ Cloudinary Setup

Cloudinary handles image/file uploads for resumes and profile pictures.

1. **Create Account:**
   - Go to [Cloudinary](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials:**
   - Dashboard shows your "Cloud Name"
   - Go to "Settings" → "API Keys"
   - Generate new API key if needed
   - Get your API Secret (keep it private!)

3. **Configuration:**
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Optional - Security:**
   - Set "Upload Presets" in Cloudinary dashboard
   - Enable unsigned uploads if desired
   - Restrict file types (jpg, png, pdf)

---

## 📧 Email Service Setup

### Option 1: Gmail (Free, Easy Setup)

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to [Google Account - App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google generates 16-character password
   - Use this password in `.env`

3. **Configuration:**
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=noreply@drivemanagement.com
   ```

### Option 2: Mailtrap (Great for Testing)

1. **Create Account:**
   - Go to [Mailtrap](https://mailtrap.io)
   - Sign up for free

2. **Create Project:**
   - Click "Create Project"
   - Select "Send with SMTP"
   - Name: "Drive Management"

3. **Get Credentials:**
   - In project, go to "Integrations" → "Nodemailer"
   - Copy SMTP settings

4. **Configuration:**
   ```
   EMAIL_SERVICE=mailtrap
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_username
   EMAIL_PASSWORD=your_mailtrap_password
   ```

5. **View Emails:**
   - All test emails appear in Mailtrap inbox
   - Great for development without sending real emails

### Option 3: SendGrid (Production-Ready)

1. **Create Account:**
   - Go to [SendGrid](https://sendgrid.com)
   - Sign up for free tier (100 emails/day)

2. **Generate API Key:**
   - Go to Settings → API Keys
   - Create new API key
   - Save the key (you won't see it again!)

3. **Create Sender:**
   - Go to Sender Authentication
   - Verify your email or domain

4. **Configuration:**
   ```
   EMAIL_SERVICE=SendGrid
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   EMAIL_FROM=noreply@drivemanagement.com
   ```

### Option 4: Console (Development Only)

For development, emails are logged to console:

```
EMAIL_SERVICE=console
```

---

## 🔐 JWT Configuration

### Generate Secure JWT Secret

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
- Go to [Random.org](https://www.random.org/strings/)
- Generate 64 character hex string

### Store JWT Secret

Add to `.env`:
```
JWT_SECRET=your_64_character_hex_string_here
```

---

## 📝 Environment Files

### Backend Setup

1. **Copy template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edit `backend/.env`:**
   ```bash
   # Application
   PORT=5000
   NODE_ENV=production

   # MongoDB
   MONGODB_URI=mongodb+srv://drivemgmt:password@cluster.mongodb.net/driveDB

   # JWT
   JWT_SECRET=your_generated_secret

   # Cloudinary
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@drivemanagement.com

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

3. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

### Frontend Setup

1. **Copy template:**
   ```bash
   cp Frontend/.env.example Frontend/.env.local
   ```

2. **Edit `Frontend/.env.local`:**
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

---

## ✅ Verification Checklist

After setting up all services, verify:

- [ ] MongoDB connection works
  ```bash
  mongosh "mongodb+srv://drivemgmt:password@cluster.mongodb.net/driveDB"
  ```

- [ ] Cloudinary credentials are valid
  - Test upload in dashboard

- [ ] Email service sends emails
  - Test in backend: `npm run dev`
  - Trigger email action in app

- [ ] Backend environment variables loaded
  - Check: `console.log(process.env.MONGODB_URI)`

- [ ] Frontend API connection works
  - Check Network tab in browser DevTools
  - Verify API calls succeed

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

**Terminal 3 - MongoDB (if local):**
```bash
mongod
```

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions on AWS, Railway, Vercel, Render, and other cloud platforms.

---

## 🆘 Common Issues

### "MongooseError: Cannot connect to MongoDB"
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Verify username/password are correct
- Check internet connection

### "Cloudinary upload failed"
- Verify `CLOUDINARY_NAME` is correct
- Check API key and secret
- Ensure unsigned uploads are enabled (if using unsigned)

### "Email not sending"
- Verify credentials in `.env`
- Check app password (not main password) for Gmail
- Test with Mailtrap first
- Check logs: `npm run dev`
- Verify email is in correct format

### "Frontend cannot reach backend"
- Check backend is running on port 5000
- Verify `VITE_API_BASE_URL` in frontend `.env.local`
- Check CORS settings in backend
- Clear browser cache and reload

---

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Nodemailer Docs](https://nodemailer.com/)
- [JWT.io](https://jwt.io/)

---

## 🔄 Regular Maintenance

### Weekly
- Monitor email quota usage
- Check Cloudinary storage usage

### Monthly
- Rotate API keys (optional but recommended)
- Review MongoDB Atlas logs
- Test backup/restore

### Quarterly
- Update dependencies
- Security audit of secrets
- Performance review

---

Last Updated: May 2026
