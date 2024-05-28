const logEvents = require("./logEvents");
const { EventEmitter } = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("log", (message) => logEvents(message));

// let i = 0;
// setInterval(() => {
// 	i++;
// 	myEmitter.emit("log", `This is log ${i} from server`);
// }, 2000);
