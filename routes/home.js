const format = require("../src/format.js");

module.exports.init = (app) => {
    app.get("/", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/home.html"));
    });
}

module.exports.settings = {
    name: "GET /",
    meta: {
        description: "EvieWiki is a bad Wikipedia clone!",
        title: "Homepage"
    }
}