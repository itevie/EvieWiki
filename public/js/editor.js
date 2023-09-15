function edit(text) {
	let m = text.match(/#\[[^\]]+\]/g);
	
	for (let i in m) {
		
		text = text.replace(m[i], `<a href="/article/${m[i].slice(2, -1)}">${m[i].slice(2, -1)}</a>`);
	}
    
    m = text.match(/@\!?(time|date)(:[^#\n]*)?#/g);
    
    for (let i in m) {
        if (m[i].startsWith("@!")) continue;
        
        let time = "";
        let format = "";
        
        if (m[i] == "@time#") format = "YYYY / mm / DD HH:MM:SS";
        else if (m[i] == "@date#") format = "YYYY / mm / DD";
        else {
            let tem = m[i].split(":");
            tem.shift();
            tem = tem.join(":");
            tem = tem.slice(0, -1);
            format = tem;
        }

        text = text.replace(m[i], formatTime(new Date(), format))
    }
	if (document.getElementById("autoUpdate").checked == true) document.getElementById("articleText").value = text;
	return text;
}
