const bcrypt = require("bcrypt");

module.exports.init = (app) => {
    app.get("/sessionInvalidIp", async (req, res) => {
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        if (req.cookies.session && sessions.hasOwnProperty(req.cookies.session) == true)
            if (await bcrypt.compare(ip, sessions[req.cookies.session].ip) == false) {
                return res.status(200).send(await format(req, res, "html/sessionInvalidIp.html"));
            }
        return res.status(200).redirect("/");
    });
}