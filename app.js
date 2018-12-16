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


//APP CONFIG
mongoose.connect("mongodb://localhost/BooksReviewApp", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(methodOverride("_method"));
seedDB();

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


//RESTful ROUTES
//DEFAULT
app.get("/", function(req, res) {
    res.redirect("/books");
});

//INDEX
app.get("/books", function(req, res) {
    Book.find({}, function(err, books) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/index", {books: books}); //remember, we want to render index and pass data
        }
    });
}); 

//NEW
app.get("/books/new", function(req, res) {
    res.render("books/new");
})

//CREATE
app.post("/books", function(req, res) {
    Book.create(req.body.book, function(err, newBook) {
        if(err) {
            res.redirect("/books/new");
        } else {
            res.redirect("/books");
        }
    });
});

//SHOW
app.get("/books/:id", function(req, res) {
    Book.findById(req.params.id).populate("review").exec(function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            console.log(foundBook);
            res.render("books/show", {book: foundBook});
        }
    });
}); 

//EDIT
app.get("/books/:id/edit", function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.render("books/edit", {book: foundBook});
        }
    });
});

//UPDATE
app.put("/books/:id", function(req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE
app.delete("/books/:id", function(req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    });
});

//================
//REVIEW ROUTES
//================
//NEW
app.get("/books/:id/reviews/new", function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/new", {book: book});
        }
    });
});

//CREATE
app.post("/books/:id/reviews", function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            Review.create(req.body.review, function(err, review) {
                if(err) {
                    console.log(err);
                } else {
                    book.review.push(review);
                    book.save();
                    res.redirect("/books/" + book._id);
                }
            });
        }
    });
});

//===========
//AUTH ROUTES
//===========
//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        //console.log(newUser);
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/books");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), function(req, res) {
});

//Port listening
app.listen(8080, function() {
    console.log("Server started on port 8080.");
});