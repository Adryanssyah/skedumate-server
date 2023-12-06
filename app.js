const express = require('express');
require('dotenv').config();
const cors = require('cors');
const router = require('./routes/routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const app = express();
app.use(cookieParser());
app.use(
     cors({
          origin: process.env.CLIENT,
          credentials: true,
     })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
     session({
          secret: 'rahasia',
          resave: false,
          saveUninitialized: false,
          store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, collectionName: 'sessions' }),
          cookie: {
               expires: new Date(Date.now() + 30 * 86400 * 1000),
               maxAge: 30 * 86400 * 1000,
               sameSite: false,
               httpOnly: false,
          },
     })
);

// if (app.get('env') === 'production') {
//      app.set('trust proxy', 1);
//      sess.cookie.secure = true;
// }

app.use(router);

module.exports = app;

// const app = require('express')();
// const { v4 } = require('uuid');

// app.get('/checkSession', (req, res) => {
//      res.send(false);
// });

// app.get('/api/item/:slug', (req, res) => {
//      const { slug } = req.params;
//      res.end(`Item: ${slug}`);
// });

// module.exports = app;
