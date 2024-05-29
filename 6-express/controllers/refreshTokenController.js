const userDB = {
	users: require("../model/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
	const { cookies } = req;

	if (!cookies?.jwt) {
		return res.status(401).json({ message: "you need to login first" });
	}

	const refreshToken = cookies.jwt;
	const foundUser = userDB.users.find(
		(user) => user.refreshToken === refreshToken
	);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser?.username !== decoded?.username) {
			return res.status(403).json({ message: "Refresh token is invalid!" });
		}

		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: "30s",
			}
		);

		res.status(201).json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
