const uuid = require("uuid");
const articleFormatter = require(__dirname + "/../src/articleFormatter.js");

module.exports.init = (app) => {
    app.get("/article/:id?", async (req, res) => {
        if (req.params.hasOwnProperty("id") == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing 'id' parameter",
                code: 400
            }));

        if (articles.hasOwnProperty(req.params.id.toLowerCase()) == false)
            return res.status(400).send(await format(req, res, "html/unkownArticle.html", {
                articleName: req.params.id
            }));
        else {
            if (!users[articles[req.params.id.toLowerCase()].author.toLowerCase()])
                return res.status(400).send(await format(req, res, "html/error.html", {
                    error: "The article exists but the the author appears to not exist",
                    code: 400
                }));

            if (users[articles[req.params.id.toLowerCase()].author.toLowerCase()].banned == true)
                return res.status(400).send(await format(req, res, "html/error.html", {
                    error: "The author of this artice has been banned.",
                    code: 400
                }));
            if (articles[req.params.id.toLowerCase()].deletion && articles[req.params.id.toLowerCase()].deletion.pending == true) {

                return res.status(400).send(await format(req, res, "html/pendingDeletion.html", {
                    articleName: req.params.id,
                    time: articles[req.params.id.toLowerCase()].deletion.requestedAt,
                    deleteIn: settings.pendingTimeAmount
                }));
            }

            //If the "edit" query is enabled then send the article editor
            if (req.query.hasOwnProperty("edit") == true && req.query.edit == "true") {
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

                if (users[sessions[req.cookies.session].account.toLowerCase()].isMaker != true)
                    return res.status(401).send(await format(req, res, "html/error.html", {
                        error: "Your account is not permitted to make an article",
                        code: 401
                    }));

                if (articles[req.params.id.toLowerCase()].onlyMe == true && articles[req.params.id.toLowerCase()].author.toLowerCase() != sessions[req.cookies.session].account.toLowerCase())
                    return res.status(401).send(await format(req, res, "html/error.html", {
                        error: "Sorry, the article author has set it so only they can edit this article",
                        code: 401
                    }));

                if (articles[req.params.id.toLowerCase()].inUse != null && articles[req.params.id.toLowerCase()].onlyMe != true) {
                    if (120000 - (Date.now() - articles[req.params.id.toLowerCase()].inUseTime) < 0) {
                        articles[req.params.id.toLowerCase()].inUseTime = 0;
                        articles[req.params.id.toLowerCase()].inUse = null;
                    } else {
                        return res.status(401).send(await format(req, res, "html/error.html", {
                            error: "Sorry, but someone is already editing this article.",
                            code: 401
                        }));
                    }
                }

                let i = uuid.v4();
                articles[req.params.id.toLowerCase()].inUse = i;
                articles[req.params.id.toLowerCase()].inUseTime = Date.now();

                return res.status(200).send(await format(req, res, "html/editArticle.html", {
                    article_name: articles[req.params.id.toLowerCase()].articleName,
                    text: articles[req.params.id.toLowerCase()].text,
                    id: i
                }));
            }

            //Find all the links that link to this article
            let backlinks = [];

            for (let i in articles) {
                if (i == req.params.id.toLowerCase()) continue;
                if (articles[i].deletion && articles[i].deletion.pending == true) continue;
                if (articles[i].text.toLowerCase().match(new RegExp(`/a(rticles?)?/${req.params.id.toLowerCase()}`))) backlinks.push(i);
            }

            let heads = "";

            let result = await articleFormatter(articles[req.params.id.toLowerCase()].text);

            //Upadate view count
            if (!articles[req.params.id.toLowerCase()].views) articles[req.params.id.toLowerCase()].views = [];
            articles[req.params.id.toLowerCase()].views.push(Date.now());

            //Update unique view count
            if (!articles[req.params.id.toLowerCase()].uniqueViews) articles[req.params.id.toLowerCase()].uniqueViews = [];
            let a = articles[req.params.id.toLowerCase()].uniqueViews.map(b => b[1]);
            if (req.cookies.session && sessions[req.cookies.session] && a.includes(sessions[req.cookies.session].account) == false)
                articles[req.params.id.toLowerCase()].uniqueViews.push([Date.now(), sessions[req.cookies.session].account]);

            //Send the article data
            return res.status(200).send(await format(req, res, "html/articleViewer.html", {
                article_name: articles[req.params.id.toLowerCase()].articleName,
                author: articles[req.params.id.toLowerCase()].author,
                createdAt: articles[req.params.id.toLowerCase()].createdAt,
                lastUpdated: articles[req.params.id.toLowerCase()].lastUpdated,
                text: result.toSend,
                backlinks: backlinks.join(";"),
                heads: result.headers,
                contentsDisplay: result.headers.length != 0 ? "block" : "none",
                jump: req.query.jump ? "header-" + req.query.jump : "",
                onlyMe: articles[req.params.id.toLowerCase()].onlyMe != undefined ? "checked" : ""
            }));
        }
    });
}
