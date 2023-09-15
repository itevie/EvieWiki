module.exports.init = (app) => {
    app.post("/updateOnlyMe", async (req, res) => {
        if (!articles[req.body.articleName.toLowerCase()])
            return res.status(404).send("Unknown article");

        if (articles[req.body.articleName.toLowerCase()].author.toLowerCase() != sessions[req.cookies.session].account.toLowerCase())
            return res.status(401).send("Only the article owner can do this action");

        if (req.body.newValue == true) articles[req.body.articleName.toLowerCase()].onlyMe = true;
        else articles[req.body.articleName.toLowerCase()].onlyMe = false;

        return res.status(200).send("Updated");
    });
}

module.exports.settings = {
    name: "POST /updateOnlyMe",
    auth: {
        loggedIn: true,
        articleMaker: true

    },
    body: ["articleName", "newValue"]
}
