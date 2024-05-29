const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/User");
const ROLES = require("../configs/rolesList");

const handleSignUp = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password must be filled",
			});
		}

		const existedUser = await UserModel.findOne({ username });

		if (existedUser) {
			return res.status(409).json({
				message: "username was existed!",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await UserModel.create({
			username,
			password: hashedPassword,
			roles: {
				USER: ROLES.USER,
			},
		});

		console.log(newUser);

		return res.status(201).json({
			message: `Create ${username} success`,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
		throw err;
	}
};

const handleSignIn = async (req, res) => {
	try {
		const cookies = req.cookies;
		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password must be filled!" });
		}

		const foundUser = await UserModel.findOne({ username });
		if (!foundUser) {
			return res.status(401).json({
				message: "username or password wrong!",
			});
		}

		const match = await bcrypt.compare(password, foundUser.password);
		if (!match) {
			return res.status(401).json({
				message: "username or password wrong!",
			});
		}

		// todo: create JWT
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

		const newRefreshTokenArray = !cookies?.jwt
			? foundUser.refreshToken
			: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

		if (cookies?.jwt) {
			res.clearCookie("jwt");
		}

		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		res.cookie("jwt", newRefreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({
			accessToken,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
		throw err;
	}
};

const handleSignOut = async (req, res) => {
	const { cookies } = req;
	if (!cookies?.jwt) {
		return res.sendStatus(204); // No content
	}

	const refreshToken = cookies.jwt;
	const foundUser = await UserModel.findOne({ refreshToken });
	if (!foundUser) {
		res.clearCookie("jwt");
		return res.sendStatus(204);
	}

	// delete refresh token in the db
	foundUser.refreshToken = founderUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	);
	await foundUser.save();

	res.clearCookie("jwt");
	res.sendStatus(204);
};

module.exports = {
	handleSignUp,
	handleSignIn,
	handleSignOut,
};
