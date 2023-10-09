const books = require("../router/booksdb.js");
const axios = require("axios");
const {constants} = require("./constants");

/*
* Find a book in the booksdb.js file according to
* the given parameter (isbn, author or title)
* using the given value for the parameter
* */
const findBookBy = (parameter, value) => {
    let foundBook = null
    for (let i in books)
        if (books[i][parameter] === value) foundBook = books[i]
    return foundBook
}

/*
* The same concept as the last function but this time the source
* of the books is the json file books.json in the router folder.
* Because axios uses http for communication, I pushed this json
* file to my final project repo, and then I used its url BOOKS_URL
* available in (../utilities/constants.js) to retrieve the books
* asynchronously using axios and async await implemented in 
* the retrieveBooks function bellow.
* */
const findBookByForAsync = async (parameter, value) => {
    const _books = await retrieveBooks()
    let foundBook = null
    for (let i in _books)
        if (books[i][parameter] === value) foundBook = _books[i]
    return foundBook
}

const retrieveBooks = async () => {
    const axiosResponse = await axios.get(constants.BOOKS_URL)
    return axiosResponse.data
}

module.exports = {
    findBookBy,
    findBookByForAsync
}
