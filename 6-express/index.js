const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const { corsOptions } = require("./configs/corsOptions");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

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
