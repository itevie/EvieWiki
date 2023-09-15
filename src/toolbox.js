"use strict";

//Evie's Toolbox
//Look in ./tests for examples
const fs = require("fs");

let chars = "abcdefghijklmnopqrstuvwxyz".split("");
let numbers = "1234567890".split("");

module.exports = {
	globalise: (functions) => {
		for (let i in module.exports) {
			if (i == "globalise") continue;
			if (functions != undefined && functions.includes(i) == false) continue;
			global[i] = module.exports[i];
		}
		
		return true;
	},
	
	addNumberSuffixes: (str) => {
		let numbers = str.match(/([0-9]+\,[0-9]+)+/g);
		let newNumbers = [];
		
		for (let i in numbers) {
			if (numbers[i].endsWith("1")) newNumbers.push(numbers[i] + "st");
			else if (numbers[i].endsWith("2")) newNumbers.push(numbers[i] + "nd");
			else if (numbers[i].endsWith("3")) newNumbers.push(numbers[i] + "rd");
			else newNumbers.push(numbers[i] + "th");
		}
		
		for (let i in numbers) {
			str = str.replace(numbers[i], newNumbers[i]);
		}
		
		return str;
	},
	
	getAllFiles: (dirPath, arrayOfFiles) => {
		let files = fs.readdirSync(dirPath);

		arrayOfFiles = arrayOfFiles || [];

		files.forEach(function(file) {
			if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				arrayOfFiles = module.exports.getAllFiles(dirPath + "/" + file, arrayOfFiles);
			} else {
				arrayOfFiles.push(dirPath + (dirPath.endsWith("/") ? "" : "/") + file);
			}
		});

		return arrayOfFiles;
	},
	
	idFromTemplate: (template) => {
		template = template.replace(/[a-z]/g, "c").replace(/[0-9]/g, "n");
		
		while (template.includes("c")) template = template.replace("c", chars[Math.floor(Math.random() * chars.length)]);
		while (template.includes("n")) template = template.replace("n", numbers[Math.floor(Math.random() * numbers.length)]);
		
		return template;
	},

	random: (min, max, floor) => {
		let result = 0;
		
		if (min == undefined && max == undefined) result = Math.random();
		if (min != undefined && max == undefined) result = Math.random() * min;
		if (min != undefined && max != undefined) result = Math.random() * (max - min) + min;
		
		if (floor != undefined && floor == true) return Math.floor(result);
		else return result;
	},
	
	newId: (length, customChars) => {
		if (customChars == undefined || customChars == null) customChars = [...chars, ...numbers];
		if (typeof customChars == "boolean") customChars = [...chars, ...numbers];
		
		let result = "";
		
		for (let i = 0; i != length; i++) {
			result += customChars[Math.floor(Math.random() * customChars.length)];
		}
		
		return result;
	},
	
	allWordsToUpper: (str) => {
		let strs = str.split(" ");
		for (let i in strs) {
			let s = strs[i].split("");
			s[0] = s[0].toUpperCase();
			strs[i] = s.join("");
		}
		
		return strs.join(" ");
	},
	
	randomCapitalise: (str) => {
		let strs = str.split("");
		
		for (let i in strs) {
			if (Math.random() > 0.5) strs[i] = strs[i].toUpperCase();
			else strs[i] = strs[i].toLowerCase();
		}
		
		return strs.join("");
	},
	
	wordAmount: (str) => {
		return str.split(" ").length;
	},
	
	nonWhitespaceLength: (str) => {
		return str.replace(/\s/g, "").length;
	},
	
	formatTime: (time, format) => {
		if (typeof time != "object") time = new Date(time);
		
		let ms = time.getMilliseconds();
		let msNice = ms.toString().length == 1 ? `0${ms}` : ms;
		
		let seconds = time.getSeconds();
		let secondsNice = seconds.toString().length == 1 ? `0${seconds}` : seconds;
		
		let minutes = time.getMinutes();
		let minutesNice = minutes.toString().length == 1 ? `0${minutes}` : minutes;
		
		let hours = time.getHours();
		let hoursNice = hours.toString().length == 1 ? `0${hours}` : hours;
		
		let year = time.getFullYear();
		
		let month = time.getMonth() + 1;
		let monthNice = month.toString().length == 1 ? `0${month}` : month;
		
		let day = time.getDate();
		let dayNice = day.toString().length == 1 ? `0${day}` : day;
		
		format = format.replace(/ZZZ/g, msNice);
		format = format.replace(/ZZ/g, msNice.toString().slice(0, -1));
		format = format.replace(/Z/g, msNice.toString().slice(0, -2));
		
		format = format.replace(/SS/g, secondsNice);
		format = format.replace(/S/g, seconds);
		
		format = format.replace(/MM/g, minutesNice);
		format = format.replace(/M/g, minutes);
		
		format = format.replace(/HH/g, hoursNice);
		format = format.replace(/H/g, hours);
		
		format = format.replace(/YYYY/g, year);
		format = format.replace(/YYY/g, year.toString().slice(1));
		format = format.replace(/YY/g, year.toString().slice(2));
		format = format.replace(/Y/g, year.toString().slice(3));
		
		format = format.replace(/mm/g, monthNice);
		format = format.replace(/m/g, month);
		
		format = format.replace(/DD/g, dayNice);
		format = format.replace(/D/g, day);
		
		return format;
	},
	
	timeSince: (old, now, useShort) => {
		let sep = now - old;
		let r = module.exports.prettifyMs(sep, useShort || false) + " ago";
		return r;
	},
	
	prettifyMs: (sep, useShort) => {
		let millenniums = 0;
		let centuries = 0;
		let decades = 0;
		let years = 0;
		let months = 0;
		let weeks = 0;
		let days = 0;
		let hours = 0;
		let minutes = 0;
		let seconds = 0;
		let ms = 0;
		
		//Millenniums
		while (sep - (31536000000 * 1000) >= 0) {
			millenniums++;
			sep -= (31536000000 * 1000);
		}
		
		//Centuries
		while (sep - (31536000000 * 100) >= 0) {
			centuries++;
			sep -= (31536000000 * 100);
		}
		
		//Centuries
		while (sep - (31536000000 * 100) >= 0) {
			centuries++;
			sep -= (31536000000 * 100);
		}
		
		//Decades
		while (sep - (31536000000 * 10) >= 0) {
			decades++;
			sep -= (31536000000 * 10);
		}
		
		//Years
		while (sep - 31536000000 >= 0) {
			years++;
			sep -= 31536000000;
		}
		
		//Months
		while (sep - 2.628e+9 >= 0) {
			months++;
			sep -= 2.628e+9;
		}
		
		//Weeks
		while (sep - 6.048e+8 >= 0) {
			weeks++;
			sep -= 6.048e+8;
		}
		
		//Days
		while (sep - 8.64e+7 >= 0) {
			days++;
			sep -= 8.64e+7 ;
		}
		
		//Hours
		while (sep - 3.6e+6 >= 0) {
			hours++;
			sep -= 3.6e+6;
		}
		
		//Minutes
		while (sep - 60000 >= 0) {
			minutes++;
			sep -= 60000;
		}
		
		//Seconds
		while (sep - 1000 >= 0) {
			seconds++;
			sep -= 1000;
		}
		
		ms = Math.floor(sep);
		
		let format = [];
		
		if (useShort == undefined || useShort == false) {
			if (millenniums > 0) format.push(`${millenniums} millennium${millenniums > 1 ? "s" : ""}`);
			if (centuries > 0) format.push(`${centuries} ${centuries > 1 ? "centuries" : "century"}`);
			if (decades > 0) format.push(`${decades} decade${decades > 1 ? "s" : ""}`);
			if (years > 0) format.push(`${years} year${years > 1 ? "s" : ""}`);
			if (months > 0) format.push(`${months} month${months > 1 ? "s" : ""}`);
			if (weeks > 0) format.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
			if (days > 0) format.push(`${days} day${days > 1 ? "s" : ""}`);
			if (hours > 0) format.push(`${hours} hour${hours > 1 ? "s" : ""}`);
			if (minutes > 0) format.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
			if (seconds > 0) format.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
			if (ms > 0) format.push(`${ms}ms`);
		} else {
			if (millenniums > 0) format.push(`${millenniums}mil`);
			if (centuries > 0) format.push(`${centuries}cent`);
			if (decades > 0) format.push(`${decades}dec`);
			if (years > 0) format.push(`${years}yr`);
			if (months > 0) format.push(`${months}mth`);
			if (weeks > 0) format.push(`${weeks}w`);
			if (days > 0) format.push(`${days}d`);
			if (hours > 0) format.push(`${hours}h`);
			if (minutes > 0) format.push(`${minutes}m`);
			if (seconds > 0) format.push(`${seconds}s`);
			if (ms > 0) format.push(`${ms}ms`);
		}

		let result = "";
		
		if (useShort == undefined || useShort == false) {
			if (format.length == 1) result = format[0];
			if (format.length == 2) result = `${format[0]} and ${format[1]}`;
			
			if (format.length > 2) {
				for (let i in format) {
					if (i == format.length - 1) {
						result = result.slice(0, -2);
						result += " and ";
					}
					result += format[i] + ", ";
				}
				result = result.slice(0, -2);
			}
		} else {
			result = format.join(" ");
		}
		
		return result;
	},
	
	getProcessFlags: (beginner) => {
		beginner = beginner || "--";
		
		let flagsList = [];
		
		for (let i in process.argv) {
			if (process.argv[i].startsWith(beginner)) flagsList.push(process.argv[i].replace(beginner, ""));
		}
		
		let flags = {};
		
		for (let i in flagsList) {
			if (flagsList[i].split("=").length == 2) {
				flags[flagsList[i].split("=")[0]] = flagsList[i].split("=")[1];
			} else flags[flagsList[i]] = null;
		}
		
		for (let i in flags) {
			if (flags[i] == "true") flags[i] = true;
			else if (flags[i] == "false") flags[i] = false;
			else if (flags[i] == "null") flags[i] = null;
			else if (flags[i] != null && flags[i].match(/-?[0-9]+(.[0-9]+)?/)) flags[i] = +(flags[i]);
		}
		
		return flags;
	},
	
	sort: (arr, type) => {
		if (type.toLowerCase() != "ascending" && type.toLowerCase() != "decending") 
			throw new Error("Type must be ascending or decending");
		
		let result = [];
		
		if (type.toLowerCase() == "ascending")
			result = arr.sort((a, b) => a - b);
		else (type.toLowerCase() == "decending") 
			result = arr.sort((a, b) => b - a);
			
		return result;
	},
	
	sortWithId: (n, type) => {
		if (typeof type != "string" || (type.toLowerCase() != "ascending" && type.toLowerCase() != "decending")) 
			throw new Error("Type must be ascending or decending");
		
		let result = [];
		
		if (type.toLowerCase() == "ascending")
			result = n.sort((a, b) => a[0] - b[0]);
		else (type.toLowerCase() == "decending") 
			result = n.sort((a, b) => b[0] - a[0]);
			
		return n;
	},
	
	sortObject: (object, value, type) => {
		if (typeof type != "string" || (type.toLowerCase() != "ascending" && type.toLowerCase() != "decending")) 
			throw new Error("Type must be ascending or decending");
		
		let n = [];
		
		for (let i in object) n.push([i, object[i]]);

		let result = [];
		
		if (type.toLowerCase() == "ascending")
			result = n.sort((a, b) => module.exports.readObject(a[1], value) - module.exports.readObject(b[1], value));
		else (type.toLowerCase() == "decending") 
			result = n.sort((a, b) => module.exports.readObject(b[1], value) - module.exports.readObject(a[1], value));
		
		let res = {};
		
		for (let i in n) {
			res[result[i][0]] = result[i][1];
		}
		
		return res;
	},
	
	readObject: (object, str) => {
		if (typeof object != "object")
			throw new Error("Expected object");
		
		let keys = str.split(".");
		
		if (object.hasOwnProperty(keys[0]) == false) return undefined;
		else {
			if (typeof object[keys[0]] != "object") return object[keys[0]];
			let newKeys = keys.slice();
			newKeys.shift();
			return module.exports.readObject(object[keys[0]], newKeys.join("."));
		}
	},
	
	randomColor: () => {
		let hex = module.exports.newId(6, "ABCDEF1234567890");
		return `#${hex}`;
	},
	
	randomHexCode: () => {
		return (module.exports.newId(2, "ABCDEF1234567890"));
	},
	
	randomBinary: (length) => {
		return (module.exports.newId(length, "01"));
	},
	
	getComplementaryColor: (color) => {
		const colorPart = color.slice(1);
		const ind = parseInt(colorPart, 16);
		
		let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
		while (iter.length < colorPart.length) {
			iter = "0" + iter;
		}
		
		return "#" + iter;
	}
}
