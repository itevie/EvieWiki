const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/newArticle", async (req, res) => {
        if (/['"<>&;\[\]\(\)\{\}\\%\^\$\£\!\.\?]{1,30}/.test(req.body.articleName) == true)
            return res.status(400).send("Article name does not match regex, must only contain alphanumeric characters + accented, 1 - 30 of length");

        if (articles.hasOwnProperty(req.body.articleName.toLowerCase()) == true)
            return res.status(400).send("Article with that name already exists");

        articles[req.body.articleName.toLowerCase()] = {
            articleName: req.body.articleName,
            author: sessions[req.cookies.session].account,
            text: await sanitizeHtml(req.body.article, settings.sanitizer),
            createdAt: Date.now(),
            updateHistory: [],
            backups: []
        }

        return res.status(200).send("Article created");
    });
}

module.exports.settings = {
    name: "POST /newArticle",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["articleName", "article"],
    rateLimits: [3, 86400000]
}