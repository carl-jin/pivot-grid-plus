/**
 * DevExtreme (esm/core/utils/inflector.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    map
} from "./iterator";
var _normalize = function(text) {
    if (void 0 === text || null === text) {
        return ""
    }
    return String(text)
};
var _upperCaseFirst = function(text) {
    return _normalize(text).charAt(0).toUpperCase() + text.substr(1)
};
var _chop = function(text) {
    return _normalize(text).replace(/([a-z\d])([A-Z])/g, "$1 $2").split(/[\s_-]+/)
};
export var dasherize = function(text) {
    return map(_chop(text), (function(p) {
        return p.toLowerCase()
    })).join("-")
};
export var underscore = function(text) {
    return dasherize(text).replace(/-/g, "_")
};
export var camelize = function(text, upperFirst) {
    return map(_chop(text), (function(p, i) {
        p = p.toLowerCase();
        if (upperFirst || i > 0) {
            p = _upperCaseFirst(p)
        }
        return p
    })).join("")
};
export var humanize = function(text) {
    return _upperCaseFirst(dasherize(text).replace(/-/g, " "))
};
export var titleize = function(text) {
    return map(_chop(text), (function(p) {
        return _upperCaseFirst(p.toLowerCase())
    })).join(" ")
};
var DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export var captionize = function(name) {
    var captionList = [];
    var i;
    var char;
    var isPrevCharNewWord = false;
    var isNewWord = false;
    for (i = 0; i < name.length; i++) {
        char = name.charAt(i);
        isNewWord = char === char.toUpperCase() && "-" !== char && ")" !== char && "/" !== char || char in DIGIT_CHARS;
        if ("_" === char || "." === char) {
            char = " ";
            isNewWord = true
        } else if (0 === i) {
            char = char.toUpperCase();
            isNewWord = true
        } else if (!isPrevCharNewWord && isNewWord) {
            if (captionList.length > 0) {
                captionList.push(" ")
            }
        }
        captionList.push(char);
        isPrevCharNewWord = isNewWord
    }
    return captionList.join("")
};
