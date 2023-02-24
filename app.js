// Required imports
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Initialize app
const app = express();

// Set session options
let sessionOptions = session({
  secret: "1234567890",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Allow cookie to be 1 day old at maximum
    maxAge: 60 * 60 * 24 * 1000,
    httpOnly: true,
  },
});

// Use session options
app.use(sessionOptions);

// Accessing router
const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  //make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  next();
});

// Static file and view rendering
app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

// Initializing router
app.use("/", router);

module.exports = app;