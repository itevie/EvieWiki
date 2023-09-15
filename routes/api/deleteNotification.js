module.exports.init = (app) => {
    app.post("/deleteNotification", (req, res) => {
        if (req.body.id == "all") {
            users[sessions[req.cookies.session].account.toLowerCase()].notifications = {};
            return res.status(200).send({});
        }

        if (!users[sessions[req.cookies.session].account.toLowerCase()].notifications[req.body.id])
            return res.status(200).send("The notification with that ID cannot be found");

        delete users[sessions[req.cookies.session].account.toLowerCase()].notifications[req.body.id];

        return res.status(200).send(users[sessions[req.cookies.session].account.toLowerCase()].notifications);
    });
}

module.exports.settings = {
    name: "POST /deleteNotification",
    auth: {
        loggedIn: true
    },
    body: ["id"]
}
