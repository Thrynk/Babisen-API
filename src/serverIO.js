const mongoose = require("mongoose");
const socket = require("socket.io");
const app = require("./app");
// TODO: Do a proper logging for database connection with winston
mongoose.connect("mongodb+srv://"
    + process.env.DATABASE_USER
    + ":"
    + process.env.DATABASE_PASSWORD
    + "@"
    + process.env.DATABASE_DOMAIN,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
).then(function(){
    console.log("Connected to Database in " + process.env.MODE + " mode");
}).catch(function(error){
    console.log("Error" + error);
});

// TODO: Do proper logging with winston too
var serverIO = app.listen(process.env.PORT || 8080, function () {
    console.log("SERVER ON");
});

var io = socket(serverIO);

module.exports = io
