module.exports.init = (app) => {
    app.post("/logoutAll", (req, res) => {
        let amount = 0;
        for (let i in sessions) {
            if (!sessions[i].account) continue;
            if (sessions[i].account.toLowerCase() == req.username) {
                amount++;
                delete sessions[i];
            }
        }

        return res.status(200).send(`Deleted ${amount} sessions`);
    });
}

module.exports.settings = {
    name: "POST /logoutAll",
    auth: {
        loggedIn: true
    }
}
