const format = require("../src/format.js");

module.exports.init = (app) => {
    app.get("/register", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/register.html"));
    });
}