/**
 * DevExtreme (esm/ui/range_slider.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import eventsEngine from "../events/core/events_engine";
import Slider from "./slider";
import SliderHandle from "./slider/ui.slider_handle";
import registerComponent from "../core/component_registrator";
import {
    extend
} from "../core/utils/extend";
import {
    applyServerDecimalSeparator
} from "../core/utils/common";
import {
    eventData
} from "../events/utils/index";
import messageLocalization from "../localization/message";
var RANGE_SLIDER_CLASS = "dx-rangeslider";
var RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + "-start-handle";
var RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + "-end-handle";
var RangeSlider = Slider.inherit({
    _supportedKeys: function() {
        var isRTL = this.option("rtlEnabled");
        var that = this;
        var _changeHandle = function(e, capturedHandle) {
            if (that.option("start") === that.option("end")) {
                that._capturedHandle = capturedHandle;
                e.target = that._capturedHandle;
                eventsEngine.trigger(that._capturedHandle, "focus")
            }
        };
        var _setHandleValue = function(e, step, sign) {
            var isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
            var valueOption = isStart ? "start" : "end";
            var val = that.option(valueOption);
            step = that._valueStep(step);
            val += sign * (isRTL ? -step : step);
            that.option(valueOption, val)
        };
        var moveHandleRight = function(e, step) {
            _changeHandle(e, isRTL ? that._$handleStart : that._$handleEnd);
            _setHandleValue(e, step, 1)
        };
        var moveHandleLeft = function(e, step) {
            _changeHandle(e, isRTL ? that._$handleEnd : that._$handleStart);
            _setHandleValue(e, step, -1)
        };
        return extend(this.callBase(), {
            leftArrow: function(e) {
                this._processKeyboardEvent(e);
                moveHandleLeft(e, this.option("step"))
            },
            rightArrow: function(e) {
                this._processKeyboardEvent(e);
                moveHandleRight(e, this.option("step"))
            },
            pageUp: function(e) {
                this._processKeyboardEvent(e);
                moveHandleRight(e, this.option("step") * this.option("keyStep"))
            },
            pageDown: function(e) {
                this._processKeyboardEvent(e);
                moveHandleLeft(e, this.option("step") * this.option("keyStep"))
            },
            home: function(e) {
                this._processKeyboardEvent(e);
                var isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
                var valueOption = isStart ? "start" : "end";
                var startOption = isStart ? "min" : "start";
                var val = this.option(startOption);
                this.option(valueOption, val)
            },
            end: function(e) {
                this._processKeyboardEvent(e);
                var isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
                var valueOption = isStart ? "start" : "end";
                var endOption = isStart ? "end" : "max";
                var val = this.option(endOption);
                this.option(valueOption, val)
            }
        })
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            start: 40,
            end: 60,
            value: [40, 60],
            startName: "",
            endName: ""
        })
    },
    _renderSubmitElement: function() {
        var $element = this.$element();
        this._$submitStartElement = $("<input>").attr("type", "hidden").attr("name", this.option("startName")).appendTo($element);
        this._$submitEndElement = $("<input>").attr("type", "hidden").attr("name", this.option("endName")).appendTo($element)
    },
    _initOptions: function(options) {
        this.callBase(options);
        var initialValue = this.initialOption("value");
        var value = this.option("value");
        if (value[0] === initialValue[0] && value[1] === initialValue[1]) {
            this.option("value", [this.option("start"), this.option("end")])
        } else {
            this.option({
                start: value[0],
                end: value[1]
            })
        }
    },
    _initMarkup: function() {
        this.$element().addClass(RANGE_SLIDER_CLASS);
        this.callBase()
    },
    _renderContentImpl: function() {
        this._callHandlerMethod("repaint");
        this.callBase()
    },
    _renderHandle: function() {
        this._$handleStart = this._renderHandleImpl(this.option("start"), this._$handleStart).addClass(RANGE_SLIDER_START_HANDLE_CLASS);
        this._$handleEnd = this._renderHandleImpl(this.option("end"), this._$handleEnd).addClass(RANGE_SLIDER_END_HANDLE_CLASS);
        this._updateHandleAriaLabels()
    },
    _startHandler: function(args) {
        var e = args.event;
        var $range = this._$range;
        var rangeWidth = $range.width();
        var eventOffsetX = eventData(e).x - this._$bar.offset().left;
        var startHandleX = $range.position().left;
        var endHandleX = $range.position().left + rangeWidth;
        var rtlEnabled = this.option("rtlEnabled");
        var startHandleIsClosest = (rtlEnabled ? -1 : 1) * ((startHandleX + endHandleX) / 2 - eventOffsetX) > 0;
        this._capturedHandle = startHandleIsClosest ? this._$handleStart : this._$handleEnd;
        this.callBase(args)
    },
    _updateHandleAriaLabels: function() {
        this.setAria("label", messageLocalization.getFormatter("dxRangeSlider-ariaFrom")(this.option("dxRangeSlider-ariaFrom")), this._$handleStart);
        this.setAria("label", messageLocalization.getFormatter("dxRangeSlider-ariaTill")(this.option("dxRangeSlider-ariaTill")), this._$handleEnd)
    },
    _activeHandle: function() {
        return this._capturedHandle
    },
    _updateHandlePosition: function(e) {
        var rtlEnabled = this.option("rtlEnabled");
        var offsetDirection = rtlEnabled ? -1 : 1;
        var max = this.option("max");
        var min = this.option("min");
        var newRatio = this._startOffset + offsetDirection * e.event.offset / this._swipePixelRatio();
        newRatio = newRatio.toPrecision(12);
        var newValue = newRatio * (max - min) + min;
        this._updateSelectedRangePosition(newRatio, newRatio);
        SliderHandle.getInstance(this._activeHandle()).fitTooltipPosition;
        this._changeValueOnSwipe(newRatio);
        var startValue = this.option("start");
        var endValue = this.option("end");
        var $nextHandle;
        if (startValue === endValue) {
            if (newValue < startValue) {
                $nextHandle = this._$handleStart
            } else {
                $nextHandle = this._$handleEnd
            }
            eventsEngine.trigger($nextHandle, "focus");
            if ($nextHandle && $nextHandle !== this._capturedHandle) {
                this._updateSelectedRangePosition((startValue - min) / (max - min), (endValue - min) / (max - min));
                this._toggleActiveState(this._activeHandle(), false);
                this._toggleActiveState($nextHandle, true);
                this._capturedHandle = $nextHandle
            }
            this._updateSelectedRangePosition(newRatio, newRatio);
            this._changeValueOnSwipe(newRatio)
        }
    },
    _updateSelectedRangePosition: function(leftRatio, rightRatio) {
        var rtlEnabled = this.option("rtlEnabled");
        var moveRight = this._capturedHandle === this._$handleStart && rtlEnabled || this._capturedHandle === this._$handleEnd && !rtlEnabled;
        var prop = moveRight ? "right" : "left";
        if (rtlEnabled ^ moveRight) {
            this._$range.css(prop, 100 - 100 * rightRatio + "%")
        } else {
            this._$range.css(prop, 100 * leftRatio + "%")
        }
    },
    _setValueOnSwipe: function(value) {
        var option = this._capturedHandle === this._$handleStart ? "start" : "end";
        var start = this.option("start");
        var end = this.option("end");
        var max = this.option("max");
        var min = this.option("min");
        start = Math.min(Math.max(start, min), max);
        end = Math.min(Math.max(end, min), max);
        if ("start" === option) {
            start = value > end ? end : value
        } else {
            end = value < start ? start : value
        }
        this.option("value", [start, end])
    },
    _renderValue: function() {
        var valStart = this.option("start");
        var valEnd = this.option("end");
        var min = this.option("min");
        var max = this.option("max");
        var rtlEnabled = this.option("rtlEnabled");
        valStart = Math.max(min, Math.min(valStart, max));
        valEnd = Math.max(valStart, Math.min(valEnd, max));
        this._setOptionWithoutOptionChange("start", valStart);
        this._setOptionWithoutOptionChange("end", valEnd);
        this._setOptionWithoutOptionChange("value", [valStart, valEnd]);
        this._$submitStartElement.val(applyServerDecimalSeparator(valStart));
        this._$submitEndElement.val(applyServerDecimalSeparator(valEnd));
        var ratio1 = max === min ? 0 : (valStart - min) / (max - min);
        var ratio2 = max === min ? 0 : (valEnd - min) / (max - min);
        var startOffset = parseFloat((100 * ratio1).toPrecision(12)) + "%";
        var endOffset = parseFloat((100 * (1 - ratio2)).toPrecision(12)) + "%";
        !this._needPreventAnimation && this._setRangeStyles({
            right: rtlEnabled ? startOffset : endOffset,
            left: rtlEnabled ? endOffset : startOffset
        });
        SliderHandle.getInstance(this._$handleStart).option("value", valStart);
        SliderHandle.getInstance(this._$handleEnd).option("value", valEnd)
    },
    _callHandlerMethod: function(name, args) {
        SliderHandle.getInstance(this._$handleStart)[name](args);
        SliderHandle.getInstance(this._$handleEnd)[name](args)
    },
    _setValueOption: function() {
        var start = this.option("start");
        var end = this.option("end");
        this.option("value", [start, end])
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "value":
                if (args.value[0] === args.previousValue[0] && args.value[1] === args.previousValue[1]) {
                    break
                }
                this._setOptionWithoutOptionChange("start", args.value[0]);
                this._setOptionWithoutOptionChange("end", args.value[1]);
                this._renderValue();
                var start = this.option("start");
                var end = this.option("end");
                this._createActionByOption("onValueChanged", {
                    excludeValidators: ["disabled", "readOnly"]
                })({
                    start: start,
                    end: end,
                    value: [start, end],
                    event: this._valueChangeEventInstance
                });
                this.validationRequest.fire({
                    value: [start, end],
                    editor: this
                });
                this._saveValueChangeEvent(void 0);
                break;
            case "start":
            case "end":
                this._setValueOption();
                break;
            case "startName":
                this._$submitStartElement.attr("name", args.value);
                break;
            case "endName":
                this._$submitEndElement.attr("name", args.value);
                break;
            case "name":
                break;
            default:
                this.callBase(args)
        }
    }
});
registerComponent("dxRangeSlider", RangeSlider);
export default RangeSlider;
