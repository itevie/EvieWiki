const os = require("os");

module.exports.init = (app) => {
    app.get("/analytics", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/evieWikiAnalytics.html"));
    });
}

module.exports.settings = {
    name: "GET /analytics",
    auth: {
        loggedIn: true
    }
}
