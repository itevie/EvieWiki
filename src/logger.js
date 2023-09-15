const chalk = require("chalk");
const formatTime = require(__dirname + "/toolbox").formatTime;

global.logger = {
	error: (text, type = "error") => {
		let result = chalk.gray("[" + chalk.red(formatTime(type + " : " + Date.now(), "HH:MM:SS")) + "]");
		result += text;
		
		console.log(result);
	},
	
	info: (text, type = "info") => {
	
		let result = chalk.gray("[" + chalk.white(type + " : " + formatTime(Date.now(), "HH:MM:SS")) + "]");
		result += " " + text;
		
		console.log(result);
	},
	
	warning: (text, type = "warning") => {
	
		let result = chalk.gray("[" + chalk.yellow(type + " : " + formatTime(Date.now(), "HH:MM:SS")) + "]");
		result += " " + text;
		
		console.log(result);
	},
	
	success: (text, type = "success") => {
	
		let result = chalk.gray("[" + chalk.green(type + " : " + formatTime(Date.now(), "HH:MM:SS")) + "]");
		result += " " + text;
		
		console.log(result);
	}
}

logger.log = logger.info;

module.exports.loggerMiddleware = async (req, res, next) => {
	logger.info(`New connection: ${req.method} ${req.originalUrl}`, "server");
	next();
}