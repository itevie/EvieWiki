module.exports.init = (app) => {
    app.get("/newArticle", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/editArticle.html", {
            "type": "new",
            text: ""
        }));
    });
}

module.exports.settings = {
    name: "GET /newArticle",
    auth: {
        loggedIn: true,
        articleMaker: true
    }
}