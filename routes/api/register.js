const uuid = require("uuid");
const bcrypt = require("bcrypt");
const {
	passwordStrength
} = require('check-password-strength')

module.exports.init = (app) => {
	app.post("/register", async (req, res) => {
		if (req.body.username.length < 3)
			return res.status(400).send("Username is too short (>=3)");

		if (/['"<>&;\[\]\(\)\{\}\\%\^\$\£\!\.\?]{1,15}/.test(req.body.username) == true)
			return res.status(400).send("Username does not match regex, must only contain alphanumeric characters + accented, 3 - 15 of length");

		if (req.body.password.length < 8)
			return res.status(400).send("Password is too short (>=8)");

		if (passwordStrength(req.body.password).value.toLowerCase().includes("weak"))
			return res.status(400).send("Passowrd is too weak");

		if (req.body.password.length > 100)
			return res.status(400).send("Password is too large (<=100)");

		if (req.body.confirm != req.body.password)
			return res.status(400).send("Confirm field does not equal password");

		if (users.hasOwnProperty(req.body.username.toLowerCase()) == true)
			return res.status(401).send("Username already exists");

		const salt = await bcrypt.genSalt(10);

		req.body.password = await bcrypt.hash(req.body.password, salt);

		users[req.body.username.toLowerCase()] = {
			username: req.body.username,
			password: req.body.password,
			createdAt: Date.now(),
			isMaker: false,
			twofa: "",
			notifications: {}
		}

		users[req.body.username.toLowerCase()].notifications[uuid.v4()] = {
			type: "welcome",
			time: Date.now()
		}

		return res.status(200).send("Account created");
	});
}

module.exports.settings = {
	name: "POST /register",
	body: ["username", "password", "confirm"]
}
