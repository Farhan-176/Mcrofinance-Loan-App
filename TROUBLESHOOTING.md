# 🔧 Troubleshooting Guide

Common issues and their solutions for the Saylani Microfinance App.

## Table of Contents
- [Installation Issues](#installation-issues)
- [MongoDB Issues](#mongodb-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Email Issues](#email-issues)
- [Authentication Issues](#authentication-issues)
- [General Issues](#general-issues)

---

## Installation Issues

### npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```powershell
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force

# Or clear cache first
npm cache clean --force
npm install
```

### Permission denied error

**Error:**
```
Error: EACCES: permission denied
```

**Solution:**
```powershell
# Run PowerShell as Administrator
# Or delete node_modules and try again
Remove-Item -Recurse -Force node_modules
npm install
```

---

## MongoDB Issues

### MongoDB service not starting

**Error:**
```
net start MongoDB
The MongoDB service could not be started
```

**Solution 1: Check if already running**
```powershell
Get-Service MongoDB
```

**Solution 2: Restart service**
```powershell
net stop MongoDB
net start MongoDB
```

**Solution 3: Start manually**
```powershell
# Find MongoDB installation
cd "C:\Program Files\MongoDB\Server\6.0\bin"
mongod --dbpath "C:\data\db"
```

**Solution 4: Check data directory**
```powershell
# Create data directory if missing
New-Item -ItemType Directory -Path "C:\data\db" -Force
```

### Connection refused to MongoDB

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Check if port 27017 is in use
netstat -ano | findstr :27017

# Start MongoDB
net start MongoDB

# Update connection string in .env
MONGODB_URI=mongodb://127.0.0.1:27017/saylani-microfinance
```

### Database authentication failed

**Error:**
```
MongoError: Authentication failed
```

**Solution:**
```env
# Use connection string without auth for local dev
MONGODB_URI=mongodb://localhost:27017/saylani-microfinance

# Or with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/saylani-microfinance
```

---

## Backend Issues

### Port 5000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution 1: Find and kill process**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Example:
taskkill /PID 12345 /F
```

**Solution 2: Change port**
```env
# In backend/.env
PORT=5001
```

**Solution 3: Close all Node processes**
```powershell
taskkill /F /IM node.exe
```

### JWT secret not found

**Error:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
```env
# Add to backend/.env
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-12345
```

### Cannot find module errors

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```powershell
cd backend
npm install
```

### nodemon not found

**Error:**
```
'nodemon' is not recognized as an internal or external command
```

**Solution 1: Install nodemon**
```powershell
npm install -g nodemon
```

**Solution 2: Use npx**
```powershell
npx nodemon src/server.js
```

**Solution 3: Use npm script**
```powershell
npm run dev
```

---

## Frontend Issues

### Port 3000 already in use

**Error:**
```
Port 3000 is in use
```

**Solution 1: Kill process**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 2: Use different port**
```powershell
# Vite will prompt, or specify in vite.config.js
# Change port to 3001 or any available port
```

### Module not found: axios

**Error:**
```
Module not found: Can't resolve 'axios'
```

**Solution:**
```powershell
cd frontend
npm install axios
```

### Tailwind styles not working

**Problem:** No styles appearing

**Solution 1: Check index.css**
```css
/* Ensure these lines are at the top of src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Solution 2: Restart dev server**
```powershell
# Stop (Ctrl+C) and restart
npm run dev
```

**Solution 3: Rebuild**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Cannot connect to backend

**Error in console:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution 1: Check backend is running**
```powershell
# Backend should be running on port 5000
# Open http://localhost:5000/api/health
```

**Solution 2: Check API URL**
```env
# In frontend/.env
VITE_API_URL=http://localhost:5000/api
```

**Solution 3: Check CORS**
```javascript
// In backend/src/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Email Issues

### Email not sending

**Error:**
```
Error sending email
```

**Solution 1: Check Gmail settings**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in .env

**Solution 2: Update .env**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Solution 3: Allow less secure apps (not recommended)**
```
Go to Google Account → Security → Allow less secure apps
```

**Solution 4: Test email service**
```javascript
// Create test script: backend/test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email',
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Success:', info);
});
```

Run: `node backend/test-email.js`

### Invalid credentials error

**Error:**
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution:**
- You're using your regular password instead of App Password
- Generate App Password from Google Account settings
- Use the 16-character App Password without spaces

---

## Authentication Issues

### Token not valid error

**Error:**
```
Token is not valid
```

**Solution 1: Check token format**
```javascript
// Should be: Bearer <token>
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Solution 2: Check JWT secret**
```env
# Backend .env should have same JWT_SECRET
JWT_SECRET=same-secret-everywhere
```

**Solution 3: Clear localStorage**
```javascript
// In browser console
localStorage.clear();
// Then login again
```

### Cannot login - Invalid credentials

**Problem:** Can't login with correct credentials

**Solution 1: Check password**
- For new accounts, check email for password
- For admin: admin@saylani.org / Admin@123

**Solution 2: Reset admin user**
```powershell
cd backend
node src/scripts/createAdmin.js
```

**Solution 3: Check database**
```javascript
// In MongoDB shell
use saylani-microfinance
db.users.find({ email: "admin@saylani.org" })
```

### User not found after registration

**Problem:** Registered but can't login

**Solution:**
```javascript
// Check MongoDB
use saylani-microfinance
db.users.find({ email: "your-email@example.com" })

// If not found, check backend logs during registration
// May be validation or database error
```

---

## General Issues

### Page not loading / White screen

**Solution 1: Check console**
```
Open browser DevTools (F12)
Check Console tab for errors
```

**Solution 2: Check network**
```
Open Network tab
See if API calls are failing
Check response status codes
```

**Solution 3: Clear browser cache**
```
Ctrl + Shift + Delete
Clear cache and reload
```

**Solution 4: Check both servers**
```powershell
# Backend should show:
Server is running on port 5000
MongoDB Connected: localhost

# Frontend should show:
VITE ready in XXms
Local: http://localhost:3000
```

### CORS error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```javascript
// Backend: src/server.js
app.use(cors({
  origin: 'http://localhost:3000', // Match frontend URL exactly
  credentials: true
}));

// Also check .env
FRONTEND_URL=http://localhost:3000
```

### Environment variables not loading

**Problem:** process.env.VARIABLE is undefined

**Solution 1: Check .env file location**
```
Backend: backend/.env (NOT backend/src/.env)
Frontend: frontend/.env (NOT frontend/src/.env)
```

**Solution 2: Check variable names**
```env
# Backend: No prefix
JWT_SECRET=abc123

# Frontend: Must have VITE_ prefix
VITE_API_URL=http://localhost:5000/api
```

**Solution 3: Restart servers**
```
Stop both servers (Ctrl+C)
Start again
```

### Build fails

**Error:**
```
npm run build
Error: Build failed
```

**Solution:**
```powershell
# Clear and rebuild
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
npm cache clean --force
npm install
npm run build
```

### PDF download not working

**Problem:** Slip doesn't download

**Solution 1: Check dependencies**
```powershell
cd frontend
npm install jspdf html2canvas
```

**Solution 2: Check console errors**
```
F12 → Console
Look for canvas or PDF errors
```

**Solution 3: Try different browser**
```
Test in Chrome, Firefox, Edge
Some browsers block automatic downloads
```

### QR code not showing

**Problem:** QR code blank or not visible

**Solution:**
```powershell
# Check if qrcode.react is installed
cd frontend
npm install qrcode.react

# In backend, check qrcode package
cd backend
npm install qrcode
```

---

## Debug Mode

### Enable detailed logging

**Backend:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend:**
```javascript
// Add to API calls
console.log('Request:', config);
console.log('Response:', response);
console.log('Error:', error);
```

### Check application health

**Health check endpoint:**
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Saylani Microfinance API is running"
}
```

---

## Still Having Issues?

### Checklist:
- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] .env files are configured correctly
- [ ] Dependencies are installed
- [ ] No console errors
- [ ] No network errors
- [ ] Correct API URL in frontend

### Get Help:
1. Read error message carefully
2. Check this troubleshooting guide
3. Search error online
4. Check documentation files
5. Review code step by step

### Quick Reset (Nuclear option):
```powershell
# Stop all servers
# Delete everything and start fresh

# Backend
cd "e:\saylani app try\backend"
Remove-Item -Recurse -Force node_modules
npm install
Copy-Item .env.example .env
# Configure .env
npm run dev

# Frontend
cd "..\frontend"
Remove-Item -Recurse -Force node_modules, dist
npm install
Copy-Item .env.example .env
# Configure .env
npm run dev
```

---

## Common Error Codes

- `400`: Bad Request - Check request body
- `401`: Unauthorized - Check token/login
- `403`: Forbidden - Check permissions
- `404`: Not Found - Check URL/ID
- `500`: Server Error - Check backend logs

---

**Remember:** Most issues are due to:
1. Services not running
2. Wrong configuration
3. Missing dependencies
4. Port conflicts
5. Environment variables

Take it step by step and you'll solve it! 💪
