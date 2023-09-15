const sanitizeHtml = require('sanitize-html');

module.exports.init = (app) => {
    app.post("/updateArticle", async (req, res) => {
        if (articles.hasOwnProperty(req.body.articleName.toLowerCase()) == false)
            return res.status(400).send("Article with that name does not exist");

        if (articles[req.body.articleName.toLowerCase()].deletion && articles[req.body.articleName.toLowerCase()].deletion.pending == true) {
            return res.status(400).send("This article is pending deletion. New edits cannot be added");
        }

        if (articles[req.body.articleName.toLowerCase()].inUse != req.body.id)
            return res.status(400).send("ID is invalid");

        let edits = patienceDiffPlus(articles[req.body.articleName.toLowerCase()].text.split(""), await sanitizeHtml(req.body.article, settings.sanitizer, "utf-8"), true);

        if (edits.lineCountDeleted + (edits.lineCountMoved / 2) > 200) {
            if (articles[req.body.articleName.toLowerCase()].hasOwnProperty("backups") == false)
                articles[req.body.articleName.toLowerCase()].backups = [];

            if (articles[req.body.articleName.toLowerCase()].backups.length > 10) {
                articles[req.body.articleName.toLowerCase()].backups.shift();
            }

            articles[req.body.articleName.toLowerCase()].backups.push({
                text: articles[req.body.articleName.toLowerCase()].text,
                createdAt: Date.now(),
                backupCause: sessions[req.cookies.session].account
            });

            logger.info(`A backup was made of the article ${req.body.articleName.toLowerCase()}`);
        }

        articles[req.body.articleName.toLowerCase()].updateHistory.push([
            sessions[req.cookies.session].account,
            Date.now(),
            Buffer.byteLength(articles[req.body.articleName.toLowerCase()].text, "utf-8"),
            Buffer.byteLength(await sanitizeHtml(req.body.article, settings.sanitizer, "utf-8")),
            edits.lineCountDeleted + edits.lineCountInserted + edits.lineCountMoved
        ]);

        articles[req.body.articleName.toLowerCase()].text = await sanitizeHtml(req.body.article, settings.sanitizer);
        articles[req.body.articleName.toLowerCase()].lastUpdated = Date.now();
        articles[req.body.articleName.toLowerCase()].inUse = null;
        articles[req.body.articleName.toLowerCase()].inUseTime = null;

        return res.status(200).send("Article created");
    });
}

module.exports.settings = {
    name: "POST /updateArticle",
    auth: {
        loggedIn: true,
        articleMaker: true
    },
    body: ["articleName", "article", "id"],
    rateLimits: [32, 3600000]
}

const byteSize = str => new Blob([str]).size;

function patienceDiff(aLines, bLines, diffPlusFlag) {

    function findUnique(arr, lo, hi) {

        var lineMap = new Map();

        for (let i = lo; i <= hi; i++) {
            let line = arr[i];
            if (lineMap.has(line)) {
                lineMap.get(line).count++;
                lineMap.get(line).index = i;
            } else {
                lineMap.set(line, {
                    count: 1,
                    index: i
                });
            }
        }

        lineMap.forEach((val, key, map) => {
            if (val.count !== 1) {
                map.delete(key);
            } else {
                map.set(key, val.index);
            }
        });

        return lineMap;
    }

    function uniqueCommon(aArray, aLo, aHi, bArray, bLo, bHi) {
        let ma = findUnique(aArray, aLo, aHi);
        let mb = findUnique(bArray, bLo, bHi);

        ma.forEach((val, key, map) => {
            if (mb.has(key)) {
                map.set(key, {
                    indexA: val,
                    indexB: mb.get(key)
                });
            } else {
                map.delete(key);
            }
        });

        return ma;
    }

    function longestCommonSubsequence(abMap) {

        var ja = [];

        // First, walk the list creating the jagged array.
        abMap.forEach((val, key, map) => {
            let i = 0;
            while (ja[i] && ja[i][ja[i].length - 1].indexB < val.indexB) {
                i++;
            }

            if (!ja[i]) {
                ja[i] = [];
            }

            if (0 < i) {
                val.prev = ja[i - 1][ja[i - 1].length - 1];
            }

            ja[i].push(val);
        });

        // Now, pull out the longest common subsequence.
        var lcs = [];
        if (0 < ja.length) {
            let n = ja.length - 1;
            var lcs = [ja[n][ja[n].length - 1]];
            while (lcs[lcs.length - 1].prev) {
                lcs.push(lcs[lcs.length - 1].prev);
            }
        }

        return lcs.reverse();
    }

    // "result" is the array used to accumulate the aLines that are deleted, the
    // lines that are shared between aLines and bLines, and the bLines that were
    // inserted.
    let result = [];
    let deleted = 0;
    let inserted = 0;

    // aMove and bMove will contain the lines that don't match, and will be returned
    // for possible searching of lines that moved.

    let aMove = [];
    let aMoveIndex = [];
    let bMove = [];
    let bMoveIndex = [];

    //
    // addToResult simply pushes the latest value onto the "result" array.  This
    // array captures the diff of the line, aIndex, and bIndex from the aLines
    // and bLines array.
    //
    function addToResult(aIndex, bIndex) {

        if (bIndex < 0) {
            aMove.push(aLines[aIndex]);
            aMoveIndex.push(result.length);
            deleted++;
        } else if (aIndex < 0) {
            bMove.push(bLines[bIndex]);
            bMoveIndex.push(result.length);
            inserted++;
        }

        result.push({
            line: 0 <= aIndex ? aLines[aIndex] : bLines[bIndex],
            aIndex: aIndex,
            bIndex: bIndex
        });
    }

    //
    // addSubMatch handles the lines between a pair of entries in the LCS.  Thus,
    // this function might recursively call recurseLCS to further match the lines
    // between aLines and bLines.
    //
    function addSubMatch(aLo, aHi, bLo, bHi) {

        // Match any lines at the beginning of aLines and bLines.
        while (aLo <= aHi && bLo <= bHi && aLines[aLo] === bLines[bLo]) {
            addToResult(aLo++, bLo++);
        }

        // Match any lines at the end of aLines and bLines, but don't place them
        // in the "result" array just yet, as the lines between these matches at
        // the beginning and the end need to be analyzed first.
        let aHiTemp = aHi;
        while (aLo <= aHi && bLo <= bHi && aLines[aHi] === bLines[bHi]) {
            aHi--;
            bHi--;
        }

        // Now, check to determine with the remaining lines in the subsequence
        // whether there are any unique common lines between aLines and bLines.
        //
        // If not, add the subsequence to the result (all aLines having been
        // deleted, and all bLines having been inserted).
        //
        // If there are unique common lines between aLines and bLines, then let's
        // recursively perform the patience diff on the subsequence.
        let uniqueCommonMap = uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi);
        if (uniqueCommonMap.size === 0) {
            while (aLo <= aHi) {
                addToResult(aLo++, -1);
            }
            while (bLo <= bHi) {
                addToResult(-1, bLo++);
            }
        } else {
            recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap);
        }

        // Finally, let's add the matches at the end to the result.
        while (aHi < aHiTemp) {
            addToResult(++aHi, ++bHi);
        }
    }

    //
    // recurseLCS finds the longest common subsequence (LCS) between the arrays
    // aLines[aLo..aHi] and bLines[bLo..bHi] inclusive.  Then for each subsequence
    // recursively performs another LCS search (via addSubMatch), until there are
    // none found, at which point the subsequence is dumped to the result.
    //
    function recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap) {
        var x = longestCommonSubsequence(uniqueCommonMap || uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi));
        if (x.length === 0) {
            addSubMatch(aLo, aHi, bLo, bHi);
        } else {
            if (aLo < x[0].indexA || bLo < x[0].indexB) {
                addSubMatch(aLo, x[0].indexA - 1, bLo, x[0].indexB - 1);
            }

            let i;
            for (i = 0; i < x.length - 1; i++) {
                addSubMatch(x[i].indexA, x[i + 1].indexA - 1, x[i].indexB, x[i + 1].indexB - 1);
            }

            if (x[i].indexA <= aHi || x[i].indexB <= bHi) {
                addSubMatch(x[i].indexA, aHi, x[i].indexB, bHi);
            }
        }
    }

    recurseLCS(0, aLines.length - 1, 0, bLines.length - 1);

    if (diffPlusFlag) {
        return {
            lines: result,
            lineCountDeleted: deleted,
            lineCountInserted: inserted,
            lineCountMoved: 0,
            aMove: aMove,
            aMoveIndex: aMoveIndex,
            bMove: bMove,
            bMoveIndex: bMoveIndex
        };
    }

    return {
        lines: result,
        lineCountDeleted: deleted,
        lineCountInserted: inserted,
        lineCountMoved: 0
    };
}


function patienceDiffPlus(aLines, bLines) {

    let difference = patienceDiff(aLines, bLines, true);

    let aMoveNext = difference.aMove;
    let aMoveIndexNext = difference.aMoveIndex;
    let bMoveNext = difference.bMove;
    let bMoveIndexNext = difference.bMoveIndex;

    delete difference.aMove;
    delete difference.aMoveIndex;
    delete difference.bMove;
    delete difference.bMoveIndex;

    do {

        let aMove = aMoveNext;
        let aMoveIndex = aMoveIndexNext;
        let bMove = bMoveNext;
        let bMoveIndex = bMoveIndexNext;

        aMoveNext = [];
        aMoveIndexNext = [];
        bMoveNext = [];
        bMoveIndexNext = [];

        let subDiff = patienceDiff(aMove, bMove);

        var lastLineCountMoved = difference.lineCountMoved;

        subDiff.lines.forEach((v, i) => {

            if (0 <= v.aIndex && 0 <= v.bIndex) {
                difference.lines[aMoveIndex[v.aIndex]].moved = true;
                difference.lines[bMoveIndex[v.bIndex]].aIndex = aMoveIndex[v.aIndex];
                difference.lines[bMoveIndex[v.bIndex]].moved = true;
                difference.lineCountInserted--;
                difference.lineCountDeleted--;
                difference.lineCountMoved++;
            } else if (v.bIndex < 0) {
                aMoveNext.push(aMove[v.aIndex]);
                aMoveIndexNext.push(aMoveIndex[v.aIndex]);
            } else { // if (v.aIndex < 0)
                bMoveNext.push(bMove[v.bIndex]);
                bMoveIndexNext.push(bMoveIndex[v.bIndex]);
            }

        });

    } while (0 < difference.lineCountMoved - lastLineCountMoved);

    return difference;
}