var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const mongodb = require('./db/conection');
const port = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

// app.use('/', bodyParser.json()).use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested.With, Content-Type, Accept, Z-Key'
//   );
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   next();
// });
// app.use('/', require('./routes'));

app.use('/', bodyParser.json()).use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
