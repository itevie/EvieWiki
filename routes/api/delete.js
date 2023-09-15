const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/delete", async (req, res) => {
        if (articles.hasOwnProperty(req.body.articleName.toLowerCase()) == false)
            return res.status(400).send("Article with that name does not exist");

        if (articles[req.body.articleName.toLowerCase()].author != sessions[req.cookies.session].account)
            return res.status(400).send("You must be the article author to delete this article");

        articles[req.body.articleName.toLowerCase()].deletion = {
            pending: true,
            requestedAt: Date.now()
        }

        return res.status(200).send("Article deleted");
    });
}

module.exports.settings = {
    name: "POST /delete",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["articleName"],
    rateLimits: [3, 86400000]
}