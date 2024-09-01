const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  genre: String,
});

const BooksCollection = mongoose.model("BooksCollection", bookSchema);

module.exports = BooksCollection;
