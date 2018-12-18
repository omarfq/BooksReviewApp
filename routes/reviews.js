var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Review = require('../models/review');
var middleware = require('../middleware/index');

//NEW
router.get("/books/:id/reviews/new", middleware.isLoggedIn, function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/new", {book: book});
        }
    });
});

//CREATE
router.post("/books/:id/reviews", middleware.isLoggedIn, function(req, res) {
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

//EDIT
router.get("/books/:id/reviews/:review_id/edit", middleware.checkReviewOwnership, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("reviews/edit", {book_id: req.params.id, review: foundReview});
        }
    });
});

//UPDATE
router.put("/books/:id/reviews/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview) {
        if(err) {
            console.log(err);
            res.reditect("back");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/books/:id/reviews/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if(err)  {
            console.log(err);
        } else {
            res.redirect("/books/" + req.params.id);
        }
     });
});

module.exports = router;