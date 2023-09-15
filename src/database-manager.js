const crypto = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require("fs");

let ignoreMongo = false;

const uri = process.env.mongo;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Create events for process to save when exiting
process.on('SIGTERM', saveBeforeExit);
process.on('SIGINT', saveBeforeExit);
process.on("SIGHUP", saveBeforeExit);

process.on('uncaughtException', (err) => {
    console.log(err);
});

async function saveBeforeExit() {
	clearInterval(mainTimer);
	await save();
	process.exit(0);
}

//Timer for auto save
setInterval(() => {
	save();
}, 1000 * 60);

//Place to store hashses of databases to indicate whether or not it needs to be saved
let oldDatabases = {
	users: "",
	sessions: "",
	articles: ""
}

//Used for comparing
let newHashses = {
	users: "",
	sessions: "",
	articles: ""
}

//Saving function
function save() {
	const promise = new Promise((resolve, reject) => {
        if (ignoreMongo == true) return resolve();
        
		logger.info("Saving databases...", "db-manager");
		
		createHashesForNew();
		client.connect(async (err) => {
			if (err) throw err;
			let dbo = client.db("eviewiki");
			
			if (oldDatabases.users != newHashses.users) {
				await dbo.collection("users").updateOne({_id: ids.users}, {$set: {"storage": users}});
				logger.success("Updated users", "db-manager");
			}
			
			if (oldDatabases.sessions != newHashses.sessions) {
				await dbo.collection("sessions").updateOne({_id: ids.sessions}, {$set: {"storage": sessions}});
				logger.success("Updated sessions", "db-manager");
			}
			
			if (oldDatabases.articles != newHashses.articles) {
				await dbo.collection("articles").updateOne({_id: ids.articles}, {$set: {"storage": articles}});
				logger.success("Updated articles", "db-manager");
			}
			
			client.close();
			createHashes();
			logger.success("Saved databases", "db-manager");
			
			resolve();
			createHashes();
		});
	});
	
	return promise;
}
global.save = save;

let ids = {
	
}

//Loading function
function load() {
	const promise = new Promise((resolve, reject) => {
		logger.log("Loading databases...", "db-manager");
        
        if (flags.loadBackup) {
            let file = require(flags.loadBackup);
            users = file.users;
            sessions = file.sessions;
            articles = file.articles;
            logger.info("Loaded backup");
            
            resolve();
            return;
        }
        
		client.connect(async (err) => {
			if (err) throw err;
			let dbo = client.db("eviewiki");
				
			let userDb = await dbo.collection("users").findOne({});
			users = userDb.storage;
			ids.users = userDb._id;
			logger.success("Loaded users", "db-manager");
			
			let sessionDb = await dbo.collection("sessions").findOne({});
			sessions = sessionDb.storage;
			ids.sessions = sessionDb._id;
			logger.success("Loaded sessions", "db-manager");
			
			let articlesDb = await dbo.collection("articles").findOne({});
			articles = articlesDb.storage;
			ids.articles = articlesDb._id;
			logger.success("Loaded articles", "db-manager");
			
			client.close();
			createHashes();
			logger.success("Loaded databases", "db-manager");
            
            if (flags.makeBackup) {
                fs.writeFileSync("./backups/" + require(__dirname + "/toolbox.js").formatTime(Date.now(), "YYYY mm DD HH MM SS") + ".json", JSON.stringify({
                    users: users,
                    sessions: sessions,
                    articles: articles
                }));
                logger.info("Backup made");
            }
            
            if (flags.clearRatelimits && flags.clearRatelimits == true) {
                sessions.rateLimits = {};
                logger.warning("Cleared ratelimits");
            }
        
			resolve();
		}); 
	});
	
	return promise;
}
global.load = load;

//Function to set old database hashes
function createHashes() {
	oldDatabases.users = crypto.createHash('md5').update(JSON.stringify(users)).digest('hex');
	oldDatabases.sessions = crypto.createHash('md5').update(JSON.stringify(sessions)).digest('hex');
	oldDatabases.articles = crypto.createHash('md5').update(JSON.stringify(articles)).digest('hex');
}

//Function to create new hashes for comparing
function createHashesForNew() {
	newHashses.users = crypto.createHash('md5').update(JSON.stringify(users)).digest('hex');
	newHashses.sessions = crypto.createHash('md5').update(JSON.stringify(sessions)).digest('hex');
	newHashses.articles = crypto.createHash('md5').update(JSON.stringify(articles)).digest('hex');
}
