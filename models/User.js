const bcrypt = require("bcryptjs");

const usersCollection = require("../db").db().collection("users");

let User = function (data) {
  this.data = data;
};

User.prototype.signup = function () {
  delete this.data["confirm-password"];
  this.data.fullname = this.data.firstname + " " + this.data.lastname;
  delete this.data.firstname;
  delete this.data.lastname;
  let salt = bcrypt.genSaltSync(10);
  this.data.password = bcrypt.hashSync(this.data.password, salt);
  currentUser = this.data;
  usersCollection.insertOne(this.data, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ email: this.data.email })
      .then((currentUser) => {
        if (
          currentUser &&
          bcrypt.compareSync(this.data.password, currentUser.password)
        ) {
          resolve("Succesfully logged in!");
        } else {
          reject("Error with login.");
        }
      })
      .catch(function () {
        reject("Error with application, please try again later.");
      });
  });
};

module.exports = User;
