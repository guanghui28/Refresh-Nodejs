const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
// const readStream = fs.createReadStream(
// 	path.join(__dirname, "files", "long.txt"),
// 	{ encoding: "utf-8" }
// );

// const writeStream = fs.createWriteStream(
// 	path.join(__dirname, "files", "newLorum.txt")
// );

// readStream.on("data", (dataChunk) => {
// 	writeStream.write(dataChunk, (err) => {
// 		if (err) throw err;
// 	});
// });

// console.log("hello wolrd");

// readStream.on("end", () => {
// 	console.log("End");
// });

// readStream.pipe(writeStream);

(async function a() {
	const rs = fs.createReadStream(path.join(__dirname, "files", "long.txt"), {
		encoding: "utf-8",
	});
	const ws = fs.createWriteStream(
		path.join(__dirname, "files", "newLorum.txt")
	);

	try {
		for await (const chunk of rs) {
			console.log(`new chunk received: ${chunk}`);
			ws.write(chunk);
		}
	} catch (err) {
		throw err;
	}
})();
