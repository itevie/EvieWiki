const uuid = require("uuid");
const cjs = require("crypto-js");

module.exports.init = (app) => {
    app.get("/login", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/login.html"));
    });
}