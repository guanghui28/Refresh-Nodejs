const path = require("path");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile("./views/index.html", { root: __dirname }, (err) => {
		if (err) {
			throw err;
		}
	});
});
app.get("/new-page(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "new-page.html"), (err) => {
		if (err) {
			throw err;
		}
	});
});
app.get("/old-page(.html)?", (req, res) => {
	res.status(301).redirect("/new-page.html");
});

app.get(
	"/hello(.html)?",
	(req, res, next) => {
		console.log("attempt to hello page");
		next();
	},
	(req, res) => {
		res.send("Hello page is fixing!");
	}
);

const one = (req, res, next) => {
	console.log("one");
	next();
};

const two = (req, res, next) => {
	console.log("two");
	next();
};

const three = (req, res) => {
	console.log("three");
	res.send("Finished");
};

app.get("/count(.html)?", [one, two, three]);

app.get("*", (req, res) => {
	res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});
