const twofactor = require("node-2fa");

module.exports.init = (app) => {
    app.post("/2fa", (req, res) => {
        if (users[req.username].twofa != undefined && users[req.username].twofa != "")
            return res.status(400).send("2fa is already enabled");

        let token = twofactor.generateSecret({ name: "EvieWiki", account: users[req.username].username });

        users[req.username].temp2fa = token.secret;

        return res.status(200).send(token);
    });
}

module.exports.settings = {
    name: "POST /2fa",
    auth: {
        loggedIn: true
    }
}
