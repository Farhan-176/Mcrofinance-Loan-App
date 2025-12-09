require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/database');

async function createAdmin() {
  try {
    await connectDB();
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@saylani.org' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@saylani.org');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const admin = new User({
      cnic: '12345-1234567-1',
      email: 'admin@saylani.org',
      name: 'Admin User',
      password: hashedPassword,
      isAdmin: true,
      isFirstLogin: false,
      phoneNumber: '+92-21-111-729-526',
      address: {
        street: 'Main Office',
        city: 'Karachi',
        country: 'Pakistan',
        zipCode: '75000'
      }
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@saylani.org');
    console.log('Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
