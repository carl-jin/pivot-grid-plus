/**
 * DevExtreme (esm/events/core/emitter_registrator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import readyCallbacks from "../../core/utils/ready_callbacks";
import domAdapter from "../../core/dom_adapter";
import eventsEngine from "../../events/core/events_engine";
import {
    data as elementData
} from "../../core/element_data";
import Class from "../../core/class";
import {
    extend
} from "../../core/utils/extend";
import {
    inArray
} from "../../core/utils/array";
import {
    each
} from "../../core/utils/iterator";
import registerEvent from "./event_registrator";
import {
    addNamespace,
    isMouseEvent
} from "../utils/index";
import pointerEvents from "../pointer";
import {
    name as wheelEventName
} from "./wheel";
var MANAGER_EVENT = "dxEventManager";
var EMITTER_DATA = "dxEmitter";
var EventManager = Class.inherit({
    ctor: function() {
        this._attachHandlers();
        this.reset();
        this._proxiedCancelHandler = this._cancelHandler.bind(this);
        this._proxiedAcceptHandler = this._acceptHandler.bind(this)
    },
    _attachHandlers: function() {
        readyCallbacks.add(function() {
            var document = domAdapter.getDocument();
            eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
            eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
            eventsEngine.subscribeGlobal(document, addNamespace([pointerEvents.up, pointerEvents.cancel].join(" "), MANAGER_EVENT), this._pointerUpHandler.bind(this));
            eventsEngine.subscribeGlobal(document, addNamespace(wheelEventName, MANAGER_EVENT), this._mouseWheelHandler.bind(this))
        }.bind(this))
    },
    _eachEmitter: function(callback) {
        var activeEmitters = this._activeEmitters || [];
        var i = 0;
        while (activeEmitters.length > i) {
            var emitter = activeEmitters[i];
            if (false === callback(emitter)) {
                break
            }
            if (activeEmitters[i] === emitter) {
                i++
            }
        }
    },
    _applyToEmitters: function(method, arg) {
        this._eachEmitter((function(emitter) {
            emitter[method].call(emitter, arg)
        }))
    },
    reset: function() {
        this._eachEmitter(this._proxiedCancelHandler);
        this._activeEmitters = []
    },
    resetEmitter: function(emitter) {
        this._proxiedCancelHandler(emitter)
    },
    _pointerDownHandler: function(e) {
        if (isMouseEvent(e) && e.which > 1) {
            return
        }
        this._updateEmitters(e)
    },
    _updateEmitters: function(e) {
        if (!this._isSetChanged(e)) {
            return
        }
        this._cleanEmitters(e);
        this._fetchEmitters(e)
    },
    _isSetChanged: function(e) {
        var currentSet = this._closestEmitter(e);
        var previousSet = this._emittersSet || [];
        var setChanged = currentSet.length !== previousSet.length;
        each(currentSet, (function(index, emitter) {
            setChanged = setChanged || previousSet[index] !== emitter;
            return !setChanged
        }));
        this._emittersSet = currentSet;
        return setChanged
    },
    _closestEmitter: function(e) {
        var that = this;
        var result = [];
        var $element = $(e.target);

        function handleEmitter(_, emitter) {
            if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
                emitter.addCancelCallback(that._proxiedCancelHandler);
                emitter.addAcceptCallback(that._proxiedAcceptHandler);
                result.push(emitter)
            }
        }
        while ($element.length) {
            var emitters = elementData($element.get(0), EMITTER_DATA) || [];
            each(emitters, handleEmitter);
            $element = $element.parent()
        }
        return result
    },
    _acceptHandler: function(acceptedEmitter, e) {
        var that = this;
        this._eachEmitter((function(emitter) {
            if (emitter !== acceptedEmitter) {
                that._cancelEmitter(emitter, e)
            }
        }))
    },
    _cancelHandler: function(canceledEmitter, e) {
        this._cancelEmitter(canceledEmitter, e)
    },
    _cancelEmitter: function(emitter, e) {
        var activeEmitters = this._activeEmitters;
        if (e) {
            emitter.cancel(e)
        } else {
            emitter.reset()
        }
        emitter.removeCancelCallback();
        emitter.removeAcceptCallback();
        var emitterIndex = inArray(emitter, activeEmitters);
        if (emitterIndex > -1) {
            activeEmitters.splice(emitterIndex, 1)
        }
    },
    _cleanEmitters: function(e) {
        this._applyToEmitters("end", e);
        this.reset(e)
    },
    _fetchEmitters: function(e) {
        this._activeEmitters = this._emittersSet.slice();
        this._applyToEmitters("start", e)
    },
    _pointerMoveHandler: function(e) {
        this._applyToEmitters("move", e)
    },
    _pointerUpHandler: function(e) {
        this._updateEmitters(e)
    },
    _mouseWheelHandler: function(e) {
        if (!this._allowInterruptionByMouseWheel()) {
            return
        }
        e.pointers = [null];
        this._pointerDownHandler(e);
        this._adjustWheelEvent(e);
        this._pointerMoveHandler(e);
        e.pointers = [];
        this._pointerUpHandler(e)
    },
    _allowInterruptionByMouseWheel: function() {
        var allowInterruption = true;
        this._eachEmitter((function(emitter) {
            allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
            return allowInterruption
        }));
        return allowInterruption
    },
    _adjustWheelEvent: function(e) {
        var closestGestureEmitter = null;
        this._eachEmitter((function(emitter) {
            if (!emitter.gesture) {
                return
            }
            var direction = emitter.getDirection(e);
            if ("horizontal" !== direction && !e.shiftKey || "vertical" !== direction && e.shiftKey) {
                closestGestureEmitter = emitter;
                return false
            }
        }));
        if (!closestGestureEmitter) {
            return
        }
        var direction = closestGestureEmitter.getDirection(e);
        var verticalGestureDirection = "both" === direction && !e.shiftKey || "vertical" === direction;
        var prop = verticalGestureDirection ? "pageY" : "pageX";
        e[prop] += e.delta
    },
    isActive: function(element) {
        var result = false;
        this._eachEmitter((function(emitter) {
            result = result || emitter.getElement().is(element)
        }));
        return result
    }
});
var eventManager = new EventManager;
var EMITTER_SUBSCRIPTION_DATA = "dxEmitterSubscription";
var registerEmitter = function(emitterConfig) {
    var emitterClass = emitterConfig.emitter;
    var emitterName = emitterConfig.events[0];
    var emitterEvents = emitterConfig.events;
    each(emitterEvents, (function(_, eventName) {
        registerEvent(eventName, {
            noBubble: !emitterConfig.bubble,
            setup: function(element) {
                var subscriptions = elementData(element, EMITTER_SUBSCRIPTION_DATA) || {};
                var emitters = elementData(element, EMITTER_DATA) || {};
                var emitter = emitters[emitterName] || new emitterClass(element);
                subscriptions[eventName] = true;
                emitters[emitterName] = emitter;
                elementData(element, EMITTER_DATA, emitters);
                elementData(element, EMITTER_SUBSCRIPTION_DATA, subscriptions)
            },
            add: function(element, handleObj) {
                var emitters = elementData(element, EMITTER_DATA);
                var emitter = emitters[emitterName];
                emitter.configure(extend({
                    delegateSelector: handleObj.selector
                }, handleObj.data), handleObj.type)
            },
            teardown: function(element) {
                var subscriptions = elementData(element, EMITTER_SUBSCRIPTION_DATA);
                var emitters = elementData(element, EMITTER_DATA);
                var emitter = emitters[emitterName];
                delete subscriptions[eventName];
                var disposeEmitter = true;
                each(emitterEvents, (function(_, eventName) {
                    disposeEmitter = disposeEmitter && !subscriptions[eventName];
                    return disposeEmitter
                }));
                if (disposeEmitter) {
                    if (eventManager.isActive(element)) {
                        eventManager.resetEmitter(emitter)
                    }
                    emitter && emitter.dispose();
                    delete emitters[emitterName]
                }
            }
        })
    }))
};
export default registerEmitter;
