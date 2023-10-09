const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const JWT_KEY = require("../config/index.js");
const { setSession, getUserFromSession} = require("../utilities/users");
const { findBookBy } = require("../utilities/books");
const { constants } = require("../utilities/constants");

const regd_users = express.Router();

let users = [];

/*
* This function is used during new user registration,
* it checks if the username entered by the user is
* already taken by another user or not
* */
const isValid = (username) => {
  let count = 0
  for (let user of users){
    if (user.username === username) count++
  }
  // If count stills 0 => username is valid
  return count === 0
}


/*
* Authenticating a user based on its username and password
* */
const authenticatedUser = (username, password) => {
  let count = 0
  for (let user of users){
    if (user.username === username && user.password === password)
      count ++
  }
  // If count was incremented => user is authenticated
  return count !== 0
}

// Task 7
// Only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body
  const validation = user.username && user.password
  if (!validation)
    return res
        .status(400)
        .json({ message: 'Bad request params', data: null})

  // Check if the username and password entered are valid
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


// Task 8
// Add/Update a book review
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

  /*
  * Looking for the book by its isbn, and adding a key inside
  * the reviews key. If the logged-in user pushing the review is
  * 'achraf' for example, the book object will look like this:
  * x : {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "isbn": "book001",
        "reviews": {
            "achraf": {
                "review": "Review body"
            }
        }
  * */
  for (let i in books)
    if (books[i].isbn === isbn){
      books[i].reviews[username] = { review }
    }

  return res
      .status(200)
      .json({ message: 'Review added', data: {username, review}})
});


// Task 9
// A user will be able to delete only its review for a given book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const foundBook = findBookBy(constants.ISBN, isbn)

  if (!foundBook)
    return res
        .status(403)
        .json({ message: 'Bad request params', data: null })

  const username = getUserFromSession(req)
  /*
  * Here we're searching for the desired book by its isbn,
  * and deleting the value corresponding to the key 'reviews'
  * that has a key of the username of the current logged-in user!
  * */
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