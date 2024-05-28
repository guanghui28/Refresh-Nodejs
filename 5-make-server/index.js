const { EventEmitter } = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs/promises");
const logEvents = require("./logEvents");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const PORT = process.env.PORT || 3000;

const serveFile = async (filePath, contentType, response) => {
	try {
		const data = await fsPromise.readFile(
			filePath,
			!contentType.includes("image") ? "utf-8" : ""
		);
		const isJSON = contentType === "application/json";
		const value = isJSON ? JSON.parse(data) : data;
		response.writeHead(filePath.includes("404.html") ? 404 : 200, {
			"Content-Type": contentType,
		});
		response.end(isJSON ? JSON.stringify(value) : value);
	} catch (err) {
		myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
		response.statusCode = 500;
		response.end();
	}
};

const server = http.createServer((req, res) => {
	myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
	let filePath;
	let contentType;
	const extension = path.extname(req.url);

	switch (extension) {
		case ".txt":
			contentType = "text/plain";
			break;
		case ".js":
			contentType = "text/javascript";
			break;
		case ".css":
			contentType = "text/css";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".jpg":
			contentType = "image/jpeg";
			break;
		default:
			contentType = "text/html";
	}

	filePath =
		contentType === "text/html" &&
		(req.url === "/" || req.url.slice(-1) === "/")
			? path.join(__dirname, "views", "index.html")
			: contentType === "text/html"
			? path.join(__dirname, "views", req.url)
			: path.join(__dirname, req.url);

	// make .html extension in browser not required
	if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

	const isFileExisted = fs.existsSync(filePath);
	if (isFileExisted) {
		serveFile(filePath, contentType, res);
	} else {
		switch (path.parse(filePath).base) {
			case "old-page.html":
				res.writeHead(301, { location: "/new-page.html" });
				res.end();
				break;
			case "www-page.html":
				res.writeHead(301, { location: "/" });
				res.end();
				break;
			default:
				filePath = path.join(__dirname, "views", "404.html");
				serveFile(filePath, "text/html", res);
		}
	}
});

server.listen(PORT, () => {
	console.log("Server is running");
});

myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));
