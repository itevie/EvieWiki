module.exports.init = (app) => {
    app.get("/random", async (req, res) => {
        return res.status(200).redirect(`/article/${Object.keys(articles)[Math.floor(Math.random() * Object.keys(articles).length)]}`);
    });
}