/**
 * DevExtreme (esm/ui/scheduler/header/navigator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../../core/renderer";
import {
    noop
} from "../../../core/utils/common";
import {
    isNumeric,
    isDefined,
    isFunction
} from "../../../core/utils/type";
import errors from "../../widget/ui.errors";
import dateUtils from "../../../core/utils/date";
import {
    extend
} from "../../../core/utils/extend";
import registerComponent from "../../../core/component_registrator";
import devices from "../../../core/devices";
import Widget from "../../widget/ui.widget";
import Button from "../../button";
import Calendar from "../../calendar";
import Popover from "../../popover";
import Popup from "../../popup";
import publisherMixin from "../publisher_mixin";
import dateLocalization from "../../../localization/date";
import Scrollable from "../../scroll_view/ui.scrollable";
var ELEMENT_CLASS = "dx-scheduler-navigator";
var CALENDAR_CLASS = "dx-scheduler-navigator-calendar";
var NEXT_BUTTON_CLASS = "dx-scheduler-navigator-next";
var CAPTION_BUTTON_CLASS = "dx-scheduler-navigator-caption";
var PREVIOUS_BUTTON_CLASS = "dx-scheduler-navigator-previous";
var CALENDAR_POPOVER_CLASS = "dx-scheduler-navigator-calendar-popover";
var MONDAY_INDEX = 1;
var getDefaultFirstDayOfWeekIndex = function(shift) {
    return shift ? MONDAY_INDEX : dateLocalization.firstDayOfWeekIndex()
};
var getDateMonthFormat = function(short) {
    return function(date) {
        var monthName = dateLocalization.getMonthNames(short ? "abbreviated" : "wide")[date.getMonth()];
        return [dateLocalization.format(date, "day"), monthName].join(" ")
    }
};
var getMonthYearFormat = function(date) {
    return dateLocalization.getMonthNames("abbreviated")[date.getMonth()] + " " + dateLocalization.format(date, "year")
};
var getCaptionFormat = function getCaptionFormat(short, intervalCount, duration) {
    var dateMonthFormat = getDateMonthFormat(short);
    return function(date) {
        if (intervalCount > 1) {
            var lastIntervalDate = new Date(date);
            var defaultViewDuration = duration;
            lastIntervalDate.setDate(date.getDate() + defaultViewDuration - 1);
            var isDifferentMonthDates = date.getMonth() !== lastIntervalDate.getMonth();
            var useShortFormat = isDifferentMonthDates || short;
            var firstWeekDateText = dateLocalization.format(date, isDifferentMonthDates ? getDateMonthFormat(useShortFormat) : "d");
            var lastWeekDateText = dateLocalization.format(lastIntervalDate, getCaptionFormat(useShortFormat));
            return firstWeekDateText + "-" + lastWeekDateText
        }
        return [dateMonthFormat(date), dateLocalization.format(date, "year")].join(" ")
    }
};
var getWeekCaption = function(date, shift, rejectWeekend) {
    var firstDayOfWeek = this.option("firstDayOfWeek");
    var firstDayOfWeekIndex = isDefined(firstDayOfWeek) ? firstDayOfWeek : getDefaultFirstDayOfWeekIndex(shift);
    if (0 === firstDayOfWeekIndex && rejectWeekend) {
        firstDayOfWeekIndex = MONDAY_INDEX
    }
    var firstWeekDate = dateUtils.getFirstWeekDate(date, firstDayOfWeekIndex);
    if (rejectWeekend) {
        firstWeekDate = dateUtils.normalizeDateByWeek(firstWeekDate, date)
    }
    if (firstDayOfWeek >= 6 && rejectWeekend) {
        firstWeekDate.setDate(firstWeekDate.getDate() + (7 - firstDayOfWeek + 1))
    }
    var lastWeekDate = new Date(firstWeekDate);
    var intervalCount = this.option("intervalCount");
    shift = shift || 6;
    lastWeekDate = new Date(lastWeekDate.setDate(lastWeekDate.getDate() + (intervalCount > 1 ? 7 * (intervalCount - 1) + shift : shift)));
    if (lastWeekDate.getDay() % 6 === 0 && rejectWeekend) {
        lastWeekDate.setDate(lastWeekDate.getDate() + 2)
    }
    return {
        text: formatCaptionByMonths.call(this, lastWeekDate, firstWeekDate),
        startDate: firstWeekDate,
        endDate: lastWeekDate
    }
};
var formatCaptionByMonths = function(lastDate, firstDate) {
    var isDifferentMonthDates = firstDate.getMonth() !== lastDate.getMonth();
    var isDifferentYears = firstDate.getFullYear() !== lastDate.getFullYear();
    var useShortFormat = isDifferentMonthDates || this.option("_useShortDateFormat");
    var lastDateText;
    var firstDateText;
    if (isDifferentYears) {
        firstDateText = dateLocalization.format(firstDate, getCaptionFormat(true));
        lastDateText = dateLocalization.format(lastDate, getCaptionFormat(true))
    } else {
        firstDateText = dateLocalization.format(firstDate, isDifferentMonthDates ? getDateMonthFormat(useShortFormat) : "d");
        lastDateText = dateLocalization.format(lastDate, getCaptionFormat(useShortFormat))
    }
    return firstDateText + "-" + lastDateText
};
var getMonthCaption = function(date) {
    var firstDate = new Date(dateUtils.getFirstMonthDate(date));
    var lastDate = new Date(dateUtils.getLastMonthDate(firstDate));
    var text;
    if (this.option("intervalCount") > 1) {
        lastDate = new Date(firstDate);
        lastDate.setMonth(firstDate.getMonth() + this.option("intervalCount") - 1);
        lastDate = new Date(dateUtils.getLastMonthDate(lastDate));
        var isSameYear = firstDate.getYear() === lastDate.getYear();
        var lastDateText = getMonthYearFormat(lastDate);
        var firstDateText = isSameYear ? dateLocalization.getMonthNames("abbreviated")[firstDate.getMonth()] : getMonthYearFormat(firstDate);
        text = firstDateText + "-" + lastDateText
    } else {
        text = dateLocalization.format(date, "monthandyear")
    }
    return {
        text: text,
        startDate: firstDate,
        endDate: lastDate
    }
};
var dateGetter = function(date, offset) {
    return new Date(date[this.setter](date[this.getter]() + offset))
};
var getConfig = function(step) {
    var agendaDuration;
    switch (step) {
        case "day":
            return {
                duration: 1 * this.option("intervalCount"), setter: "setDate", getter: "getDate", getDate: dateGetter, getCaption: function(date) {
                    var format = getCaptionFormat(false, this.option("intervalCount"), this._getConfig().duration);
                    return {
                        text: dateLocalization.format(date, format),
                        startDate: date,
                        endDate: date
                    }
                }
            };
        case "week":
            return {
                duration: 7 * this.option("intervalCount"), setter: "setDate", getter: "getDate", getDate: dateGetter, getCaption: getWeekCaption
            };
        case "workWeek":
            return {
                duration: 7 * this.option("intervalCount"), setter: "setDate", getter: "getDate", getDate: dateGetter, getCaption: function(date) {
                    return getWeekCaption.call(this, date, 4, true)
                }
            };
        case "month":
            return {
                duration: 1 * this.option("intervalCount"), setter: "setMonth", getter: "getMonth", getDate: function(date, offset) {
                    var currentDate = date.getDate();
                    date.setDate(1);
                    date = dateGetter.call(this, date, offset);
                    var lastDate = dateUtils.getLastMonthDay(date);
                    date.setDate(currentDate < lastDate ? currentDate : lastDate);
                    return date
                }, getCaption: getMonthCaption
            };
        case "agenda":
            agendaDuration = this.invoke("getAgendaDuration");
            agendaDuration = isNumeric(agendaDuration) && agendaDuration > 0 ? agendaDuration : 7;
            return {
                duration: agendaDuration, setter: "setDate", getter: "getDate", getDate: dateGetter, getCaption: function(date) {
                    var format = getCaptionFormat(this.option("_useShortDateFormat"));
                    var firstDate = new Date(date);
                    var lastDate = new Date(date);
                    var text;
                    if (agendaDuration > 1) {
                        lastDate.setDate(lastDate.getDate() + agendaDuration - 1);
                        text = formatCaptionByMonths.call(this, lastDate, date)
                    } else {
                        text = dateLocalization.format(date, format)
                    }
                    return {
                        text: text,
                        startDate: firstDate,
                        endDate: lastDate
                    }
                }
            }
    }
};
export var Navigator = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            date: new Date,
            displayedDate: void 0,
            step: "day",
            intervalCount: 1,
            min: void 0,
            max: void 0,
            firstDayOfWeek: void 0,
            _useShortDateFormat: false,
            todayDate: () => new Date
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return !devices.real().generic || devices.isSimulator()
            },
            options: {
                _useShortDateFormat: true
            }
        }])
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "step":
            case "date":
            case "intervalCount":
            case "displayedDate":
                this._updateButtonsState();
                this._renderCaption();
                this._setCalendarOption("value", this.option("date"));
                break;
            case "min":
            case "max":
                this._updateButtonsState();
                this._setCalendarOption(args.name, args.value);
                break;
            case "firstDayOfWeek":
                this._setCalendarOption(args.name, args.value);
                break;
            case "customizeDateNavigatorText":
                this._renderCaption();
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._next.option(args.name, args.value);
                this._caption.option(args.name, args.value);
                this._prev.option(args.name, args.value);
                this._setCalendarOption(args.name, args.value);
                this.callBase(args);
                break;
            case "_useShortDateFormat":
                break;
            default:
                this.callBase(args)
        }
    },
    _init: function() {
        this.callBase();
        this.$element().addClass(ELEMENT_CLASS);
        this._initButtons()
    },
    _initButtons: function() {
        var $next = $("<div>").addClass(NEXT_BUTTON_CLASS);
        this._next = this._createComponent($next, Button, {
            icon: "chevronnext",
            onClick: this._updateCurrentDate.bind(this, 1),
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });
        var $caption = $("<div>").addClass(CAPTION_BUTTON_CLASS);
        this._caption = this._createComponent($caption, Button, {
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });
        var $prev = $("<div>").addClass(PREVIOUS_BUTTON_CLASS);
        this._prev = this._createComponent($prev, Button, {
            icon: "chevronprev",
            onClick: this._updateCurrentDate.bind(this, -1),
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });
        this.setAria("label", "Next period", $next);
        this.setAria("label", "Previous period", $prev);
        this._updateButtonsState();
        this.$element().append($prev, $caption, $next)
    },
    _updateButtonsState: function() {
        var min = this.option("min");
        var max = this.option("max");
        var caption = this._getConfig().getCaption.call(this, this.option("displayedDate") || this.option("date"));
        min = min ? dateUtils.trimTime(min) : min;
        max = max ? dateUtils.trimTime(max) : max;
        max && max.setHours(23, 59, 59);
        this._prev.option("disabled", min && !isNaN(min.getTime()) && this._getNextDate(-1, caption.endDate) < min);
        this._next.option("disabled", max && !isNaN(max.getTime()) && this._getNextDate(1, caption.startDate) > max)
    },
    _updateCurrentDate: function(direction) {
        var date = this._getNextDate(direction);
        dateUtils.normalizeDate(date, this.option("min"), this.option("max"));
        this.notifyObserver("currentDateUpdated", date)
    },
    _getNextDate: function(direction) {
        var initialDate = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        var stepConfig = this._getConfig();
        var offset = stepConfig.duration * direction;
        var date = stepConfig.getDate(new Date(initialDate || this.option("date")), offset);
        return date
    },
    _renderFocusTarget: noop,
    _initMarkup: function() {
        this.callBase();
        this._renderCaption()
    },
    _render: function() {
        this.callBase();
        this._renderPopover();
        this._renderCaptionKeys()
    },
    _isMobileLayout: function() {
        return !devices.current().generic
    },
    _renderPopover: function() {
        var overlayType = this._isMobileLayout() ? Popup : Popover;
        var popoverContainer = $("<div>").addClass(CALENDAR_POPOVER_CLASS);
        this._popover = this._createComponent(popoverContainer, overlayType, {
            contentTemplate: () => this._createPopupContent(),
            defaultOptionsRules: [{
                device: function() {
                    return !devices.current().generic
                },
                options: {
                    fullScreen: true,
                    showCloseButton: false,
                    toolbarItems: [{
                        shortcut: "cancel"
                    }]
                }
            }, {
                device: function() {
                    return devices.current().generic
                },
                options: {
                    target: this._caption.$element()
                }
            }]
        });
        this._popover.$element().appendTo(this.$element())
    },
    _createScrollable: function(content) {
        var result = this._createComponent($("<div>"), Scrollable, {
            direction: "vertical"
        });
        result.$content().append(content);
        return result
    },
    _createPopupContent: function() {
        var result = $("<div>").addClass(CALENDAR_CLASS);
        this._calendar = this._createComponent(result, Calendar, this._calendarOptions());
        if (this._isMobileLayout()) {
            var scrollable = this._createScrollable(result);
            return scrollable.$element()
        }
        return result
    },
    _calendarOptions: function() {
        return {
            min: this.option("min"),
            max: this.option("max"),
            firstDayOfWeek: this.option("firstDayOfWeek"),
            value: this.option("date"),
            _todayDate: this.option("todayDate"),
            focusStateEnabled: this.option("focusStateEnabled"),
            onValueChanged: function(e) {
                if (!this.option("visible")) {
                    return
                }
                this.notifyObserver("currentDateUpdated", e.value);
                this._popover.hide()
            }.bind(this),
            hasFocus: function() {
                return true
            },
            tabIndex: null
        }
    },
    _renderCaption: function() {
        var date = this.option("displayedDate") || this.option("date");
        var captionConfig = this._getConfig().getCaption.call(this, date);
        var customizationFunction = this.option("customizeDateNavigatorText");
        var caption = isFunction(customizationFunction) ? customizationFunction(captionConfig) : captionConfig.text;
        this._caption.option({
            text: caption,
            onKeyboardHandled: opts => {
                this.option("focusStateEnabled") && !this.option("disabled") && this._calendar._keyboardHandler(opts)
            },
            onClick: () => this._popover.toggle()
        })
    },
    _renderCaptionKeys: function() {
        if (!this.option("focusStateEnabled") || this.option("disabled")) {
            return
        }
        var that = this;
        var executeHandler = function() {
            if (that._popover.$content().is(":hidden")) {
                that._popover.show()
            } else {
                return true
            }
        };
        this._caption.registerKeyHandler("enter", executeHandler);
        this._caption.registerKeyHandler("space", executeHandler);
        this._caption.registerKeyHandler("tab", (function() {
            that._popover.hide()
        }))
    },
    _setCalendarOption: function(name, value) {
        if (this._calendar) {
            this._calendar.option(name, value)
        }
    },
    _getConfig: function() {
        var step = this.option("step");
        var config = getConfig.call(this, step);
        if (!config) {
            throw errors.Error("E1033", step)
        }
        return config
    }
}).include(publisherMixin);
registerComponent("dxSchedulerNavigator", Navigator);
