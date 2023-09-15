module.exports.init = (app) => {
    app.post("/articleInUse", async (req, res) => {
        if (!articles[req.body.articleName.toLowerCase()])
            return res.status(404).send("Invalid article name");

        if (articles[req.body.articleName.toLowerCase()].inUse != req.body.id)
            return res.status(400).send("Invalid ID");

        articles[req.body.articleName.toLowerCase()].inUseTime = Date.now();

        return res.status(200).send("Updated.");
    });
}

module.exports.settings = {
    name: "POST /articleInUse",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["articleName", "id"]
}
