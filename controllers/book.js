const Book = require("../models/Book.js");
const parseVErr = require("../utils/parseValidationErrs.js");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });
    res.render("books", { books });
  } catch (err) {
    req.flash("error", "Error fetching books.");
    res.redirect("/books");
  }
};

const addNewBook = (req, res) => {
  res.render("book", {
    title: "Add Book",
    action: "/books",
    submitButtonLabel: "Add",
    book: null,
  });
};

const createNewBook = async (req, res) => {
  try {
    const { BookName, BookAuthor, BookType } = req.body;
    const newBook = await Book.create({
      BookName,
      BookAuthor,      
      BookType,
      // createdBy: req.user._id,
    });
    res.redirect("/books"); // Redirect to the books list page or any other page
  } catch (err) {
    console.error("Error creating new book:", err);
    req.flash("error", "Error creating new book.");
    res.redirect("/books"); // Redirect to an error page or any other page
  }
};

const getBookEntry = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    res.render("book", {
      title: "Edit Book",
      action: `/books/${book.id}`,
      submitButtonLabel: "Update",
      book: book,
    });
  } catch (err) {
    req.flash("error", "Error fetching book.");
    res.redirect("/books");
  }
};

const updateBookEntry = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    if (!book) {
      req.flash("error", "Book not found.");
      return res.redirect("/books");
    }
    Object.assign(book, req.body);
    await book.save();
    res.redirect(`/books`);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error updating book.");
    }
    res.render("book", { book: req.body, errors: req.flash("error") });
  }
};

const deleteBook = async (req, res) => {
  try {
    await Book.findOneAndDelete({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    res.redirect("/books");
  } catch (err) {
    req.flash("error", "Error deleting book.");
    res.redirect("/books");
  }
};

module.exports = {
  getBooks,
  addNewBook,
  createNewBook,
  getBookEntry,
  updateBookEntry,
  deleteBook,
};

// const Book = require("../models/Book.js");
// const parseVErr = require("../utils/parseValidationErrs.js");

// const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ createdBy: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.render("books", { books });
//   } catch (err) {
//     req.flash("error", "Error fetching books.");
//     res.redirect("/books");
//   }
// };

// const addNewBook = (req, res) => {
//   res.render("book", {
//     title: "Add Book",
//     action: "/books",
//     submitButtonLabel: "Add",
//     book: null,
//   });
// };

// const createNewBook = async (req, res) => {
//   try {
//     const { BookName, BookAuthor, BookType } = req.body;
//     const newBook = await Book.create({
//       BookName,
//       BookAuthor,      
//       BookType,
//       createdBy: req.user._id,
//     });
//     res.redirect("/books"); // Redirect to the books list page or any other page
//   } catch (err) {
//     console.error("Error creating new book:", err);
//     req.flash("error", "Error creating new book.");
//     res.redirect("/books"); // Redirect to an error page or any other page
//   }
// };

// const getBookEntry = async (req, res) => {
//   try {
//     const book = await Book.findOne({
//       _id: req.params.id,
//       createdBy: req.user._id,
//     });
//     res.render("book", {
//       title: "Edit Book",
//       action: `/books/${book.id}`,
//       submitButtonLabel: "Update",
//       book: book,
//     });
//   } catch (err) {
//     req.flash("error", "Error fetching book.");
//     res.redirect("/books");
//   }
// };

// const updateBookEntry = async (req, res) => {
//   try {
//     const book = await Book.findOne({
//       _id: req.params.id,
//       createdBy: req.user._id,
//     });
//     if (!book) {
//       req.flash("error", "Book not found.");
//       return res.redirect("/books");
//     }
//     Object.assign(book, req.body);
//     await book.save();
//     res.redirect(`/books`);
//   } catch (err) {
//     if (err.constructor.name === "ValidationError") {
//       parseVErr(err, req);
//     } else {
//       req.flash("error", "Error updating book.");
//     }
//     res.render("book", { book: req.body, errors: req.flash("error") });
//   }
// };

// const deleteBook = async (req, res) => {
//   try {
//     await Book.findOneAndDelete({
//       _id: req.params.id,
//       createdBy: req.user._id,
//     });
//     res.redirect("/books");
//   } catch (err) {
//     req.flash("error", "Error deleting book.");
//     res.redirect("/books");
//   }
// };

// module.exports = {
//   getBooks,
//   addNewBook,
//   createNewBook,
//   getBookEntry,
//   updateBookEntry,
//   deleteBook,
// };
