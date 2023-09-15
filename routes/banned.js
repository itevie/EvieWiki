module.exports.init = (app) => {
    app.get("/banned", async (req, res) => {
        if (!req.cookies.session)
            return res.status(200).redirect("/");

        if (!sessions[req.cookies.session])
            return res.status("200").redirect("/");

        if (users[sessions[req.cookies.session].account.toLowerCase()].banned == true) {
            return res.status(200).send(await format(req, res, "html/banned.html"));
        } else return res.status(200).redirect("/");
    });
}

module.exports.settings = {
    name: "GET /banned",
    auth: {
        loggedIn: true
    }
}
