# Saylani Microfinance - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

Open PowerShell and run:

```powershell
# Backend
cd "e:\saylani app try\backend"
npm install

# Frontend
cd "..\frontend"
npm install
```

### Step 2: Setup Environment Files

**Backend (.env):**
```powershell
cd "..\backend"
Copy-Item .env.example .env
```

Edit the `.env` file and add your configuration:
- MongoDB URI (default works if MongoDB is running locally)
- JWT Secret (any random string)
- Email credentials (for Gmail with App Password)

**Frontend (.env):**
```powershell
cd "..\frontend"
Copy-Item .env.example .env
```

The default configuration should work fine.

### Step 3: Start MongoDB

```powershell
# If installed as service
net start MongoDB

# Or check if running
Get-Service MongoDB
```

### Step 4: Create Admin User

```powershell
cd "..\backend"
node src/scripts/createAdmin.js
```

This will create an admin account:
- Email: admin@saylani.org
- Password: Admin@123

### Step 5: Run the Application

Open **two separate PowerShell windows**:

**Window 1 - Backend:**
```powershell
cd "e:\saylani app try\backend"
npm run dev
```

**Window 2 - Frontend:**
```powershell
cd "e:\saylani app try\frontend"
npm run dev
```

### Step 6: Access the Application

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Quick Test

1. Visit http://localhost:3000
2. Use the loan calculator on the landing page
3. Click "Proceed" to register as a new user
4. Check your email for credentials (if email configured)
5. Login with admin account to access admin panel

## 📧 Email Configuration (Optional but Recommended)

For Gmail:
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
4. Add to backend `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=generated-app-password
   ```

## 🔧 Common Issues

### MongoDB not running
```powershell
net start MongoDB
```

### Port 5000 or 3000 already in use
```powershell
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Dependencies not installing
```powershell
# Clear cache and retry
npm cache clean --force
npm install
```

## 📱 Test Accounts

**Admin:**
- Email: admin@saylani.org
- Password: Admin@123

**Regular User:**
- Register through the application

## 🎓 Features to Test

### User Journey:
1. ✅ Landing page with loan categories
2. ✅ Loan calculator
3. ✅ User registration
4. ✅ Login and password change
5. ✅ Loan application with guarantors
6. ✅ Dashboard with application status
7. ✅ Slip generation with QR code

### Admin Features:
1. ✅ Admin dashboard with statistics
2. ✅ View all applications
3. ✅ Filter by city/country/status
4. ✅ Assign token and appointment
5. ✅ Update application status

## 🚀 Next Steps

- Configure email for production
- Deploy to cloud (Vercel + Railway/Render)
- Set up MongoDB Atlas for production database
- Add SSL certificates for production

## 💡 Tips

- Keep both terminal windows open while developing
- Backend runs on port 5000, frontend on port 3000
- MongoDB should be running before starting backend
- Check browser console and terminal for errors
- Use admin panel to manage all applications

## 📞 Need Help?

Check the full README.md for detailed documentation and troubleshooting.

---

**Happy Coding! 🎉**
