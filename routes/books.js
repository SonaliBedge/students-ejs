const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getBooks,
  addNewBook,
  createNewBook,
  getBookEntry,
  updateBookEntry,
  deleteBook,
} = require("../controllers/book");

// Get all books
router.get("/", getBooks);

router.get("/new", addNewBook);

router.post("/", createNewBook);

router.get("/edit/:id", getBookEntry);

router.post("/:id", updateBookEntry);

router.post("/delete/:id", deleteBook); // Use :id in the route to capture the book ID

module.exports = router;
