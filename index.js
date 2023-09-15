"use strict";

//Require dependencies
const l = require("./src/logger.js");
const express = require("express");
const compression = require('compression');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
    getAllFiles
} = require("./src/toolbox.js");
require("./src/database-manager");
require("./src/timers.js");
global.format = require("./src/format.js");
global.settings = require("./settings.js");

//Create variables
global.users = {};
global.sessions = {};
global.articles = {};

global.routes = {};

//Create app
const app = express();

app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.json({
    limit: settings.limit
}));
app.use(cookieParser());
app.use(cors());
app.use(l.loggerMiddleware);
app.use(compression({
    filter: shouldCompress
}))

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}
app.use(function(err, req, res, next) {
    if (err.toString().startsWith("PayloadTooLargeError:")) {
        res.status(400).send(`Body exceeds size limit (${settings.limit})`);
        logger.warning(`Request exceeded body limit of ${settings.limit}`);
    } else {
        next(err);
    }
});
logger.info(`Set up with size limit: ${settings.limit}`);

app.use(require("./src/authenticator.js").authenticate);

let flagParse = [];
for (let i in process.argv) {
    if (process.argv[i].match(/\-[^ ^\\]+(=[^ ]+)?/)) {
        flagParse.push(process.argv[i]);
    }
}

global.flags = {};
for (let i in flagParse) {
    let a = flagParse[i].replace("-", "").split("=");
    flags[a[0]] = a[1] || true;
    if (flags[a[0]] == "true") flags[a[0]] = true;
    if (flags[a[0]] == "false") flags[a[0]] = false;
}

//Load routes
(async () => {
    const files = await getAllFiles(__dirname + "/routes");
    const addAfter = [];

    for (const i in files) {
        if (files[i].includes("404")) {
            addAfter.push(files[i]);
            continue;
        }
        if (files[i].includes("kate-swp")) continue;

        let route = require(files[i]);
        if (route.settings) routes[route.settings.name] = route.settings;
        route.init(app);
        logger.info(`Loaded route: ${files[i]}`);
    }

    for (const i in addAfter) {
        let route = require(addAfter[i]);
        if (route.settings) routes[route.settings.name] = route.settings;
        route.init(app);
        logger.info(`Loaded route: ${addAfter[i]}`);
    }
})();

//Start server
(async () => {
    await load();
    users["evie"].isMaker = true;
    if (!sessions.reports || sessions.reports.hasOwnProperty("suggestions")) sessions.reports = {
        suggestions: {},
        issues: {}
    };
    app.listen(8080, async () => {
        logger.info("Server is now listening for requests", "server");
    });
})();
