module.exports.init = (app) => {
    app.get("/article/:id/analytics", async (req, res) => {
        if (!articles[req.params.id.toLowerCase()])
            return res.status(404).send(await format(req, res, "html/error.html", {
                error: "Unkown article",
                code: 404
            }));

        let toSend = {
            updateHistory: JSON.stringify(articles[req.params.id.toLowerCase()].updateHistory)
        };

        return res.status(200).send(await format(req, res, "html/analytics.html", {
            updateHistory: JSON.stringify(articles[req.params.id.toLowerCase()].updateHistory),
            articleName: req.params.id,
            views: articles[req.params.id.toLowerCase()].views ? JSON.stringify(articles[req.params.id.toLowerCase()].views) : "[]",
            uniqueViews: articles[req.params.id.toLowerCase()].uniqueViews ? JSON.stringify(articles[req.params.id.toLowerCase()].uniqueViews) : "[]"
        }));
    });
}