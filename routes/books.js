var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var middleware = require('../middleware/index');

//INDEX
router.get("/", function(req, res) {
    Book.find({}, function(err, books) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/index", {books: books}); //remember, we want to render index and pass data
        }
    });
}); 

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("books/new");
})

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to books array
    var title = req.body.title;
    var author = req.body.author;
    var image = req.body.image;
    var desc = req.body.description;
    var creator = {
        id: req.user._id,
        username: req.user.username
    }
    var newBook = {title: title, author: author, image: image, description: desc, creator: creator}
    //create a new book and save to DB
    Book.create(newBook, function(err, newlyCreatedBook) {
        if(err) {
            res.redirect("/books/new");
        } else {
            res.redirect("/books");
        }
    });
});

//SHOW
router.get("/:id", function(req, res) {
    Book.findById(req.params.id).populate("review").exec(function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            console.log(foundBook);
            res.render("books/show", {book: foundBook, currentUser: req.user});
        }
    });
}); 

//EDIT
router.get("/:id/edit", middleware.checkBookOwnership,function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.render("books/edit", {book: foundBook});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkBookOwnership, function(req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/:id", middleware.checkBookOwnership, function(req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    });
});

module.exports = router;