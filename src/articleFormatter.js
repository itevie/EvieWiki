module.exports = (text) => {
    let headers = "";

    let toSend = text;

    //Find all the headers
    let headerMatches = text.match(/(#\!\!?)?<h[1-6][^>]*>[^<]*<\/h[1-6]>/g);

    //Find and update all <pre> tags
    let preMatches = text.match(/<pre>.*<\/pre>/g);

    for (let i in preMatches) {
        let a = preMatches[i].slice(5, -6);
        toSend = toSend.replace(preMatches[i], `<pre>${a.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
    }

    //Remove all the headers that start with #! or #!!
    for (let i in headerMatches) {
        if (headerMatches[i].startsWith("#!!")) {
            //Remove the second exclamation mark to leave #!
            toSend = toSend.replace(headerMatches[i].replace(/</g, "&lt;").replace(/>/g, "&gt;"), headerMatches[i].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace("#!!", "#!"));
        }
        else if (headerMatches[i].startsWith("#!")) {
            toSend = toSend.replace(headerMatches[i].replace(/</g, "&lt;").replace(/>/g, "&gt;"), headerMatches[i].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace("#!", ""));
        }
    }

    //Find the smallest header
    let smallestHeader = 100;

    for (let i in headerMatches) {
        if (headerMatches[i].startsWith("#!")) continue;
        let n = headerMatches[i].slice(2);
        n = parseInt(n[0]);
        if (n < smallestHeader) smallestHeader = n;
    }

    //Add all the headers to the headers variable
    for (let i in headerMatches) {
        if (headerMatches[i].startsWith("#!")) continue;

        //Replace the tags with nothing
        let t = headerMatches[i].replace(/<h[1-6][^>]*>/, "")
            .replace(/<\/h[1-6]>/, "");

        //Get the headers number (hN)
        let n = headerMatches[i].slice(2);
        n = parseInt(n[0]);

        //Add an ID to the header in the toSend variable
        toSend = toSend.replace(headerMatches[i], `<h${n} id="header-${t}">${t}</h${n}>`);

        //Add the header to the headers variable
        headers += `<label>${"&nbsp;&nbsp;".repeat((n - smallestHeader) * 2)}</label><a style="cursor: pointer;" onclick="goto('header-${t}');">${t}</a><br>`;
    }

    //Replace all the lists within the article body
    let lists = text.match(/#\!?(ul|ol):[^#^\n]+#/g);

    for (let i in lists) {
        //If the match starts with #! then skip it and replace the ! with nothing
        if (lists[i].startsWith("#!")) {
            toSend = toSend.replace(lists[i], lists[i].replace("!", ""));
            continue;
        }

        //Format the match
        let items = lists[i].split(":");
        let type = items[0].replace("#", "");
        if (["ul", "ol"].includes(type) == false) continue;
        items.shift();
        items = items.join(":");
        items = items.slice(0, -1).split(";");

        let tex = `<${type}>`;

        //Add the html to "tex" whatever that is supposed to mean
        for (let e in items) {
            if (items[e] != "") tex += `<li>${items[e]}</li>`;
        }
        tex += `</${type}>`;

        //Replace the thing in toSend with the result
        toSend = toSend.replace(lists[i], tex);
    }

    //Format dialogs
    let dialogs = text.match(/#\!?dialog:[a-z]+:[^:]+:[^:]+:#/g);

	for (let i in dialogs) {
        if (dialogs[i].startsWith("#!")) {
            toSend = toSend.replace(dialogs[i], dialogs[i].replace("#!", "#"));
            continue;
        }

		let parts = dialogs[i].split(":");

		if (parts[1] == "type") continue;
        if (["warning", "info"].includes(parts[1]) == false) continue;
		let html = `<div class="alert-${parts[1]}">
  <div class="alert-${parts[1]} ${parts[1]}-text">
    <label>${parts[2]}</label>
  </div>
  <p>${parts[3]}</p>
</div>`
		toSend = toSend.replace(dialogs[i], html);
	}

  //Remove bad anchaor links
  let anchors = toSend.match(/<a.+href=".+".+>[^<]+<\/a>/g);
  console.log(anchors)

    return { toSend: toSend, headers: headers }
}
