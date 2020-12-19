const express = require("express");
const path = require("path");
var router = express.Router();

var apiRouter = require("./api");

router.use('/api', apiRouter);

router.use(express.static(path.join(__dirname+'../../../client/build')));

router.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../../../client/build/index.html'));
});

module.exports = router;
