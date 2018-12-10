var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    text: String,
    title: String,
    creator: String
});

module.exports = mongoose.model("Review", reviewSchema);