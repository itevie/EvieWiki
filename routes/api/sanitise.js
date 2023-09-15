const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/sanitise", async (req, res) => {
        return res.status(200).send(await sanitizeHtml(req.body.text, settings.sanitizer));
    });
}

module.exports.settings = {
    name: "POST /sanitise",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["text"]
}