const app = require('./index');
const mongoDBConnection = require('./utils/database');

const port = process.env.PORT || 5050;
const database = process.env.DB_CONNECTION_URL;
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


mongoDBConnection.DBconnect(database) 
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        console.log(`Server listening on port ${port} & DB Connected`);
      }
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });