var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Review = require('../models/review');

//NEW
router.get("/books/:id/reviews/new", isLoggedIn, function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/new", {book: book});
        }
    });
});

//CREATE
router.post("/books/:id/reviews", isLoggedIn, function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            Review.create(req.body.review, function(err, review) {
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to review
                    review.creator.id = req.user._id;
                    review.creator.username = req.user.username;
                    //save review
                    review.save();
                    book.review.push(review);
                    book.save();
                    res.redirect("/books/" + book._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;