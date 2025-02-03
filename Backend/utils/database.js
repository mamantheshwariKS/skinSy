const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
// const DB = process.env.DB

const DBconnect = async () => {
  try {
    const DB = process.env.DB_CONNECTION_URL;  // Get DB URL from .env
    if (!DB) throw new Error("DB_CONNECTION_URL is missing from .env");
    
    await mongoose.connect(DB);
    console.log('DB Connected');
  } catch (error) {
    console.error('Failed to connect:', error);
    throw error;
  }
};

module.exports = { DBconnect };