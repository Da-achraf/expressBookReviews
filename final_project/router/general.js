const express = require("express");
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const { findBookBy }  = require('../utilities/books.js')
const { constants } = require('../utilities/constants.js')
const {findBookByForAsync} = require("../utilities/books");

// Task 6
// Registering a new user
public_users.post("/register", (req, res) => {
	const user = req.body
	let validation = user.username && user.password

	if (!validation)
		return res
			.status(400)
			.json({ message: 'Bad request params', data: null})

	if (isValid(user.username)) {
		users.push(user)
		return res
			.status(200)
			.json({ message: 'Successfully registered', data: user.username})
	}
	else
		return res
			.status(400)
			.json({message: 'Username already taken', data: null})
})


// Task 1
// Get the book list available in the shop synchronously
public_users.get("/", function (req, res) {
    if (books)
        res.status(200).json({ message: "Books retrieved", data: books});
    else
		res.status(400).json({ message: "No books found", data: null });
});

// Task 10
// Get the book list available in the shop asynchronously using axios and async-await
public_users.get("/", async function (req, res) {
	const axiosResponse = await axios.get(constants.BOOKS_URL)
	const data = axiosResponse.data
	if (data)
		res
			.status(200)
			.json({message: "Books retrieved", data });
	else
		res
			.status(200)
			.json({message: "Books retrieved", data });

});


// Task 2
// Get book details based on ISBN synchronously
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn
	let foundBook = findBookBy(constants.ISBN, isbn)
	if (foundBook)
    	res
            .status(200)
            .json({ message: "Book found", data: foundBook})
	else
		res
			.status(400)
			.json({ message: "Bad request params", data: null });
});

// Task 11
// Get a book based on its ISBN asynchronously using axios and async-await
public_users.get("/isbn/:isbn", async function (req, res) {
	const isbn = req.params.isbn

	const foundBook = await findBookByForAsync(constants.ISBN, isbn)

	if (foundBook)
		res
			.status(200)
			.json({ message: 'Book found', data: foundBook})
	else
		res
			.status(404)
			.json({ message: 'Bad request params', data: null})
});


// Task 3
// Get book details based on author synchronously
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author
	const foundBook = findBookBy(constants.AUTHOR, author)
	if (foundBook)
		res
			.status(200)
			.json({ message: 'Book found', data: foundBook })
	else
		res
			.status(400)
			.json({ message: "Bad request params", data: null })
});

// Task 12
// Get a book based on its author asynchronously using axios and async-await
public_users.get("/author/:author", async function (req, res) {
	const author = req.params.author
	const foundBook = await findBookByForAsync(constants.AUTHOR, author)

	if (foundBook)
		res
			.status(200)
			.json({ message: 'Book found', data: foundBook})
	else
		res
			.status(404)
			.json({ message: 'Bad request params', data: null})
});


// Task 4
// Get a book based on its title synchronously
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title
	const foundBook = findBookBy(constants.TITLE, title)
	if (foundBook)
		res
			.status(200)
			.json({ message: 'Book found', data: foundBook })
	else
		res
			.status(400)
			.json({ message: "Bad request params", data: null })
});

// Task 13
// Get a book based on its title asynchronously using axios and async-await
public_users.get("/title/:title", async function (req, res) {
	const title = req.params.title
	const foundBook = await findBookByForAsync(constants.TITLE, title)
	if (foundBook)
		res
			.status(200)
			.json({ message: 'Book found', data: foundBook})
	else
		res
			.status(404)
			.json({ message: 'Bad request params', data: null})
});


// Task 5
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn
	const foundBook = findBookBy(constants.ISBN, isbn)
	const reviews = foundBook?.reviews

	if (reviews)
		res
			.status(200)
			.json({ message: 'Reviews found', data: reviews })
	else
		res
			.status(400)
			.json({ message: "Bad request params", data: null })
});

module.exports.general = public_users;