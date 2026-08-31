const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");

const public_users = express.Router();

const BASE_URL = "http://localhost:8800";

// Axios + Async/Await — Task 10
async function getAllBooks() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

// Axios + Async/Await — Task 11
async function getBookByISBN(isbn) {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
}

// Axios + Async/Await — Task 12
async function getBooksByAuthor(author) {
    const response = await axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    );
    return response.data;
}

// Axios + Async/Await — Task 13
async function getBooksByTitle(title) {
    const response = await axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    );
    return response.data;
}


// Task 1 - all books
public_users.get("/", function (req, res) {
    res.send(JSON.stringify(books, null, 2));
});


// Task 2 - ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


// Task 3 - author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    const result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    });

    res.json(result);
});


// Task 4 - title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    const result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    });
    res.json(result);
});


// Task 5 - reviews
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews) {
        if (Object.keys(books[isbn].reviews).length > 0) {
            res.json(books[isbn].reviews);
        } else {
            res.json({
                message: "No reviews found for this book."
            });
        }
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
