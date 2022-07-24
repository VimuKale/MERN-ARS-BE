const express = require("express");
const router = new express.Router();
const { validateLoginDetails } = require("../middleware/commonMiddleware");
const { handleUserLogin } = require("../controller/loginController");

router.post("/login", validateLoginDetails, handleUserLogin);

module.exports = router;
