const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const JWT_KEY = require("../config/index.js");
const { setSession, getUserFromSession} = require("../utilities/users");
const { findBookBy } = require("../utilities/books");
const { constants } = require("../utilities/constants");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let count = 0
  for (let user of users){
    if (user.username === username) count++
  }
  return count <= 0
}

const authenticatedUser = (username, password) => {
  let count = 0
  for (let user of users){
    if (user.username === username)
      if (user.password === password) count ++
  }
  return count > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body
  const validation = user.username && user.password
  if (!validation)
    return res
        .status(400)
        .json({ message: 'Bad request params', data: null})

  const authenticated = authenticatedUser(user.username, user.password)

  if (authenticated) {
    setSession(user, req)
    return res
        .status(200)
        .json({ message: 'Successfully logged in', data: user.username})
  }
  else
    return res
        .status(400)
        .json({ message: "You're not registered", data: null })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.body.review

  const foundBook = findBookBy(constants.ISBN, isbn)

  const validation = isbn && review && foundBook
  if (!validation){
    return res
        .status(400)
        .json({ message: 'Bad request params', data: null})
  }

  const username = getUserFromSession(req)

  for (let i in books)
    if (books[i].isbn === isbn){
      books[i].reviews[username] = { review }
    }

  return res
      .status(200)
      .json({ message: 'Review added', data: {username, review}})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn

  const foundBook = findBookBy(constants.ISBN, isbn)
  if (!foundBook)
    return res
        .status(403)
        .json({ message: 'Bad request params', data: null })

  const username = getUserFromSession(req)
  for (let i in books){
    if (books[i].isbn === isbn){
      if (books[i].reviews[username])
        delete books[i].reviews[username]
      else
        return res
            .status(403)
            .json({ message: 'You have no reviews for this book', data: null })
    }
  }

  res
      .status(200)
      .json({ message: `Review for book with ISBN: ${isbn} deleted successfully`, data: username})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;