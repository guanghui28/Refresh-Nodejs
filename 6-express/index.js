const path = require("path");
const express = require("express");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger);
const whiteList = [
	"https://coccoc.com",
	"https://www.guanghui28.com",
	"http://localhost:5500",
];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not Allow by GuangHui"));
		}
	},
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({
			error: "404 Not found",
		});
	} else {
		res.type("txt").send("404 not found");
	}
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});
