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

//APP CONFIG
mongoose.connect("mongodb://localhost/BooksReviewApp", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(methodOverride("_method"));
seedDB();

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
            res.render("index", {books: books}); //remember, we want to render index and pass data
        }
    });
}); 

//NEW
app.get("/books/new", function(req, res) {
    res.render("new");
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
            res.render("show", {book: foundBook});
        }
    });
}); 

//EDIT
app.get("/books/:id/edit", function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.render("edit", {book: foundBook});
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

//Port listening
app.listen(8080, function() {
    console.log("Server started on port 8080.");
});