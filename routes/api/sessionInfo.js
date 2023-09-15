module.exports.init = (app) => {
    app.post("/sessionInfo", async (req, res) => {
        return res.status(200).send(sessions[req.cookies.session]);
    });
}

module.exports.settings = {
    name: "POST /sessionInfo",
    auth: {
        loggedIn: true
    }
}
