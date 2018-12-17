var express = require('express');
var router = express.Router();
var Book = require('../models/book');

//INDEX
router.get("/books", function(req, res) {
    Book.find({}, function(err, books) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/index", {books: books}); //remember, we want to render index and pass data
        }
    });
}); 

//NEW
router.get("/books/new", function(req, res) {
    res.render("books/new");
})

//CREATE
router.post("/books", function(req, res) {
    Book.create(req.body.book, function(err, newBook) {
        if(err) {
            res.redirect("/books/new");
        } else {
            res.redirect("/books");
        }
    });
});

//SHOW
router.get("/books/:id", function(req, res) {
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
router.get("/books/:id/edit", function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.render("books/edit", {book: foundBook});
        }
    });
});

//UPDATE
router.put("/books/:id", function(req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/books/:id", function(req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    });
});

module.exports = router;