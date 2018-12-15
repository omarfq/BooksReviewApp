var mongoose = require('mongoose');
var Book = require('./models/book');
var Review = require('./models/review');

var data = [
    {
        title: "The 48 Laws of Power",
        author: "Robert Greene", 
        image: "https://images-na.ssl-images-amazon.com/images/I/41KY-NORo9L._SX355_BO1,204,203,200_.jpg",
        description: "In the book that People magazine proclaimed “beguiling” and “fascinating,” Robert Greene and Joost Elffers have distilled three thousand years of the history of power into 48 essential laws by drawing from the philosophies of Machiavelli, Sun Tzu, and Carl Von Clausewitz and also from the lives of figures ranging from Henry Kissinger to P.T. Barnum.",
    },
    {
        title: "Mastery",
        author: "Robert Greene", 
        image: "https://images-na.ssl-images-amazon.com/images/I/41WoD6VNvSL._SX349_BO1,204,203,200_.jpg",
        description: "Each one of us has within us the potential to be a Master. Learn the secrets of the field you have chosen, submit to a rigorous apprenticeship, absorb the hidden knowledge possessed by those with years of experience, surge past competitors to surpass them in brilliance, and explode established patterns from within. Study the behaviors of Albert Einstein, Charles Darwin, Leonardo da Vinci and the nine contemporary Masters interviewed for this book."
    },
    {
        title: "Principles",
        author: "Ray Dalio",
        image: "https://images-na.ssl-images-amazon.com/images/I/41cEbWztZYL._SX331_BO1,204,203,200_.jpg",
        description: "Ray Dalio, one of the world’s most successful investors and entrepreneurs, shares the unconventional principles that he’s developed, refined, and used over the past forty years to create unique results in both life and business—and which any person or organization can adopt to help achieve their goals."
    }
]

function seedDB() {
    //Remove all books
    Book.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Revomed books!");
        //Remove reviews
        Review.remove({}, function(err) {
            if(err) {
                console.log(err); 
            }
            console.log("Removed reviews!");
            //Add a few books
            data.forEach(function(seed) {
                Book.create(seed, function(err, book) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added a book!");
                        //Create a review
                        Review.create(
                            {
                                text: "This book is absolutely fantastic!",
                                title: "First Review!",
                                creator: "Omar"
                            }, function(err, reviews) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    book.review.push(reviews);
                                    book.save();
                                    console.log("Created new review!");
                                }
                            }
                        )
                    }
                });
            });
        });
    });
}

module.exports = seedDB;