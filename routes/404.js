const format = require("../src/format.js");
const fs = require("fs");

module.exports.init = (app) => {
    app.get("*", async (req, res) => {
        return res.status(404).send(await format(req, res, "html/404.html"));
    });
}
