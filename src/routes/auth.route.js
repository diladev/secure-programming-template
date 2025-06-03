const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { verifyAppCheck } = require("../middlewares/appCheck.middleware");

// Apply App Check middleware only to register route
router.post("/register", verifyAppCheck, register);
router.post("/login", login);

module.exports = router;
