const { format } = require("date-fns");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { v4: uuid } = require("uuid");
const path = require("path");

const logEvents = async (message, fileName) => {
	const dateTime = format(new Date(), "dd/MM/yyyy\thh:mm:ssa");
	const log = `${dateTime}\t${uuid()}\t${message}\n`;
	console.log(log);
	try {
		if (!fs.existsSync(path.join(__dirname, "logs"))) {
			await fsPromise.mkdir(path.join(__dirname, "logs"));
		}
		await fsPromise.appendFile(path.join(__dirname, "logs", fileName), log);
	} catch (err) {
		console.log("Error: ", err);
	}
};

module.exports = logEvents;
