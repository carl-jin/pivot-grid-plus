/**
 * DevExtreme (esm/format_helper.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isString,
    isNumeric,
    isFunction,
    isDefined,
    isDate,
    isPlainObject
} from "./core/utils/type";
import dateUtils from "./core/utils/date";
import numberLocalization from "./localization/number";
import dateLocalization from "./localization/date";
import dependencyInjector from "./core/utils/dependency_injector";
import "./localization/currency";
export default dependencyInjector({
    format: function(value, _format) {
        var formatIsValid = isString(_format) && "" !== _format || isPlainObject(_format) || isFunction(_format);
        var valueIsValid = isNumeric(value) || isDate(value);
        if (!formatIsValid || !valueIsValid) {
            return isDefined(value) ? value.toString() : ""
        }
        if (isFunction(_format)) {
            return _format(value)
        }
        if (isString(_format)) {
            _format = {
                type: _format
            }
        }
        if (isNumeric(value)) {
            return numberLocalization.format(value, _format)
        }
        if (isDate(value)) {
            return dateLocalization.format(value, _format)
        }
    },
    getTimeFormat: function(showSecond) {
        return showSecond ? "longtime" : "shorttime"
    },
    _normalizeFormat: function(format) {
        if (!Array.isArray(format)) {
            return format
        }
        if (1 === format.length) {
            return format[0]
        }
        return function(date) {
            return format.map((function(formatPart) {
                return dateLocalization.format(date, formatPart)
            })).join(" ")
        }
    },
    getDateFormatByDifferences: function(dateDifferences, intervalFormat) {
        var resultFormat = [];
        var needSpecialSecondFormatter = intervalFormat && dateDifferences.millisecond && !(dateDifferences.year || dateDifferences.month || dateDifferences.day);
        if (needSpecialSecondFormatter) {
            resultFormat.push((function(date) {
                return date.getSeconds() + date.getMilliseconds() / 1e3 + "s"
            }))
        } else if (dateDifferences.millisecond) {
            resultFormat.push("millisecond")
        }
        if (dateDifferences.hour || dateDifferences.minute || !needSpecialSecondFormatter && dateDifferences.second) {
            resultFormat.unshift(this.getTimeFormat(dateDifferences.second))
        }
        if (dateDifferences.year && dateDifferences.month && dateDifferences.day) {
            if (intervalFormat && "month" === intervalFormat) {
                return "monthandyear"
            } else {
                resultFormat.unshift("shortdate");
                return this._normalizeFormat(resultFormat)
            }
        }
        if (dateDifferences.year && dateDifferences.month) {
            return "monthandyear"
        }
        if (dateDifferences.year && dateDifferences.quarter) {
            return "quarterandyear"
        }
        if (dateDifferences.year) {
            return "year"
        }
        if (dateDifferences.quarter) {
            return "quarter"
        }
        if (dateDifferences.month && dateDifferences.day) {
            if (intervalFormat) {
                resultFormat.unshift((function(date) {
                    return dateLocalization.getMonthNames("abbreviated")[date.getMonth()] + " " + dateLocalization.format(date, "day")
                }))
            } else {
                resultFormat.unshift("monthandday")
            }
            return this._normalizeFormat(resultFormat)
        }
        if (dateDifferences.month) {
            return "month"
        }
        if (dateDifferences.day) {
            if (intervalFormat) {
                resultFormat.unshift("day")
            } else {
                resultFormat.unshift((function(date) {
                    return dateLocalization.format(date, "dayofweek") + ", " + dateLocalization.format(date, "day")
                }))
            }
            return this._normalizeFormat(resultFormat)
        }
        return this._normalizeFormat(resultFormat)
    },
    getDateFormatByTicks: function(ticks) {
        var maxDiff;
        var currentDiff;
        var i;
        if (ticks.length > 1) {
            maxDiff = dateUtils.getDatesDifferences(ticks[0], ticks[1]);
            for (i = 1; i < ticks.length - 1; i++) {
                currentDiff = dateUtils.getDatesDifferences(ticks[i], ticks[i + 1]);
                if (maxDiff.count < currentDiff.count) {
                    maxDiff = currentDiff
                }
            }
        } else {
            maxDiff = {
                year: true,
                month: true,
                day: true,
                hour: ticks[0].getHours() > 0,
                minute: ticks[0].getMinutes() > 0,
                second: ticks[0].getSeconds() > 0,
                millisecond: ticks[0].getMilliseconds() > 0
            }
        }
        var resultFormat = this.getDateFormatByDifferences(maxDiff);
        return resultFormat
    },
    getDateFormatByTickInterval: function(startValue, endValue, tickInterval) {
        var dateUnitInterval;
        var correctDateDifferences = function(dateDifferences, tickInterval, value) {
            switch (tickInterval) {
                case "year":
                case "quarter":
                    dateDifferences.month = value;
                case "month":
                    dateDifferences.day = value;
                case "week":
                case "day":
                    dateDifferences.hour = value;
                case "hour":
                    dateDifferences.minute = value;
                case "minute":
                    dateDifferences.second = value;
                case "second":
                    dateDifferences.millisecond = value
            }
        };
        tickInterval = isString(tickInterval) ? tickInterval.toLowerCase() : tickInterval;
        var dateDifferences = dateUtils.getDatesDifferences(startValue, endValue);
        if (startValue !== endValue) {
            ! function(differences, minDate, maxDate) {
                if (!maxDate.getMilliseconds() && maxDate.getSeconds()) {
                    if (maxDate.getSeconds() - minDate.getSeconds() === 1) {
                        differences.millisecond = true;
                        differences.second = false
                    }
                } else if (!maxDate.getSeconds() && maxDate.getMinutes()) {
                    if (maxDate.getMinutes() - minDate.getMinutes() === 1) {
                        differences.second = true;
                        differences.minute = false
                    }
                } else if (!maxDate.getMinutes() && maxDate.getHours()) {
                    if (maxDate.getHours() - minDate.getHours() === 1) {
                        differences.minute = true;
                        differences.hour = false
                    }
                } else if (!maxDate.getHours() && maxDate.getDate() > 1) {
                    if (maxDate.getDate() - minDate.getDate() === 1) {
                        differences.hour = true;
                        differences.day = false
                    }
                } else if (1 === maxDate.getDate() && maxDate.getMonth()) {
                    if (maxDate.getMonth() - minDate.getMonth() === 1) {
                        differences.day = true;
                        differences.month = false
                    }
                } else if (!maxDate.getMonth() && maxDate.getFullYear()) {
                    if (maxDate.getFullYear() - minDate.getFullYear() === 1) {
                        differences.month = true;
                        differences.year = false
                    }
                }
            }(dateDifferences, startValue > endValue ? endValue : startValue, startValue > endValue ? startValue : endValue)
        }
        dateUnitInterval = dateUtils.getDateUnitInterval(dateDifferences);
        correctDateDifferences(dateDifferences, dateUnitInterval, true);
        dateUnitInterval = dateUtils.getDateUnitInterval(tickInterval || "second");
        correctDateDifferences(dateDifferences, dateUnitInterval, false);
        dateDifferences[{
            week: "day"
        } [dateUnitInterval] || dateUnitInterval] = true;
        var resultFormat = this.getDateFormatByDifferences(dateDifferences);
        return resultFormat
    }
});
