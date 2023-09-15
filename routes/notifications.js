module.exports.init = (app) => {
    app.get("/notifications", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/notifications.html", {
            notifications: JSON.stringify(users[sessions[req.cookies.session].account.toLowerCase()].notifications)
        }));
    });
}

module.exports.settings = {
    name: "GET /notifications",
    auth: {
        loggedIn: true
    }
}
