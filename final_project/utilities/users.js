const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config");


const setSession = (user, req) => {
    const token = jwt.sign(user, JWT_KEY, {expiresIn: 3600})
    req.session.authorization = {
        accessToken: token
    }
}

const getUserFromSession = (req) => {
    let username
    const token = req.session.authorization.accessToken
    jwt.verify(token, JWT_KEY, (err, data) => {
        username = data.username
    })

    return username
}

module.exports = {
    setSession,
    getUserFromSession
}