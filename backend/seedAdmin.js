const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const run = async () => {
  try {
    await connectDB();

    const email = 'admin@example.com';
    const password = 'admin123';

    let existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
    } else {
      const admin = new Admin({ email, password });
      await admin.save();
      console.log('Admin created:', email, 'password:', password);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

run();
