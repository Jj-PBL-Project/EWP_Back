const express = require("express");
const router = express.Router();
// const { login } = require("../controllers/loginController");
const { signup } = require("../controllers/signupController");

router.post("/signup", signup);
// router.post("/login", login);

module.exports = router;
