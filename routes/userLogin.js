const express = require('express');
const passport = require('passport');
const router = express.Router();
// const saveredirectUrl = require('../public/middleware/middleware.js');
const loginController = require("../controller/userLogin");

router.get("/", loginController.loginForm);

router.post("/", passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), loginController.matchLogindetail);

module.exports = router;