const fs = require("fs");

const header = fs.readFileSync(__dirname + "/../public/html/head.html", "utf-8");
const sidenav = fs.readFileSync(__dirname + "/../public/html/sidenav.html", "utf-8");
const top = fs.readFileSync(__dirname + "/../public/html/top.html", "utf-8");

module.exports = async (req, res, file, options) => {
	let html = await fs.readFileSync(__dirname + `/../public/${file}`, "utf-8");
	
	if (html.includes("<title>") == false) logger.warning(`${file} does not contain a title tag`);
	
	let a = Object.keys(articles).reverse();
	let f5 = "";
	
	if (a[0]) f5 += `<a href="/article/${a[0]}">${a[0]}</a>`;
	if (a[1]) f5 += `<a href="/article/${a[1]}">${a[1]}</a>`;
	if (a[2]) f5 += `<a href="/article/${a[2]}">${a[2]}</a>`;
	if (a[3]) f5 += `<a href="/article/${a[3]}">${a[3]}</a>`;
	if (a[4]) f5 += `<a href="/article/${a[4]}">${a[4]}</a>`;
	
    let dbSize = `<label>DB: ${computeSize(sizeOf({users: users, articles: articles, sessions: sessions}))}</label>`;
    
	let an = "";
	an += `<label>Articles: ${Object.keys(articles).length}</label>`;
	an += `<label>Users: ${Object.keys(users).length}</label>`;
    an += dbSize;
	
    let theme = "";
    if (req.cookies.theme) {
        if (req.cookies.theme == "dark") theme = "dark";
        else if (req.cookies.theme == "light") theme = "light";
        else theme = "dark";
    } else theme = "dark";
    
    /*let meta = "";
    
    let url = req.method.toUpperCase() + " " + req.originalUrl.split("?")[0];

    if (routes[url]) {
        let ro = routes[url];
        if (ro.meta) {
            if (ro.meta.title) {
                meta += `<meta name="og:title" content="${ro.meta.title}" />`;
            } else meta += `<meta name="og:title" content="EvieWiki" />`;
            
            if (ro.meta.description) {
                meta += `<meta name="description" content="${ro.meta.description}" />`;
            }
        }
    }*/
    
	html = html.replace(/%head%/gi, header)
		.replace(/%sidenav%/gi, sidenav)
		.replace(/%top%/gi, top)
		.replace(/%first5articles%/gi, f5)
		.replace(/%analytics%/gi, an)
		.replace(/%name%/gi, settings.name)
		.replace(/%url%/gi, req.originalUrl)
        .replace(/%theme%/gi, theme);
	
    let newr = false
    if (Object.keys(sessions.reports.suggestions).length != 0) newr = true;
    if (Object.keys(sessions.reports.issues).length != 0) newr = true;
    
    html = html.replace(/%blinkreports%/gi, newr == true && req.originalUrl.includes("viewReports") == false ? 'class="blink"' : "");
    
	for (let i in options) {
		html = html.replace(new RegExp(`%${i}%`, "gi"), options[i]);
	}

	return html;
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

/*let dbSize = `<label>DB: ${computeSize(sizeOf({users: users, articles: articles, sessions: sessions}))}</label>`;

setInterval(() => {
    dbSize = `<label>DB: ${computeSize(sizeOf({users: users, articles: articles, sessions: sessions}))}</label>`; 
}, 1000 * 60);*/