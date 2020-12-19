const express = require("express");
let app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json()); // Middleware needed to populate req.body with json body from request

// authorize cors requests
const cors = require("cors");

const corsOptions = {
    origin: true,
    credentials: true
};

app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");

app.use(cookieParser());



var mainRouter = require("./routes");

app.use('/', mainRouter);

module.exports = app;
