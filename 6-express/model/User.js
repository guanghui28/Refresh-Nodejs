const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		roles: {
			USER: {
				type: Number,
				default: 3333,
			},
			EDITOR: Number,
			ADMIN: Number,
		},
		refreshToken: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
