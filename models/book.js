//SCHEMA
var mongoose = require('mongoose');
var bookSchema = new mongoose.Schema ({
    title: String,
    author: String,
    image: String,
    description: String,
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

//MODEL
module.exports = mongoose.model("Book", bookSchema);