const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recruitment');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.phoneNumber);
      return;
    }

    // Create admin user
    const adminUser = new User({
      phoneNumber: '+1234567890', // Change this to your phone number
      email: 'admin@recruitment.com',
      role: 'admin',
      isVerified: true,
      isActive: true,
      permissions: [
        'bulk_upload',
        'single_upload',
        'export',
        'search',
        'manage_recruiters',
        'manage_trackers',
        'funnel_data',
      ]
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.phoneNumber);
    console.log('You can now login with this phone number and any OTP');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdminUser(); 