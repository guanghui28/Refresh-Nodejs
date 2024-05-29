const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		return res.status(401).json({ message: "You're unauthorized!" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "Access token is invalid" }); // forbidden
		}

		req.username = decoded.username;
		next();
	});
};

module.exports = { verifyJWT };
