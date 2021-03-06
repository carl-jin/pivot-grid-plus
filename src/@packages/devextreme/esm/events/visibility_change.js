/**
 * DevExtreme (esm/events/visibility_change.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import eventsEngine from "./core/events_engine";
var triggerVisibilityChangeEvent = function(eventName) {
    return function(element) {
        var $element = $(element || "body");
        var changeHandlers = $element.filter(".dx-visibility-change-handler").add($element.find(".dx-visibility-change-handler"));
        for (var i = 0; i < changeHandlers.length; i++) {
            eventsEngine.triggerHandler(changeHandlers[i], eventName)
        }
    }
};
export var triggerShownEvent = triggerVisibilityChangeEvent("dxshown");
export var triggerHidingEvent = triggerVisibilityChangeEvent("dxhiding");
export var triggerResizeEvent = triggerVisibilityChangeEvent("dxresize");
