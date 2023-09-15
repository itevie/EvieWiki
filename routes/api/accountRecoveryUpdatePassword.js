const uuid = require("uuid");
const bcrypt = require("bcrypt");
const {
	passwordStrength
} = require('check-password-strength')

module.exports.init = (app) => {
    app.post("/accountRecoveryUpdatePassword", async (req, res) => {
		if (req.body.password.length < 8)
			return res.status(400).send("Password is too short (>=8)");

		if (passwordStrength(req.body.password).value.toLowerCase().includes("weak"))
			return res.status(400).send("Passowrd is too weak");

		if (req.body.password.length > 100)
			return res.status(400).send("Password is too large (<=100)");

		if (req.body.confirm != req.body.password)
			return res.status(400).send("Confirm field does not equal password");

		const salt = await bcrypt.genSalt(10);

		req.body.password = await bcrypt.hash(req.body.password, salt);

        users[sessions[req.cookies.session].account.toLowerCase()].password = req.body.password;

        return res.status(200).send("Updated password");
    });
}

module.exports.settings = {
    name: "POST /accountRecoveryUpdatePassword",
    body: ["password", "confirm"]
}
