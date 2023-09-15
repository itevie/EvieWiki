const toolbox = require(__dirname + "/../../src/toolbox.js");
module.exports.init = (app) => {
    app.post("/getBackupCodes", (req, res) => {
        let codes = [];
        for (let i = 0; i != 10; i++) {
            codes.push(toolbox.newId(6, "0123456789".split("")));
        }

        if (!users[req.username].backupCodes) users[req.username].backupCodes = codes;

        return res.status(200).send(users[req.username].backupCodes);
    });
}

module.exports.settings = {
    name: "POST /getBackupCodes",
    auth: {
        loggedIn: true,
        twofa: true
    }
}
