const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.get("/search", async (req, res) => {
        if (req.query.hasOwnProperty("query") == false)
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "Missing 'query' query",
                code: 400
            }));

        let type = "default";
        let query = decodeURI(req.query.query).replace(/[<>&;]/g, "");

        if (query.startsWith("includes:") || query.startsWith("i:")) {
            query = query.replace("i:", "");
            if (query.startsWith("includes:"))
                query = query.replace("includes:", "")
            type = "includes";
        }

        if (query.startsWith("regex:") || query.startsWith("r:")) {
            query = query.replace("r:", "");
            if (query.startsWith("regex:"))
                query = query.replace("regex:", "")
            type = "regex";
        }

        if (articles[query] && type == "default")
            return res.status(200).redirect(`/article/${req.query.query}`);

        let results = [];
        let oldQuery = decodeURI(req.query.query);
        let safeQuery = oldQuery.replace(/[<>&;]/g, "");

        if (oldQuery != safeQuery) {
            return res.status(400).send(await format(req, res, "html/error.html", {
                error: "The search term contains unallowed characters.",
                code: 400
            }));
        }

        if (type != "regex") {
            for (let i in articles) {
                if (articles[i].deletion && articles[i].deletion.pending == true)
                    continue;
                if (i.includes(query))
                    results.push([articles[i].articleName, "Name includes query"]);
                if (articles[i].author.toLowerCase().includes(query))
                    results.push([articles[i].articleName, "Author includes query"]);
                if (articles[i].text.toLowerCase().includes(query))
                    results.push([articles[i].articleName, "Article body includes query"]);
            }
        } else {
            for (let i in articles) {
                if (articles[i].deletion && articles[i].deletion.pending == true)
                    continue;
                if (i.match(new RegExp(query, "gi")))
                    results.push([articles[i].articleName, "Name includes query"]);
                if (articles[i].author.toLowerCase().match(new RegExp(query, "g")))
                    results.push([articles[i].articleName, "Author includes query"]);
                if (articles[i].text.toLowerCase().match(new RegExp(query, "g")))
                    results.push([articles[i].articleName, "Article body includes query"]);
            }
        }

        let text = "";
        let cols = "";

        for (let i in results) {
            cols += "<tr>";

            cols += `<td><a href="/article/${results[i][0]}">${results[i][0]}</a></td>`;
            cols += `<td>${results[i][1]}</td>`;

            cols += "</td>";
        }

        if (results.length == 0) text = "<label>No results</label>";
        else text = "<table><tr><th>Article</th><th>Reason</th></tr>" + cols + "</table>";

        return res.status(200).send(await format(req, res, "html/search.html", {
            query: query,
            results: text,
            amount: results.length
        }));
    });
}
