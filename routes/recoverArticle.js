let authenticate = require(__dirname + "/../src/authenticator.js").authenticate;

module.exports.init = (app) => {
    app.get("/article/:id?/recover", async (req, res) => {
        if (!req.cookies.session)
            return res.status(400), send(await format(req, res, "html/error.html", {
                error: "Missing 'session' cookie",
                code: 401
            }));

        if (!sessions[req.cookies.session])
            return res.status(400), send(await format(req, res, "html/error.html", {
                error: "Invalid session",
                code: 401
            }));

        if (req.params.hasOwnProperty("id") == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing 'id' parameter",
                code: 400
            }));

        if (articles.hasOwnProperty(req.params.id.toLowerCase()) == false)
            return res.status(400).send(await format(req, res, "html/unkownArticle.html", {
                articleName: req.params.id
            }));

        if (articles[req.params.id.toLowerCase()].author != sessions[req.cookies.session].account) {
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "You must have created the article to recover it",
                code: 401
            }));
        }

        if (!articles[req.params.id.toLowerCase()].deletion) {
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "The article is not pending deletion",
                code: 400
            }));
        }

        delete articles[req.params.id.toLowerCase()].deletion;

        return res.status(200).redirect(`/article/${req.params.id}`);
    });
}