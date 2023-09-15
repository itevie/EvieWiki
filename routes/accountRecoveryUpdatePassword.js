module.exports.init = (app) => {
    app.get("/accountRecoveryUpdatePassword", async (req, res) => {
        if (users[sessions[req.cookies.session].account.toLowerCase()].backupPhase != true)
            return res.status(401).send(await format(req, res, "html/error.html", {
                error: "Your account is not in backup phase",
                code: 401
            }));

        return res.status(200).send(await format(req, res, "html/accountRecoveryUpdatePassword.html"));
    });
}

module.exports.settings = {
    name: "GET /accountRecoveryUpdatePassword",
    auth: {
        loggedIn: true
    }
}
