const toolbox = require("./toolbox.js");

global.mainTimer = setInterval(() => {
    //Check pending deletion articles
    for (let i in articles) {
        if (articles[i].deletion && articles[i].deletion.pending == true) {
            if (settings.pendingTimeAmount - (Date.now() - articles[i].deletion.requestedAt) < 0) {
                delete articles[i];
                logger.warning(`Article ${i} has been deleted`, "timers");
            }
        }
    }
                    
    //Check if featured article should be updated
    let articlesWithViews = {};
    for (let i in articles) {
        if (articles[i].views) articlesWithViews[i] = articles[i].views;
    }

    //Find the time
    let time = toolbox.formatTime(new Date(), "YYYY/mm/DD");

    for (let i in articlesWithViews) {
        let a = 0;
        for (let x in articlesWithViews[i]) {
            let t = toolbox.formatTime(new Date(articlesWithViews[i][x]), "YYYY/mm/DD");
            if (t == time) a++;
        }
        articlesWithViews[i] = {views:a};
    }

    //Check if any accounts should be deleted
    for (let i in users) {
        if (users[i].isDeleting != undefined) {
            if (8.64e+7 - (Date.now() - users[i].isDeleting) < 0) {
                for (let a in articles)
                    if (articles[a].author.toLowerCase() == i)
                        delete articles[a];
                for (let s in sessions) {
                    if (!sessions[s].account) continue;
                    if (sessions[s].account.toLowerCase() == i)
                        delete sessions[s];
                }
                delete users[i];
                logger.warning(`Account deleted: ${i}`);
            }
        }
    }

    //Check if any notifications should be deleted
    for (let i in users) {
        for (let x in users[i].notifications) {
            if ((8.64e+7 * 7) - (Date.now() - users[i].notifications[x]) < 0) {
                delete users[i].notifications[x];
            }
        }
    }

  let sorted = toolbox.sortObject(articlesWithViews, "views", "decending");
}, 10000);
