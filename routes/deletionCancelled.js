module.exports.init = (app) => {
    app.get("/deletionCancelled", async (req, res) => {
        return res.status(200).send(await format(req, res, "html" + req.originalUrl + ".html"));
    });
}

module.exports.settings = {
    name: "GET /deletionCancelled",
    auth: {
        loggedIn: true
    }
}
