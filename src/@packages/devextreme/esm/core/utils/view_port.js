/**
 * DevExtreme (esm/core/utils/view_port.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../renderer";
import readyCallbacks from "./ready_callbacks";
var ready = readyCallbacks.add;
import callbacks from "./callbacks";
var changeCallback = callbacks();
var $originalViewPort = $();
var value = function() {
    var $current;
    return function(element) {
        if (!arguments.length) {
            return $current
        }
        var $element = $(element);
        $originalViewPort = $element;
        var isNewViewportFound = !!$element.length;
        var prevViewPort = value();
        $current = isNewViewportFound ? $element : $("body");
        changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort)
    }
}();
ready((function() {
    value(".dx-viewport")
}));
export {
    value,
    changeCallback
};
export function originalViewPort() {
    return $originalViewPort
}
