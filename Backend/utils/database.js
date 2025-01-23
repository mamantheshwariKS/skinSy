const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
// const DB = process.env.DB

const database = async (DB) => {
  try {
    await mongoose.connect(DB);
    console.log("DB Connected")
  } catch (error) {
    (console.error("failed to connect", error))
  }
}
module.exports = database;