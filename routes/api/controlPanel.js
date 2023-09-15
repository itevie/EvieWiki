const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/controlPanel", async (req, res) => {
        if (sessions[req.cookies.session].account.toLowerCase() != "evie")
            return res.status(400).send("You are not permitted to view this page");

        if (req.body.newMaker) {
            let u = req.body.newMaker.toLowerCase().split(",");
            for (let i in u) {
                if (users[u[i]]) {
                    users[u[i]].isMaker = true;
                } else return res.status(400).send("Cannot find the newMaker user");
            }
        }

        if (req.body.removeMaker) {
            let u = req.body.removeMaker.toLowerCase().split(",");
            for (let i in u) {
                if (users[u[i]]) {
                    users[u[i]].isMaker = false;
                } else return res.status(400).send("Cannot find the removeMaker user");
            }
        }

        return res.status(200).send("Done");
    });
}

module.exports.settings = {
    name: "POST /controlPanel",
    auth: {
        loggedIn: true
    }
}