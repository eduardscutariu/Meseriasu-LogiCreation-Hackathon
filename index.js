const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const {User, Review, Message} = require(__dirname + "/database.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const initializePassport = require("./passport-configure");
initializePassport(passport);
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const multer = require("multer");
var fs = require('fs');
var path = require('path');
const useMulter = multer({
    storage: multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, __dirname + '/public/uploads/')
      },
      filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    })
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const meserii = ["electrician", "menajera", "zidar","zugrav", "instalator", "cosar", "tamplar", "gradinar", "dulgher", "mansardar", "montantor", "fierar", "sudor", "designer"];

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
var money = - 1;

app.use((req, res, next) => {
    if (req.isAuthenticated())        
     User.findOne({username: req.user.username}, (err, user) => {
        if (!err)
            {
                money = user.money;
            }
            
}) 
 next();
})


app.get("/", (req, res) => {
    let auth = false;
    console.log(money);
    if (req.isAuthenticated()) auth = true;
    User.find({job: { $ne: "none"}}, (err, data) => {
        res.render("home", {data: data, auth: auth, money: money});
    })
    
})


app.post("/register", useMulter.any(), (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;
    const name = req.body.name;
    const fname = req.body.fname;
    const checkbox = req.body.checkbox;
    let price = req.body.price;
    const department = req.body.department;
    let meserie = req.body.meserie;
    const filename = req.files[0].filename;
    if (price === undefined) price = 0;
    if (meserie === undefined) meserie = "none";
    console.log(req.files);
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
                            if (err) console.log(err);
                            else if (!err)
                            {
                                const user = new User({
                                    username: username,
                                    password: hash, 
                                    name: name,
                                    fname: fname,
                                    job: meserie,
                                    money:0,
                                    img: filename,
                                    price: price,
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
    if (req.isAuthenticated()) res.redirect("/money");
    else res.render("login", {meserii: meserii, auth: false, money: money});
})

app.post("/login", passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"/login"
  }))

  app.get("/logout", (req, res) => {
    money = -1;
    req.logOut(() => {
        res.redirect("/login");

    });
});

app.get("/about", (req, res) => {
    let auth = false; 
    if (req.isAuthenticated()) auth = true;
    res.render("about", {auth: auth, money: money});
})

app.get("/money", (req, res) => {
    if (req.isAuthenticated) res.render("money", {auth: true, money: money});
    else res.redirect("login");
})

app.post("/money", (req, res) => {
    let money = Number(req.body.money);
    console.log(money);

    const user = User.findOne({username: req.user.username}, (err, data) => {
        data.money = data.money + money;
        data.save();
        res.render("money", {auth: true, money: data.money});
    })
})

app.get("/user/:username", (req, res) => {
        User.findOne({username: req.params.username}, (err, data) => {
        if (data)
        {
            res.render("upage", {user: data, auth: true, money: money});
             }
        else res.redirect("/");
    })
    
})

app.get("/message", (req, res) => {
    Message.find({to: req.user.username}, (err, data) => {
        res.render("message", {money: money, auth: true, messages: data});
    })

})

app.post("/message", (req, res) => {
    const mess = req.body.mess;
    console.log(mess);
    const to = req.body.user;
    const from = req.user.username;
    const message = new Message({
        name: from, 
        to: to,
        message: mess
    })
    message.save();
    User.findOneAndUpdate(
        { username: to}, 
        { $push: { message: message  } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
    })
    res.redirect("/");  
})

app.post("/off", (req, res) => {
    const ore = req.body.ore;
    const from = req.user.username;
    const to = req.body.to;
    const message = new Message({
        name: from, 
        to: to,
        message: ore
    })
    message.save();

    User.findOneAndUpdate(
        { username: to}, 
        { $push: { message: message  } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
    })
    res.redirect("/message");
})

app.listen(3000, () => {
    console.log("Server is running on port: 3000");
})

