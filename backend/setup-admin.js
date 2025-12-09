require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const setupDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@saylani.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists');
      console.log('Email: admin@saylani.com');
      console.log('Login at: http://localhost:3000/login');
      process.exit(0);
    }

    // Create default admin account
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const admin = new User({
      cnic: '00000-0000000-0',
      email: 'admin@saylani.com',
      name: 'Saylani Admin',
      password: hashedPassword,
      isAdmin: true,
      isFirstLogin: false
    });

    await admin.save();

    console.log('✅ Default admin account created successfully!');
    console.log('');
    console.log('=================================');
    console.log('Admin Login Credentials:');
    console.log('=================================');
    console.log('Email: admin@saylani.com');
    console.log('Password: Admin@123');
    console.log('');
    console.log('Login at: http://localhost:3000/login');
    console.log('Then go to: http://localhost:3000/admin-panel');
    console.log('=================================');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setupDefaultAdmin();
