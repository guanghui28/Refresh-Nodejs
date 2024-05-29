const express = require("express");
const path = require("path");
const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "index.html"), (err) => {
		if (err) {
			throw err;
		}
	});
});

router.get("/new-page(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "new-page.html"), (err) => {
		if (err) {
			throw err;
		}
	});
});

router.get("/old-page(.html)?", (req, res) => {
	res.status(301).redirect("/new-page.html");
});

module.exports = router;
