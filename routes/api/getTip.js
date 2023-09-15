module.exports.init = (app) => {
    app.post("/getTip", async (req, res) => {
        return res.status(200).send(settings.tips[Math.floor(Math.random() * settings.tips.length)]);
    });
}

module.exports.settings = {
    name: "POST /getTip"
}
