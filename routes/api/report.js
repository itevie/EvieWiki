const uuid = require("uuid");

module.exports.init = (app) => {
    app.post("/report", async (req, res) => {
        if (req.body.report < 20)
            return res.status(400).send({
                message: "Report is too short. Must be larger than 20 characters"
            });

        if (req.body.report > 1000)
            return res.status(400).send({
                message: "Report is too large. Must be less than 1000 characters."
            })

        if (["suggest", "issue"].includes(req.body.type) == false)
            return res.status(400).send({
                message: "Type field must be suggest or issue"
            });

        if (!sessions.reports) {
            sessions.reports = {
                suggestions: {},
                issues: {}
            }
        }

        if (req.body.type == "suggest") {
            sessions.reports.suggestions[uuid.v4()] = {
                report: req.body.report,
                author: sessions[req.cookies.session].account,
                createdAt: Date.now()
            }
        } else {
            sessions.reports.issues[uuid.v4()] = {
                report: req.body.report,
                author: sessions[req.cookies.session].account,
                createdAt: Date.now()
            }
        }

        return res.status(200).send({
            message: "Report made"
        });
    });
}

module.exports.settings = {
    name: "POST /report",
    auth: {
        loggedIn: true
    },
    body: ["report", "type"],
    rateLimits: [3, 86400000]
}
