/**
 * DevExtreme (esm/core/utils/position.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import config from "../config";
import domAdapter from "../dom_adapter";
import browser from "../utils/browser";
import {
    isWindow
} from "../utils/type";
var getDefaultAlignment = isRtlEnabled => {
    var rtlEnabled = null !== isRtlEnabled && void 0 !== isRtlEnabled ? isRtlEnabled : config().rtlEnabled;
    return rtlEnabled ? "right" : "left"
};
var getElementsFromPoint = (x, y) => {
    var document = domAdapter.getDocument();
    if (browser.msie) {
        var result = document.msElementsFromPoint(x, y);
        if (result) {
            return Array.prototype.slice.call(result)
        }
        return []
    }
    return document.elementsFromPoint(x, y)
};
var getBoundingRect = element => {
    if (isWindow(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        }
    }
    var rect;
    try {
        rect = element.getBoundingClientRect()
    } catch (e) {
        rect = {
            width: 0,
            height: 0,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        }
    }
    return rect
};
export {
    getBoundingRect,
    getDefaultAlignment,
    getElementsFromPoint
};
