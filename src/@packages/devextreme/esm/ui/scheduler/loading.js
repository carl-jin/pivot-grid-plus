/**
 * DevExtreme (esm/ui/scheduler/loading.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    value as viewPort
} from "../../core/utils/view_port";
import LoadPanel from "../load_panel";
import {
    Deferred
} from "../../core/utils/deferred";
var loading = null;
var createLoadPanel = function(options) {
    return new LoadPanel($("<div>").appendTo(options && options.container || viewPort()), options)
};
var removeLoadPanel = function() {
    if (!loading) {
        return
    }
    loading.$element().remove();
    loading = null
};
export function show(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show()
}
export function hide() {
    if (!loading) {
        return (new Deferred).resolve()
    }
    return loading.hide().done(removeLoadPanel).promise()
}
