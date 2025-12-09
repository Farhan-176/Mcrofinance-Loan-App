# Saylani Microfinance App - Qarze Hasana Program

A comprehensive MERN stack application for Saylani Welfare's interest-free loan (Qarze Hasana) program. This application streamlines the loan application process for users and provides efficient management tools for administrators.

## 🌟 Features

### User Features
- **Loan Calculator**: Interactive calculator to estimate loan amounts and monthly payments
- **Multiple Loan Categories**:
  - Wedding Loans (up to PKR 5 Lakh, 3 years)
  - Home Construction Loans (up to PKR 10 Lakh, 5 years)
  - Business Startup Loans (up to PKR 10 Lakh, 5 years)
  - Education Loans (based on requirement, 4 years)
- **Easy Application Process**: Step-by-step loan application with guarantor information
- **Digital Slip Generation**: QR code-enabled appointment slips
- **Application Tracking**: Real-time status updates on loan applications

### Admin Features
- **Dashboard with Statistics**: Overview of all applications and loan amounts
- **Application Management**: View, filter, and manage all loan applications
- **Token Assignment**: Automatic token generation and appointment scheduling
- **Status Updates**: Approve, reject, or update application status
- **Location-based Filtering**: Filter applications by city and country

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- QR Code generation

### Frontend
- React.js 18
- React Router DOM
- Vite
- Tailwind CSS
- Axios
- React Icons
- jsPDF & html2canvas for PDF generation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Git

## 🚀 Installation

### 1. Clone the Repository

```powershell
git clone <repository-url>
cd "saylani app try"
```

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with your configuration
notepad .env
```

**Configure the following in `.env`:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/saylani-microfinance
JWT_SECRET=your_secure_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
OFFICE_LOCATION=Saylani Welfare Office, Karachi
```

**Note**: For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASSWORD

### 3. Frontend Setup

```powershell
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

**Configure the following in `.env`:**

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Start MongoDB:

```powershell
# If MongoDB is installed as a service
net start MongoDB

# Or start MongoDB manually
mongod --dbpath "C:\data\db"
```

### 5. Create Admin User (Optional)

To create an admin user, you can either:

**Option A**: Register normally and manually update in MongoDB:

```javascript
// In MongoDB shell or Compass
use saylani-microfinance
db.users.updateOne(
  { email: "admin@saylani.org" },
  { $set: { isAdmin: true } }
)
```

**Option B**: Create a seed script (you can add this to backend):

```javascript
// backend/src/scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = new User({
    cnic: '12345-1234567-1',
    email: 'admin@saylani.org',
    name: 'Admin User',
    password: hashedPassword,
    isAdmin: true,
    isFirstLogin: false
  });
  
  await admin.save();
  console.log('Admin user created successfully');
  process.exit(0);
}

createAdmin();
```

Run: `node src/scripts/createAdmin.js`

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
```powershell
cd frontend
npm run build
npm run preview
```

## 📖 Usage Guide

### For Users

1. **Visit the Landing Page**: Browse loan categories and use the calculator
2. **Calculate Loan**: Select category, amount, deposit, and period
3. **Register**: Click "Proceed" and fill in your CNIC, email, and name
4. **Check Email**: Receive login credentials via email
5. **Login**: Use provided credentials to login
6. **Change Password**: Set a new secure password on first login
7. **Complete Application**: Fill in personal information and add two guarantors
8. **Track Application**: Monitor status in your dashboard
9. **Download Slip**: Once approved and token assigned, download appointment slip

### For Admins

1. **Login**: Use admin credentials
2. **View Dashboard**: See statistics and all applications
3. **Filter Applications**: Use city, country, or status filters
4. **Manage Applications**: Click "Manage" to view details
5. **Assign Token**: Set appointment date, time, and location
6. **Update Status**: Approve, reject, or update application status

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Loans
- `GET /api/loan/categories` - Get loan categories
- `POST /api/loan/calculate` - Calculate loan
- `POST /api/loan/request` - Create loan request
- `POST /api/loan/request/:id/guarantors` - Add guarantors
- `GET /api/loan/requests` - Get user's loan requests
- `GET /api/loan/request/:id` - Get single loan request
- `GET /api/loan/slip/:id` - Generate slip

### Admin (Protected)
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/stats` - Get statistics
- `PUT /api/admin/application/:id/status` - Update status
- `POST /api/admin/application/:id/assign` - Assign token
- `GET /api/admin/application/token/:tokenNumber` - Get by token

## 📁 Project Structure

```
saylani app try/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   └── loanController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Guarantor.js
│   │   │   ├── LoanRequest.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── loanRoutes.js
│   │   ├── utils/
│   │   │   ├── email.js
│   │   │   ├── helpers.js
│   │   │   └── loanCalculations.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── LoanCalculator.jsx
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminPanel.jsx
    │   │   ├── ChangePasswordPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── LoanApplicationPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── SlipPage.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB service
net start MongoDB
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Gmail
- Ensure EMAIL_USER and EMAIL_PASSWORD are set correctly

## 🚢 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Set environment variable: `VITE_API_URL`

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update MONGODB_URI in backend

## 📝 License

This project is created for Saylani Welfare Trust.

## 👥 Contributing

This is a hackathon project. For contributions, please follow the standard fork and pull request workflow.

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: info@saylani.org.pk
- Phone: +92-21-111-729-526

## 🙏 Acknowledgments

- Saylani Welfare Trust for the Qarze Hasana program
- MERN Stack Community
- All contributors and testers

---

**Built with ❤️ for Saylani Welfare Trust**
