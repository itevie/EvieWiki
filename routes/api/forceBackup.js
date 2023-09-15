const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/forceBackup", async (req, res) => {
        if (articles.hasOwnProperty(req.body.articleName.toLowerCase()) == false)
            return res.status(400).send("Article with that name does not exist");

        if (articles[req.body.articleName.toLowerCase()].author != sessions[req.cookies.session].account)
            return res.status(400).send("You must be the article author to force backup this article");

        if (articles[req.body.articleName.toLowerCase()].hasOwnProperty("backups") == false)
            articles[req.body.articleName.toLowerCase()].backups = [];

        if (articles[req.body.articleName.toLowerCase()].backups.length > 10) {
            articles[req.body.articleName.toLowerCase()].backups.shift();
        }

        articles[req.body.articleName.toLowerCase()].backups.push({
            text: articles[req.body.articleName.toLowerCase()].text,
            createdAt: Date.now(),
            backupCause: sessions[req.cookies.session].account
        });

        logger.info(`A backup was made of the article ${req.body.articleName.toLowerCase()}`);

        return res.status(200).send("Made backup");
    });
}

module.exports.settings = {
    name: "POST /forceBackup",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["articleName"],
    rateLimits: [6, 86400000]
}