module.exports.init = (app) => {
    app.post("/verify2fa", (req, res) => {
        let r = verify2fa(req, req.body.code, true);
        if (r == true) {
            users[req.username].twofa = users[req.username].temp2fa;
            delete users[req.username].temp2fa;
            return res.status(200).send("Token is valid");
        } else {
            return res.status(400).send("Token is invalid");
        }
    });
}

module.exports.settings = {
    name: "POST /verify2fa",
    auth: {
        loggedIn: true
    },
    body: ["code"]
}
