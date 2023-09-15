let autoHide = true;

document.addEventListener("DOMContentLoaded", () => {
    if (getCookie("autoHideSide") == "true")
        document.cookie = "displaySidenav=false;path=/";

    if (getCookie("displaySidenav") == "") {
        if (mobileCheck() == true)
            toggleSidenav()
    } else {
        if (getCookie("displaySidenav") == "false")
            toggleSidenav()
    }

    fetch("/sessionInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: "{}"
    }).then(async res => {
        let data = await res.json();

        if (data.account) {
            document.getElementById("topUser").innerHTML = data.account;
            document.getElementById("notLoggedIn").style.display = "none";
            document.getElementById("loggedIn").style.display = "block";
            window.account = data.account;
            if (data.account.toLowerCase() == "evie") {
                document.getElementById("owner-viewReports").style.display = "block";
            }
        }
    });
});

let enterPressed = 0;
document.addEventListener("keyup", function(event) {
	if (500 - (Date.now() - enterPressed) < 0) enterPressed = 0;
    if (event.keyCode === 13) {
        let element = getMaxZIndex();
		let i = getZIndex(element);
		if (i > 500) {
			document.activeElement.blur();
			let id = element.id;
			let a = document.getElementById(id + "ConfBtn");
			a.onclick();
			enterPressed = Date.now();
		}
    }
});

if (!(location.href).toString().match(/(article\/.+\?edit=true)|(newArticle)/) ) {
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showSearcher();
            document.getElementById("searcherQuery").focus();
        }
    });
}

function getMaxZIndex() {
    let array = Array.from(document.querySelectorAll("body *"), el => {
        if (window.getComputedStyle(el).display != "none")
            return parseFloat(window.getComputedStyle(el).zIndex);
    })
    let items = array.filter(zIndex => {
        if (zIndex != NaN && zIndex != undefined) return zIndex
    });
    let max = Math.max(...items, 0);

    let els = Array.from(document.querySelectorAll("body *"), ele => {
        if (parseFloat(window.getComputedStyle(ele).zIndex) == max && window.getComputedStyle(ele).display != "none") {
            return ele;
        }
    });
    let element = els.filter(a => {
        if (a != NaN && a != undefined) return a
    });
    return element[0]
}

window.getZIndex = function (e) {
  var z = window.document.defaultView.getComputedStyle(e).getPropertyValue('z-index');
  if (isNaN(z)) return window.getZIndex(e.parentNode);
  return z;
};

let shown = true;

function toggleSidenav() {
    if (shown == true) {
        document.getElementById("sidenav").style.display = "none";
        let main = document.getElementsByClassName("main")[0];
        main.style["margin-left"] = "0px";
        shown = false;
    } else {
        document.getElementById("sidenav").style.display = "block";
        let main = document.getElementsByClassName("main")[0];
        main.style["margin-left"] = "160px";
        shown = true;
    }
    document.cookie = `displaySidenav=${shown};path=/`;
}

function mobileCheck() {
    let check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function goto(a) {
    document.getElementById(a).scrollIntoView();
    document.getElementById(a).classList.add("blink");
    setTimeout(() => {
        document.getElementById(a).classList.remove("blink");
    }, 2000);
}

function message(body, title = "Message") {
    document.getElementById("messageDim").style["z-index"] = 99998;
    document.getElementById("messageDim").style.display = "block";
    document.getElementById("messageBody").innerHTML = body;
    document.getElementById("messageHeader").innerHTML = title;
    document.getElementById("message").style.display = "block";
}

function showSearcher() {
    document.getElementById("searcherDim").style["z-index"] = 99998;
    document.getElementById("searcherDim").style.display = "block";
    document.getElementById("searcher").style.display = "block";
}

function hideSearcher() {
    document.getElementById("searcherDim").style.display = "none";
    document.getElementById("searcher").style.display = "none";
}

function searcherSearch() {
    let q = document.getElementById("searcherQuery").value;
    window.location = `/search?query=${document.getElementById('searcherQuery').value}`;
}

function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    } else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = {
                    start: 0,
                    end: len
                }; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos) +
            myValue +
            myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function setCursorPos(input, start, end) {
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    } else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}

let runAfterVerifyF;
let verifyRoute;
let verifyBody;

function runVerifyAfter(res) {
    if (typeof runAfterVerifyF == "string") {
        let a = runAfterVerifyF.split(":");
        let cmd = a[0];
        a.shift();
        a = a.join(":");

        if (cmd.startsWith("~")) {
            let s = cmd.split("~");
            console.log(s);
            let msg = s[1]
            s.shift();
            s.shift();
            cmd = s[0];
            cmd = cmd.slice(1, 0);
            message(msg);
        }

        if (cmd == "goto") {
            location.href = a;
        }

        if (cmd == "reload") {
            location.reload();
        }
    } else {
        runAfterVerifyF(res);
    }
}

async function sendAfterVerify(route, body, f) {
    await setTimeout(() => {}, 50);
    document.getElementById("verifyDiv").style.display = "block";
    document.getElementById("verifyDivCode").value = "";
    document.getElementById("verifyDim").style["z-index"] = 999998;
    document.getElementById("verifyDim").style.display = "block";
    runAfterVerifyF = f;
    verifyRoute = route;
    verifyBody = body;
}

function verify() {
    hideVerify();
    verifyBody.code = document.getElementById("verifyDivCode").value;
    fetch(verifyRoute, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyBody)
    }).then(async res => {
        let text = await res.text();
        if (!res.ok)
            return message("Oops! Verification failed: " + text, "Verification Failed");
        runVerifyAfter(text);
    });
}

function hideVerify() {
    document.getElementById("verifyDim").style.display = "none";
    document.getElementById("verifyDiv").style.display = "none";
}

let runQuestionF;

function runQuestion() {
    runQuestionF();
    hideMessage();
}

function question(body, f, title = "Question") {
    document.getElementById("questionDim").style["z-index"] = 99998;
    document.getElementById("questionDim").style.display = "block";
    document.getElementById("questionBody").innerHTML = body;
    document.getElementById("questionHeader").innerHTML = title;
    document.getElementById("question").style.display = "block";
    runQuestionF = f;
}

function hideMessage() {
    document.getElementById("messageDim").style.display = "none";
    document.getElementById("questionDim").style.display = "none";
    document.getElementById("messageBody").innerHTML = "";
    document.getElementById("messageHeader").innerHTML = "Placeholder";
    document.getElementById("message").style.display = "none";
    document.getElementById("questionBody").innerHTML = "";
    document.getElementById("questionHeader").innerHTML = "Placeholder";
    document.getElementById("question").style.display = "none";
    runQuestionF = null;
}

function getTip() {
    fetch("/getTip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: "{}"
    }).then(async res => {
        if (!res.ok)
            return message(`Oops! Failed to fetch tip: ${await res.text()}`);
        return message(await res.text(), "Tip");
    });
}

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

function getCookie(cname) {
    let ne = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(ne) == 0) {
            return c.substring(ne.length, c.length);
        }
    }
    return "";
}

function changeTheme() {
    let current = document.getElementById("currentTheme").innerHTML;
    if (current == "light") {
        document.cookie = "theme=dark;path=/";
        document.getElementById("currentTheme").innerHTML = "dark";
    } else {
        document.cookie = "theme=light;path=/";
        document.getElementById("currentTheme").innerHTML = "light";
    }

    if ((window.location).toString().endsWith("/newArticle")) {
        if (confirm("You are currently in an editing page, do you want to reload? Your settings will be saved regardless") == true) location.reload();
    } else if ((window.location).toString().endsWith("?edit=true")) {
        if (confirm("You are currently in an editing page, do you want to reload? Your settings will be saved regardless") == true) location.reload();
    } else if ((window.location).toString().includes("/backups?load=")) {
        if (confirm("You are currently in an editing page, do you want to reload? Your settings will be saved regardless") == true) location.reload();
    } else location.reload();
}

const formatTime = (time, format) => {
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
}

const prettyMs = (sep, useShort) => {
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
        sep -= 8.64e+7;
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

    ms = sep;

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
        if (format.length == 1) result == format[0];
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
}
