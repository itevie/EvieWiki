const uuid = require("uuid");
const bcrypt = require("bcrypt");

module.exports.init = (app) => {
    app.post("/login", async (req, res) => {
        if (users.hasOwnProperty(req.body.username.toLowerCase()) == false)
            return res.status(401).send("Username does not exist");

        if (await bcrypt.compare(req.body.password, users[req.body.username.toLowerCase()].password) == false)
            return res.status(401).send("Invalid password");

        let id = uuid.v4();

        const salt = await bcrypt.genSalt(10);

        sessions[id] = {
            account: req.body.username,
            ip: await bcrypt.hash(req.headers["x-forwarded-for"] || req.connection.remoteAddress, salt)
        }

        users[req.body.username.toLowerCase()].notifications[uuid.v4()] = {
            type: "newLogin",
            ua: req.get('User-Agent') || "The user agent couldn't be found",
            time: Date.now()
        }

        return res.status(200).send(id);
    });
}

module.exports.settings = {
    name: "POST /login",
    auth: {
        twofaUserFromBody: true
    },
    body: ["username", "password"]
}
