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

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

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
