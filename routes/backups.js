module.exports.init = (app) => {
    app.get("/article/:id?/backups", async (req, res) => {
        if (req.params.hasOwnProperty("id") == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing 'id' parameter",
                code: 400
            }));

        if (req.query.hasOwnProperty("load")) {
            if (articles[req.params.id.toLowerCase()].backups[parseInt(req.query.load)]) {
                return res.status(200).send(await format(req, res, "html/editArticle.html", {
                    article_name: articles[req.params.id.toLowerCase()].articleName,
                    text: articles[req.params.id.toLowerCase()].backups[parseInt(req.query.load)].text
                }));
            } else {
                return res.status(400).send(await format(req, res, "html/error.html", {
                    error: "Backup not found",
                    code: 404
                }));
            }
        }

        let toSend = [];
        for (let i in articles[req.params.id.toLowerCase()].backups) {
            toSend.push({
                createdAt: articles[req.params.id.toLowerCase()].backups[i].createdAt,
                cause: articles[req.params.id.toLowerCase()].backups[i].backupCause,
                size: Buffer.byteLength(articles[req.params.id.toLowerCase()].backups[i].text),
            });
        }

        return res.status(200).send(await format(req, res, "html/backups.html", {
            article_name: articles[req.params.id.toLowerCase()].articleName,
            backups: JSON.stringify(toSend)
        }));
    });
}