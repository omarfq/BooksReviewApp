var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Book = require('./models/book');
var Review = require('./models/review');
var User = require('./models/user');
var seedDB = require('./seed');
var session = require('express-session');

//ROUTES
var booksRoutes = require('./routes/books');
var reviewsRoutes = require('./routes/reviews');
var indexRoutes = require('./routes/index');

//APP CONFIG
mongoose.connect("mongodb://localhost/BooksReviewApp", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(methodOverride("_method"));
//seedDB(); //seed the DB

//PASSPORT CONFIG
app.use(session({
    secret: "I love books!",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//ROUTES CONFIG
app.use(booksRoutes);
app.use(reviewsRoutes);
app.use(indexRoutes);

//Port listening
app.listen(8080, function() {
    console.log("Server started on port 8080.");
});