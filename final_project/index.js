const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const JWT_KEY = require('./config/index.js')

const app = express();
app.use(express.json());

app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

// Setting the authorization middleware for the routes /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, JWT_KEY, (err, data) => {
            if (!err) next();
            else
                return res.status(401).json({
                    message: "You're not authorized to be here",
                    data: null,
                });
        });
    } else {
        res.status(401).json({
            message: "Please login",
            data: null,
        });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
