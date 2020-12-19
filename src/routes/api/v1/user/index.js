const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../../middlewares/auth");

const newUser = require("./new");
const login = require("./login");
const logout = require("./logout");
const forgottenPassword = require('./forgottenPassword');
const refreshToken = require("./refreshToken");

router.post('/new', newUser);

router.post('/login', login);

router.get('/logout', logout);

router.post('/forgot/password', forgottenPassword);

router.get('/refresh_token', refreshToken);

module.exports = router;
