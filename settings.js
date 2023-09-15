module.exports = {
    "name": "wiki",
    "pendingTimeAmount": 86400000,
    "tips": [
        "Press CTRL + S at any time to search EvieWiki!",
        "On mobile? Go to settings and check 'Auto hide sidenav' to get more space to read an article!",
        "Click on \"Report on Issue\" or \"Suggest\" in the sidenav to give us feedback!",
        "Setup 2FA in settings to secure your account!",
        "Make sure to get your backup codes in settings!",
        "Press enter while a dialog is open to quickly close it! Try it now!",
        "While editing an article, press CTRL + S to quickly publish it",
        "Check out <a href=\"/article/searching\">searching</a> to get better at searching!"
    ],
    "limit": "30kb",
    "sanitizer": {
        "allowedTags": [
            "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
            "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
            "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
            "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
            "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
            "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
            "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "img",
            "label", "del"
        ],
        "disallowedTagsMode": "discard",
        "allowedAttributes": {
            "*": ["class", "name"],
            "a": ["href", "name", "target"],
            "img": ["src", "srcset", "alt", "title", "width", "height", "loading"],
            "abbr": ["title"]
        },
        "allowedStyles": {
            "*": {
                'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/],
                'font-size': [/^\d+(?:px|em|%)$/]
            }
        },
        "selfClosing": ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
        "allowedSchemes": ["http", "https"],
        "allowedSchemesByTag": {},
        "allowedSchemesAppliedToAttributes": ["href", "src", "cite"],
        "allowProtocolRelative": true,
        "enforceHtmlBoundary": false
    }
}
