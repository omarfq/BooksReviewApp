var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    text: String,
    creator: String
});

module.exports = mongoose.model("Review", reviewSchema);