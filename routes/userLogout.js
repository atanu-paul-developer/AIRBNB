const express = require('express');
const router = express.Router();
const logouotController = require("../controller/logout");

router.get("/", logouotController.logout);

module.exports = router;