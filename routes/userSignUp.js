const express = require('express');
const router = express.Router();
const signupController = require("../controller/userSignup.js");

router.get("/", signupController.signupForm);

router.post("/", signupController.signupdataSave);

module.exports = router;