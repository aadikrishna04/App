const User = require("../models/User");

// Handling user registration
exports.signup = function (req, res) {
  let user = new User(req.body);
  user.signup();
  req.session.user = {
    firstname: user.data.firstName,
    lastname: user.data.lastname,
    gender: user.data.gender,
    email: user.data.email,
    password: user.data.password,
    _id: user.data._id,
  };
  req.session.save(function () {
    res.redirect("/feed");
  });
};

// Handling user login
exports.login = function (req, res) {
  if (req.session.user) {
    res.redirect("/feed");
    return;
  }
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = {
        firstname: user.data.fullname.substring(
          0,
          user.data.fullname.indexOf(" ")
        ),
        lastname: user.data.fullname.substring(
          user.data.fullname.indexOf(" ") + 1,
          user.data.fullname.length
        ),
        email: user.data.email,
        _id: user.data._id,
      };
      req.session.save(function () {
        res.redirect("/feed");
      });
    })
    .catch(function (err) {
      req.session.save(function () {
        res.send("Invalid username or password. Please try again.");
      });
    });
};

// Check if user is logged in
exports.isLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    // res.send("must be logged in");
    req.session.save(function () {
      res.redirect("/login");
    });
  }
};

// Handling user logout
exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};

// Render dashboard
exports.feed = function (req, res) {
  if (req.session.user) {
    res.render("feed");
  } else {
    res.redirect("/login");
  }
};
