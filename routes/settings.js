 module.exports.init = (app) => {
     app.get("/settings", async (req, res) => {
         return res.status(200).send(await format(req, res, "html/settings.html"));
     });
 }

 module.exports.settings = {
     name: "GET /settings",
     auth: {
         loggedIn: true
     }
 }