const uuid = require("uuid");
const bcrypt = require("bcrypt");

module.exports.init = (app) => {
    app.post("/useBackupCode", async (req, res) => {
        console.log(req.body.username);
        if (!users[req.body.username.toLowerCase()])
            return res.status(400).send("Cannot find the specified user.");
        if (!users[req.body.username.toLowerCase()].backupCodes.includes(req.body.code))
            return res.status(400).send("The backup code is invalid");

        users[req.body.username.toLowerCase()].backupCodes.splice(users[req.body.username.toLowerCase()].backupCodes.indexOf(req.body.code), 1);
        users[req.body.username.toLowerCase()].backupPhase = true;
        users[req.body.username.toLowerCase()].password = null;

        let id = uuid.v4();
        const salt = await bcrypt.genSalt(10);

        sessions[id] = {
            account: req.body.username,
            ip: await bcrypt.hash(req.headers["x-forwarded-for"] || req.connection.remoteAddress, salt)
        }

        return res.status(200).send(id);
    });
}

module.exports.settings = {
    name: "POST /useBackupCode",
    body: ["username", "code"]
}
