module.exports.init = (app) => {
    app.post("/userExists", async (req, res) => {
        if (users[req.body.username.toLowerCase()])
            return res.status(200).send("User exists");
        else
            return res.status(404).send("User does not exist");
    });
}

module.exports.settings = {
    name: "POST /userExists",
    body: ["username"]
}
