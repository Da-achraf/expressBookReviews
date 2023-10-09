const books = require("../router/booksdb.js");

const findBookBy = (parameter, value) => {
    let foundBook = null
    for (let i in books)
        if (books[i][parameter] === value) foundBook = books[i]
    return foundBook
}

module.exports = {
    findBookBy
}