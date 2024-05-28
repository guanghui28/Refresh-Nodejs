const fs = require("fs");
const path = require("path");

// async function
// platform-independent
fs.readFile(path.join(__dirname, "files", "huy.txt"), "utf-8", (err, data) => {
	if (err) {
		throw new Error(`my message: Co loi; global message: ${err.message}`);
	} else {
		console.log(data);
		fs.writeFile(path.join(__dirname, "files", "copy.txt"), data, (err) => {
			if (err) throw err;
		});
	}
});

console.log("Hello");

fs.writeFile(
	path.join(__dirname, "files", "write.txt"),
	"I'm writing a file 2 👍",
	(err) => {
		if (err) throw err;
		console.log("write file");
	}
);

fs.appendFile(
	path.join(__dirname, "files", "write2.txt"),
	"\nappend more",
	(err) => {
		if (err) throw err;
		console.log("append file");
	}
);

process.on("uncaughtException", (err) => {
	console.log(err);
	process.exit(1);
});
process.on("exit", (code) => {
	if (code !== 0) {
		console.log("Exit with error");
	} else {
		console.log("Exit with success work");
	}
});

// process.stdout.write("Memory use: ");
// console.log(`id process: ${process.pid}`);
// console.log(process.memoryUsage());
