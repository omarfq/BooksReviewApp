//SCHEMA
var mongoose = require('mongoose');
var bookSchema = new mongoose.Schema ({
    title: String,
    author: String,
    image: String,
    review: String
});

//MODEL
module.exports = mongoose.model("Book", bookSchema);