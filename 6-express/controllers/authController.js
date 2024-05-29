const userDB = {
	users: require("../model/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const bcrypt = require("bcrypt");
const fsPromise = require("fs/promises");
const path = require("path");

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
		res.json({
			user: foundUser,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
		throw err;
	}
};

module.exports = {
	handleSignUp,
	handleSignIn,
};
