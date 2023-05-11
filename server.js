var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const mongodb = require('./db/conection');
const port = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

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

// app.use('/', bodyParser.json()).use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });
// app.use('/', require('./routes'));

app
  .use(bodyParser.json())
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true
    })
  )

  .use(passport.initialize())

  .use(passport.session())

  // .use((req, res, next) => {
  //   res.setHeader('Access-Controll-Allow-Origin', '*');
  //   res.setHeader(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  //   );
  //   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
  //   next();
  // })
  // .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  // .use(cors({ origin: '*' }))
  // .use("/", require("./routes/index.js"));

    .use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
  })
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }))
  .use("/", require("./routes/index.js"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      //User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(null, profile);
      //});
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged Out'
  );
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
