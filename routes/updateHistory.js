module.exports.init = (app) => {
    app.get("/article/:id?/updateHistory", async (req, res) => {
        if (req.params.hasOwnProperty("id") == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing 'id' parameter",
                code: 400
            }));

        return res.status(200).send(await format(req, res, "html/updateHistory.html", {
            article_name: articles[req.params.id.toLowerCase()].articleName,
            updateHistory: JSON.stringify(articles[req.params.id.toLowerCase()].updateHistory)
        }));
    });
}