/**
 * DevExtreme (esm/events/utils/event_nodes_disposing.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import eventsEngine from "../core/events_engine";
var REMOVE_EVENT_NAME = "dxremove";

function nodesByEvent(event) {
    return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter(node => !!node)
}
export var subscribeNodesDisposing = (event, callback) => {
    eventsEngine.one(nodesByEvent(event), REMOVE_EVENT_NAME, callback)
};
export var unsubscribeNodesDisposing = (event, callback) => {
    eventsEngine.off(nodesByEvent(event), REMOVE_EVENT_NAME, callback)
};
