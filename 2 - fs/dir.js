const fs = require("fs");
const path = require("path");

const dirName = path.join(__dirname, "news");

if (!fs.existsSync(dirName)) {
	console.log(dirName);
	fs.mkdir(dirName, (err) => {
		if (err) throw err;
		console.log("Created new dir");
	});
} else {
	console.log("folder existed! -> deleted it");
	fs.rmdir(dirName, (err) => {
		if (err) throw err;
		console.log("Deleted success");
	});
}

process.on("uncaughtException", (err) => {
	console.log("error: ", err.message);
	process.exit(1);
});
