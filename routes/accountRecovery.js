module.exports.init = (app) => {
    app.get("/accountRecovery", async (req, res) => {
        return res.status(200).send(await format(req, res, "html/accountRecovery.html"));
    });
}
