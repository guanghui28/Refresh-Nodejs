const UserModel = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
	const { cookies } = req;

	if (!cookies?.jwt) {
		return res.status(401).json({ message: "you need to login first" });
	}

	const refreshToken = cookies.jwt;
	res.clearCookie("jwt");

	const foundUser = await UserModel.findOne({ refreshToken });

	// Detected refresh token reuse!
	if (!foundUser) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) {
					return res.sendStatus(403);
				}
				const hackedUser = await UserModel.findOne({
					username: decoded.username,
				});
				hackedUser.refreshToken = [];
				await hackedUser.save();
			}
		);
		return res.sendStatus(403); //forbidden
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err) {
				foundUser.refreshToken = [...newRefreshTokenArray];
				await foundUser.save();
			}

			if (foundUser.username !== decoded.username) {
				return res.status(403).json({ message: "Refresh token is invalid!" });
			}

			// Refresh token still valid
			const roles = Object.values(foundUser.roles);
			const accessToken = jwt.sign(
				{
					userInfo: {
						username: foundUser.username,
						roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "5m",
				}
			);

			const newRefreshToken = jwt.sign(
				{
					username: foundUser.username,
				},
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: "1d",
				}
			);

			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			res.cookie("jwt", newRefreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.status(201).json({ accessToken });
		}
	);
};

module.exports = { handleRefreshToken };
