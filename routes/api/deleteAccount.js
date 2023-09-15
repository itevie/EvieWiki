module.exports.init = (app) => {
    app.post("/deleteAccount", (req, res) => {
        users[sessions[req.cookies.session].account.toLowerCase()].isDeleting = Date.now();
        return res.status(200).send("Account is now pending deletion");
    });
}

module.exports.settings = {
    name: "POST /deleteAccount",
    auth: {
        loggedIn: true,
        twofa: true
    }
}
