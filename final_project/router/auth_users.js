const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check whether username exists
const isValid = (username) => {
    return users.some((user) => user.username === username);
};

// Check username/password
const authenticatedUser = (username, password) => {
    return users.some(
        (user) => user.username === username && user.password === password
    );
};

// REGISTER
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// LOGIN
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const accessToken = jwt.sign(
        { username: username },
        "access",
        { expiresIn: "1h" }
    );

    req.session.authorization = {
        accessToken: accessToken,
        username: username
    };

    return res.status(200).json({
        message: "Login successful!",
        accessToken: accessToken
    });
});

// ADD / MODIFY REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added/modified",
        reviews: books[isbn].reviews
    });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (
        !books[isbn].reviews ||
        !books[isbn].reviews[username]
    ) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review successfully deleted",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
