module.exports.init = (app) => {
    app.get("/controlPanel", async (req, res) => {
        let u = "";
        for (let i in users) {
            let t = "";
            if (users[i].isMaker && users[i].isMaker == true) t = `<label style="color: lightblue">${users[i].username}</label>`;
            else if (users[i].banned == true) t = `<label style="color: red">${users[i].username}</label>`;
            else t = `<label>${users[i].username}</label>`;
            u += t + "&nbsp;";
        }

        return res.status(200).send(await format(req, res, "html/controlPanel.html", {
            users: u
        }));
    });
}

module.exports.settings = {
    name: "GET /controlPanel",
    whitelist: ["evie"],
    auth: {
        loggedIn: true,
        articleMaker: true
    }
}