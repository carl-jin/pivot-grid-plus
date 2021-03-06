/**
 * DevExtreme (esm/renovation/utils/subscribe_to_event.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import eventsEngine from "../../events/core/events_engine";
import * as clickEvent from "../../events/click";
export function subscribeToEvent(eventName) {
    return (element, handler) => {
        if (handler && element) {
            eventsEngine.on(element, eventName, handler);
            return () => eventsEngine.off(element, eventName, handler)
        }
        return
    }
}
export var subscribeToClickEvent = subscribeToEvent(clickEvent.name);
export var subscribeToScrollEvent = subscribeToEvent("scroll");
