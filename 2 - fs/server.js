// const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

// async function
// platform-independent
// fs.readFile(path.join(__dirname, "files", "huy.txt"), "utf-8", (err, data) => {
// 	if (err) {
// 		throw new Error(`my message: Co loi; global message: ${err.message}`);
// 	} else {
// 		console.log(data);
// 		fs.writeFile(path.join(__dirname, "files", "copy.txt"), data, (err) => {
// 			if (err) throw err;

// 			fs.rename(
// 				path.join(__dirname, "files", "write.txt"),
// 				path.join(__dirname, "files", "reply.txt"),
// 				(err) => {
// 					if (err) throw err;
// 					console.log("Rename success");
// 				}
// 			);
// 		});
// 	}
// });

// console.log("Hello");

const readFile = async () => {
	try {
		const data = await fsPromise.readFile(
			path.join(__dirname, "files", "huy.txt"),
			"utf-8"
		);
		console.log(data);

		await fsPromise.unlink(path.join(__dirname, "files", "huy.txt"));
		console.log("Delete file origin");

		await fsPromise.writeFile(path.join(__dirname, "files", "doc.txt"), data);
		console.log("Write file success");

		await fsPromise.appendFile(
			path.join(__dirname, "files", "doc.txt"),
			"\n\nAdd more line text"
		);
		console.log("Append file success");

		await fsPromise.rename(
			path.join(__dirname, "files", "doc.txt"),
			path.join(__dirname, "files", "newDoc.txt")
		);
		console.log("rename file success");

		const newData = await fsPromise.readFile(
			path.join(__dirname, "files", "newDoc.txt"),
			"utf-8"
		);
		console.log(`New text: ${newData}`);
	} catch (err) {
		console.log("Error!!!!!!");
		throw err;
	}
};

readFile();

console.log("Hello world");

process.on("uncaughtException", (err) => {
	console.log(err);
	process.exit(1);
});
// process.on("exit", (code) => {
// 	if (code !== 0) {
// 		console.log("Exit with error");
// 	} else {
// 		console.log("Exit with success work");
// 	}
// });

// process.stdout.write("Memory use: ");
// console.log(`id process: ${process.pid}`);
// console.log(process.memoryUsage());
