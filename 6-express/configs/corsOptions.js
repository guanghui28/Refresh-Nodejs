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

module.exports = { corsOptions };
