module.exports.init = (app) => {
    app.post("/disable2fa", (req, res) => {
        users[req.username].twofa = "";
        return res.status(200).send("Successfully disabled 2fa!");
    });
}

module.exports.settings = {
    name: "POST /disable2fa",
    auth: {
        loggedIn: true,
        twofa: true
    }
}
