const pms = require(__dirname + "/../src/toolbox.js").prettifyMs;
const bcrypt = require("bcrypt");

module.exports.authenticate = async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (req.cookies.session && sessions.hasOwnProperty(req.cookies.session) == true)
        if (await bcrypt.compare(ip, sessions[req.cookies.session].ip) == false) {
            if (req.originalUrl == "/sessionInvalidIp") return next();
            if (req.method != "POST") {
                return res.status(401).redirect("/sessionInvalidIp");
            } else return error(req, res, 401, "The session was assigned for a different IP address");
        }
        
    let url = req.originalUrl.split("?")[0];
    if (["/banned", "/login"].includes(req.originalUrl) == false && req.cookies.session && sessions[req.cookies.session] && users[sessions[req.cookies.session].account.toLowerCase()].banned == true) {
        if (req.method == "POST") {
            return res.status(401).send("Your account is banned");
        } else {
            return res.status(401).redirect("/banned");
        }
    }

     if (req.cookies.session && sessions[req.cookies.session] && users[sessions[req.cookies.session].account.toLowerCase()].isDeleting != undefined) {
         if (req.method == "GET") {
             delete users[sessions[req.cookies.session].account.toLowerCase()].isDeleting;
             return res.redirect("/deletionCancelled");
         }
     }
    
    if ((next.customAuth) || routes[req.method.toUpperCase() + " " + url]) {
        let route = routes[req.method.toUpperCase() + " " + url];
        if (next.customAuth == true) route = next;
        
        //Check if the route needs to be logged in
        if (route.auth && route.auth.loggedIn == true) {
            if (!req.cookies.session)
                return error(req, res, 401, "Missing session, you may need to login");
		
            if (sessions.hasOwnProperty(req.cookies.session) == false)
                return error(req, res, 401, "Invalid session");
		
            if (sessions[req.cookies.session].account == "")
                return error(req, res, 401, "Session is not assigned an account");

            req.username = sessions[req.cookies.session].account.toLowerCase();
            if (route.auth && route.auth.twofa == true) {
                if (users[req.username].twofa != undefined && users[req.username].twofa != "") {
                    if (!req.body.code)
                        return error(req, res, 400, "Missing 2fa code");
                    let r = verify2fa(req, req.body.code);
                    if (r == false)
                        return error(req, res, 400, "Invalid 2fa code");
                }
            }
        }

        if (route.whitelist) {
            if (route.whitelist.includes(sessions[req.cookies.session].account.toLowerCase()) == false)
                return error(req, res, 401, "You are not permitted to view this page");
        }

        if (route.rateLimits) {
            if (!sessions.rateLimits) sessions.rateLimits = {};
            if (!sessions.rateLimits[sessions[req.cookies.session].account]) sessions.rateLimits[sessions[req.cookies.session].account] = {};
            if (!sessions.rateLimits[sessions[req.cookies.session].account][url]) sessions.rateLimits[sessions[req.cookies.session].account][url] = {connects: 0, startedAt: Date.now()};
            sessions.rateLimits[sessions[req.cookies.session].account][url].connects++;
            if (sessions.rateLimits[sessions[req.cookies.session].account][url].connects > route.rateLimits[0]) {
                if (route.rateLimits[1] - (Date.now() - sessions.rateLimits[sessions[req.cookies.session].account][url].startedAt) < 0)
                    sessions.rateLimits[sessions[req.cookies.session].account][url] = {connects: 0, startedAt: Date.now()};
                else {
                    logger.warning("Request exceeded ratelimit on the route");
                    return error(req, res, 429, `Ratelimit reached. You can make ${route.rateLimits[0]} requests every ${pms(+route.rateLimits[1])} on this route. Your block will end in`
                    + ` ${pms(route.rateLimits[1] - (Date.now() - sessions.rateLimits[sessions[req.cookies.session].account][url].startedAt))}`);
                }
            }
        }
        
        //Check if the user needs to be an article maker to make the request
        if (route.auth && route.auth.articleMaker == true) {
            if (!users[sessions[req.cookies.session].account.toLowerCase()].isMaker || users[sessions[req.cookies.session].account.toLowerCase()].isMaker == false)
                return error(req, res, 401, "You are not permitted to edit articles");
        }
        
        //Check if all the body is correct
        if (route.body) {
            for (let i in route.body) {
                if (req.body.hasOwnProperty(route.body[i]) == false) {
                    return error(req, res, 400, `Missing '${route.body[i]}' field`);
                } 
            }
        }
        
        //Check if all the query is correct
        if (route.query) {
            for (let i in route.query) {
                if (req.query.hasOwnProperty(route.query[i]) == false) {
                    return error(req, res, 400, `Missing '${route.query[i]}' query field`);
                } 
            }
        }

        if (route.auth && route.auth.twofaUserFromBody == true) {
            if (users[req.body.username.toLowerCase()] && users[req.body.username.toLowerCase()].twofa != undefined && users[req.body.username.toLowerCase()].twofa != "") {
                if (!req.body.code)
                    return error(req, res, 400, "Missing 2fa code");
                let r = verify2fa(req, req.body.code, false, true);
                if (r == false)
                    return error(req, res, 400, "Invalid 2fa code");
            }
        }
    }
    
    if (next.customAuth) return true;
    next();
}

async function error(req, res, code, message) {
    logger.warning(`Request failed authentication: ${code}`);
    if (req.method == "POST") {
        return res.status(code).send(message);
    } else {
        return res.status(code).send(await format(req, res, "html/error.html", {
            code: code,
            error: message
        }));
    }
}

const twofactor = require("node-2fa");

global.verify2fa = (req, code, useTemp = false, useBody = false) => {
    if (useTemp == true) token = users[req.username].temp2fa;
    else if (useBody == true) token = users[req.body.username.toLowerCase()].twofa;
    else token = users[req.username].twofa;
    if (!token) return false;

    let result = twofactor.verifyToken(token, code);
    if (result != null && result.delta != undefined && result.delta == 0) {
        return true;
    } else return false;
}
