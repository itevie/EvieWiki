module.exports.init = (app) => {
    app.get("/all", async (req, res) => {
        let list = "";

        let a = Object.keys(articles).sort();

        for (let i in a) {
            let x = articles[a[i]];
            list += `<a style="${x.hasOwnProperty('deletion') ? 'color: red;' : ""} text-decoration: none" href="/article/${a[i]}">${a[i]}</a> - `;
        }

        list = list.slice(0, -3);

        return res.status(200).send(await format(req, res, "html/all.html", {
            articles: list
        }));
    });
}