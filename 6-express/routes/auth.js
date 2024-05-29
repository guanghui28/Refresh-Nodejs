const express = require("express");
const router = express.Router();
const {
	handleSignUp,
	handleSignIn,
	handleSignOut,
} = require("../controllers/authController");

router.post("/signup", handleSignUp);
router.post("/signin", handleSignIn);
router.post("/signout", handleSignOut);

module.exports = router;
