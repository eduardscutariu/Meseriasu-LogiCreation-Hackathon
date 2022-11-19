const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const {User, Review} = require(__dirname + "/database.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const initializePassport = require("./passport-configure");
initializePassport(passport);
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const session = require("express-session");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


const sessionStore = new MongoStore({
    mongoUrl:"mongodb://localhost:27017/LogiCreation",
    collection:"sessions"
  })
  
  
   app.use(session({
     secret: "This is the secret, bro",
     resave: false,
     saveUninitialized: true,
     store:sessionStore,
     })
   );
  
   app.use(passport.initialize());
   app.use(passport.session());
  
//  ... 


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register");
})



app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;
    const name = req.body.name;
    const fname = req.body.fname;
    const checkbox = req.body.checkbox;
    const price = req.body.price;
    const department = req.body.department;
        User.findOne({username: username}, (err, user) => {
            if(!err) {
                if (user) res.redirect("/register");
                else
                    {
                        if (password !== confirmation) {
                            res.redirect("/register");
                        }
                        else {
                            // if(req.isAuthenticated())
                            // console.log(req.user);
                        bcrypt.hash(password, saltRounds, function(err, hash) {
                            if (!err)
                            {
                                const user = new User({
                                    username: username,
                                    password: hash, 
                                    name: name,
                                    fname: fname,
                                    money:0,
                                    reviews_number: 0,
                                })
                                user.save();
                            }
                        })
                        res.redirect("/login");
                        }
    
                    }
             }
        })
    
     })



app.get("/login", (req, res) => {
    if (req.isAuthenticated()) console.log("ok");
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"/login"
  }))

  app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

app.listen(3000, () => {
    console.log("Server is running on port: 3000");
})

