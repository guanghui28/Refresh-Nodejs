const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const date = new Date();
console.log(format(date, "GGGG  dd/MM/yyyy HH:mm:ss a"));
console.log(uuid());
