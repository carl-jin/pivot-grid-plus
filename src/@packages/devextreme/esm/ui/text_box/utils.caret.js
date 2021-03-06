/**
 * DevExtreme (esm/ui/text_box/utils.caret.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    isDefined
} from "../../core/utils/type";
import browser from "../../core/utils/browser";
import devices from "../../core/devices";
import domAdapter from "../../core/dom_adapter";
var {
    ios: ios,
    mac: mac
} = devices.real();
var isFocusingOnCaretChange = browser.msie || ios || mac;
var getCaret = function(input) {
    var range;
    try {
        range = {
            start: input.selectionStart,
            end: input.selectionEnd
        }
    } catch (e) {
        range = {
            start: 0,
            end: 0
        }
    }
    return range
};
var setCaret = function(input, position) {
    if (!domAdapter.getBody().contains(input)) {
        return
    }
    try {
        input.selectionStart = position.start;
        input.selectionEnd = position.end
    } catch (e) {}
};
var caret = function(input, position) {
    var force = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
    input = $(input).get(0);
    if (!isDefined(position)) {
        return getCaret(input)
    }
    if (!force && isFocusingOnCaretChange && domAdapter.getActiveElement() !== input) {
        return
    }
    setCaret(input, position)
};
export default caret;
