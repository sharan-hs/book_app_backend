const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const Books = require("./models/books.models");
app.use(cors());
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/books", async (req, res) => {
  try {
    const allbooks = await Books.find();
    res.json(allbooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  const { bookName, author, genre } = req.body;

  try {
    const bookData = new Books({ bookName, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function editBook(bookId, dataToBeUpdated) {
  try {
    const editedBook = await Books.findByIdAndUpdate(bookId, dataToBeUpdated, {
      new: true,
    });
    return editedBook;
  } catch (error) {
    throw error;
  }
}

app.put("/book/edit/:bookId", async (req, res) => {
  try {
    const bookEdited = await editBook(req.params.bookId, req.body);
    if (bookEdited) {
      res
        .status(201)
        .json({ message: "Book Edited Successfully", book: bookEdited });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
