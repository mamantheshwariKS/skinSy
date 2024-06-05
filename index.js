const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const database = require('./src/utils/database')
const DB = process.env.DB
app.get('/', function (req, res) {
  res.send('Hello World')
})
database(DB).then(() => {
  app.listen(PORT, () => {
    console.log("server is running in the port 5050")
  })
}).catch((error) => {
  console.error("Server startup failed due to database connection error", error);
});