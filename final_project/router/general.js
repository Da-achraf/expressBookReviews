const express = require("express");
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const { findBookBy }  = require('../utilities/books.js')
const { constants } = require('../utilities/constants.js')

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

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//     if (books)
//         res.status(200).json({ message: "Books retrieved", data: books});
//     else
// 		res.status(400).json({ message: "No books found", data: null });
// });

// Get the book list available in the shop using axios
public_users.get("/", async function (req, res) {

	const url = './booksdb.json';
	const axiosResponse = await axios.get(url)
	const jsonData = axiosResponse.data

	res.status(200).json({message: "Books retrieved", jsonData });

});

// Get book details based on ISBN
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

// Get book details based on author
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

// Get all books based on title
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