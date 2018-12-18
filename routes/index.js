var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var flash = require('connect-flash');

//DEFAULT
router.get("/", function(req, res) {
    res.redirect("/books");
});

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        //console.log(newUser);
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to the BooksReviewApp " + user.username + "!");
            res.redirect("/books");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), function(req, res) {
        req.flash("success", "Welcome back " + user.username + "!");
        res.redirect("/books");
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully!");
    res.redirect("/books");
});

module.exports = router;