module.exports.init = (app) => {
    app.post("/unban", async (req, res) => {
        if (sessions[req.cookies.session].account.toLowerCase() != "evie")
            return res.status(401).send("You cannot perform this action");

        if (!users[req.body.user.toLowerCase()])
            return res.status(404).send("User not found");

        users[req.body.user.toLowerCase()].banned = false;

        return res.status(200).send("Account unbanned")
    });
}

module.exports.settings = {
    name: "POST /unban",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["user"]
}