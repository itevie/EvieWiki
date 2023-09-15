module.exports.init = (app) => {
    app.get("/report", async (req, res) => {
        if (!req.query.type) return res.status(200).redirect("/report?type=issue");

        if (["suggest", "issue"].includes(req.query.type) == false)
            return res.status(401).send(await format(req, res, "html/error.html", {
                error: "Bad type, must be suggest or issue",
                code: 401
            }));

        return res.status(200).send(await format(req, res, "html/report.html", {
            type: req.query.type
        }));
    });
}

module.exports.settings = {
    name: "GET /report",
    auth: {
        loggedIn: true
    },
    query: ["type"]
}