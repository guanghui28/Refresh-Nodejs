const userDB = {
	users: require("../model/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const bcrypt = require("bcrypt");
const fsPromise = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");
const ROLES = require("../configs/rolesList");

const handleSignUp = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password must be filled",
			});
		}

		const existedUser = userDB.users.find((user) => user.username === username);
		if (existedUser) {
			return res.status(409).json({
				message: "username was existed!",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = {
			username,
			password: hashedPassword,
			roles: {
				USER: ROLES.USER,
			},
		};

		userDB.setUsers([...userDB.users, newUser]);
		await fsPromise.writeFile(
			path.join(__dirname, "..", "model", "users.json"),
			JSON.stringify(userDB.users)
		);

		return res.status(201).json({
			users: userDB.users,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
		throw err;
	}
};

const handleSignIn = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password must be filled!" });
		}

		const foundUser = userDB.users.find((user) => user.username === username);
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
		const refreshToken = jwt.sign(
			{
				username: foundUser.username,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: "1d",
			}
		);

		const otherUsers = userDB.users.filter(
			(user) => user.username !== foundUser.username
		);
		const currentUser = { ...foundUser, refreshToken };
		userDB.setUsers([...otherUsers, currentUser]);

		await fsPromise.writeFile(
			path.join(__dirname, "..", "model", "users.json"),
			JSON.stringify(userDB.users)
		);

		res.cookie("jwt", refreshToken, {
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
	const foundUser = userDB.users.find(
		(user) => user.refreshToken === refreshToken
	);
	if (!foundUser) {
		res.clearCookie("jwt");
		return res.sendStatus(204);
	}

	// delete refresh token in the db
	userDB.setUsers([
		...userDB.users.map((user) => {
			if (user.username === foundUser.username) {
				return {
					...user,
					refreshToken: "",
				};
			}
			return user;
		}),
	]);

	await fsPromise.writeFile(
		path.join(__dirname, "..", "model", "users.json"),
		JSON.stringify(userDB.users)
	);
	res.clearCookie("jwt");
	res.sendStatus(204);
};

module.exports = {
	handleSignUp,
	handleSignIn,
	handleSignOut,
};
