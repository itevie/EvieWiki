module.exports.init = (app) => {
    app.get("/u(sers?)?/:user?", async (req, res) => {
        if (!req.params.user)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing user parameter",
                code: 400
            }));

        if (users.hasOwnProperty(req.params.user.toLowerCase()) == false)
            return res.status(404).send(await format(req, res, "html/error.html", {
                error: "User not found",
                code: 404
            }));

        if (req.query.edit == "true" && req.cookies.session && sessions[req.cookies.session].account && sessions[req.cookies.session].account.toLowerCase() == req.params.user.toLowerCase()) {
            return res.status(501).send(await format(req, res, "html/error.html", {
                error: "Not implemented yet",
                code: 501
            }));
        }

        let a = [];

        for (let i in articles) {
            if (articles[i].author.toLowerCase() == req.params.user.toLowerCase())
                a.push(i);
        }

        return res.status(200).send(await format(req, res, "html/userViewer.html", {
            user: req.params.user,
            articles: JSON.stringify(a),
            createdAt: users[req.params.user.toLowerCase()].createdAt
        }));
    });
}