const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    authors: { 
        type: [String], 
        required: true 
    },
    description: { 
        type: String
    },
    imageLinks: { 
        type: String,
        required: true
    },
    downloadLink: { 
        type: String, 
        required: true 
    },
    userId: {
        type: String,
        required: true
    }

});


bookSchema.statics.findAll = function(userId, callback) {
    Book
        .find({userId: userId})
        .then(dbBooks => callback(null, dbBooks))
        .catch(err => callback(err));
},
bookSchema.statics.createbook = function(book, callback) {
    Book
        .create(book)
        .then(dbBook => callback(null,dbBook))
        .catch(err => callback(err));
},

bookSchema.statics.removebook = function(id, callback) {
    console.log(id)
    Book
        .findByIdAndDelete(id)
        .then(dbBook => callback(null, dbBook))
        .catch(err => callback(err));
}

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;