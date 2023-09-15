const sanitizeHtml = require('sanitize-html');
const toolbox = require(__dirname + "/../src/toolbox.js");

module.exports.init = (app) => {
    app.get("/viewReports", async (req, res) => {
        if (!req.cookies.session)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing session field, you may need to login",
                code: 400
            }));
        if (sessions.hasOwnProperty(req.cookies.session) == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Invalid session",
                code: 400
            }));

        if (sessions[req.cookies.session].account == "")
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "The session does not have an assigned account",
                code: 400
            }));

        if (sessions[req.cookies.session].account.toLowerCase() != "evie")
            return res.status(401).send(await format(req, res, "html/error.html", {
                error: "Your account is not permitted to make an article",
                code: 401
            }));

        if (req.query.delete) {
            for (let i in sessions.reports.suggestions) {
                if (i == req.query.delete) {
                    delete sessions.reports.suggestions[i];
                    return res.status(200).redirect("/viewReports");
                }
            }
            for (let i in sessions.reports.issues) {
                if (i == req.query.delete) {
                    delete sessions.reports.issues[i];
                    return res.status(200).redirect("/viewReports");
                }
            }

            return res.status(200).send(await format(req, res, "html/error.html", {
                error: "A report with the id doesnt exist",
                code: 404
            }));
        }

        let suggestions = "";
        let issues = "";

        for (let i in sessions.reports.suggestions) {
            suggestions += `<label><b>${sessions.reports.suggestions[i].author} - (${i})</b><label> @ ${toolbox.formatTime(parseInt(sessions.reports.suggestions[i].createdAt), "YYYY/mm/DD HH:MM:SS")}</label></label> <a href="/viewReports/?delete=${i}" style="color: red; cursor: pointer">Delete</a><br><p>${sessions.reports.suggestions[i].report.replace(/[<>'";]/g, "¬")}</p>`;
        }

        for (let i in sessions.reports.issues) {
            issues += `<label><b>${sessions.reports.issues[i].author} - (${i})</b><label> @ ${toolbox.formatTime(parseInt(sessions.reports.issues[i].createdAt), "YYYY/mm/DD HH:MM:SS")}</label></label> <a href="/viewReports/?delete=${i}" style="color: red; cursor: pointer">Delete</a><br><p>${sessions.reports.issues[i].report.replace(/[<>'";]/g, "¬")}</p>`;
        }

        return res.status(200).send(await format(req, res, "html/viewReports.html", {
            suggestions: suggestions,
            issues: issues
        }));
    });
}