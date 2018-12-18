var Book = require('../models/book');
var Review = require('../models/review');
var flash = require('connect-flash');

//all middelware goes inside this variable
var middlewareObj = {};

middlewareObj.checkBookOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        //if use is logged in
        Book.findById(req.params.id, function(err, foundBook) {
            if(err) {
                console.log(err);
                req.flash("error", "Oops! Book not found!");
                res.render("back");
            } else {
                //does user own the book?
                if(foundBook.creator.id.equals(req.user._id)) {
                    //then the user can proceed to update/delete book
                    next();
                } else {
                    //if not then redirect back
                    req.flash("error", "You don't have permission to do that, please login.");
                    res.redirect("back");
                }
            }
        });
    //if user is not logged in
    } else {
        //then redirect back
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        //if user is logged in
        Review.findById(req.params.review_id, function(err, foundReview) {
            if(err) {
                console.log(err);
                res.render("back");
            } else {
                //does user own the review?
                if(foundReview.creator.id.equals(req.user._id)) {
                    //then the user can proceed to update/delete review
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that, please login.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;