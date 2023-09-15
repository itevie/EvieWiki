const os = require("os");
const toolbox = require(__dirname + "/../../src/toolbox.js");

module.exports.init = (app) => {
    app.post("/analytics", async (req, res) => {
        return res.status(200).send({
            dbUserAmount: Object.keys(users).length,
            dbSessionAmount: Object.keys(sessions).length,
            dbArticleAmount: Object.keys(articles).length,
            dbUserSize: computeSize(sizeOf(users)),
            dbSessionSize: computeSize(sizeOf(sessions)),
            dbArticleSize: computeSize(sizeOf(articles)),
            dbTotalSize: computeSize(sizeOf({users: users, articles: articles, sessions: sessions})),
            platform: os.platform(),
            memory: `${computeSize(os.freemem()).trim()}/${computeSize(os.totalmem()).trim()}`,
            uptime: toolbox.prettifyMs(process.uptime() * 1000)
        });
    });
}

module.exports.settings = {
    name: "POST /analytics",
    auth: {
        loggedIn: true
    }
}

const typeSizes = {
  "undefined": () => 0,
  "boolean": () => 4,
  "number": () => 8,
  "string": item => 2 * item.length,
  "object": item => !item ? 0 : Object
    .keys(item)
    .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
};

const sizeOf = value => typeSizes[typeof value](value);

let computeSize = (bytes) => {
    if (bytes < 0) bytes = Math.abs(bytes);

    let b = 0;
    let kb = 0;
    let mb = 0;

    while (bytes - 1048576 >= 0) {
        mb++;
        bytes -= 1048576;
    }

    while (bytes - 1024 >= 0) {
        kb++;
        bytes -= 1024;
    }

    b = bytes;

    return `${mb > 0 ? mb + "mb " : ""}${kb > 0 ? kb + "kb " : ""}${b > 0 ? b + "b " : ""}`;
}
