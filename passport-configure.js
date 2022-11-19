const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {User} = require(__dirname + "/database.js");
function initialize(passport)
{
  const authenticateUser = (username, password, done) => {
    User.findOne({username:username}, (err, foundUser) => {
      if (err) console.log(err);
      if (!err) {
        console.log("2");
        if (!foundUser) {done(null, false); console.log("1")}
        else {
            bcrypt.compare(password,foundUser.password, function (err, result)
        {
          if (result) {console.log("2");done(null, foundUser);}
          else {console.log("3");done(null, false);}
        })
      }
      }
    })
  }
  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
