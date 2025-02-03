// const express = require('express')
// const app = express()
// const dotenv = require('dotenv')
// dotenv.config()
// const PORT = process.env.PORT
// const database = require('./utils/database')
// const DB = process.env.DB

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// database(DB).then(() => {
//   app.listen(PORT, () => {
//     console.log("server is running in the port 5050")
//   })
// }).catch((error) => {
//   console.error("Server startup failed due to database connection error", error);
// });

const express = require('express');
require('dotenv').config({ path: `${__dirname}/config.env` });
const router = require('./router');
const BaseError = require('./utils/baseError');
const cors = require('cors');
const morgan = require('morgan')
const errorHandler = require('./utils/errorHandler');
const app = express();

// //Check ENV and activate MORGAN
// if (process.env.NODE_ENV !== 'production') {
//     const morgan = require('morgan');
//     app.use(morgan('dev'));
// }
//Handle CORS
// const whitelist = ['http://localhost:3000', 'http://shelterwave.com', 'https://shelterwave.com'];
const options = {
    // origin: (origin, cb) => {
    //     if (whitelist.indexOf(origin) !== -1) {
    //         cb(null, true);
    //     }
    //     else {
    //         cb(new Error(`${origin ? `${origin} - ` : ''}Not a valid origin url. Requests initiated from this origin are not allowed.`));
    //     }
    // },
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(options));
app.use(morgan('dev'))

// app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(headersMiddleware);
app.use(express.static(`${__dirname}/assets`));
app.use('/api', router);

app.all('*', (req, res) => {
    throw new BaseError(0, `Requested URL ${req.originalUrl} not found`, 404);
});

app.use(errorHandler);


module.exports = app;