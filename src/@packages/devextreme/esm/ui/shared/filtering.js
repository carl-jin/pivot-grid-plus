/**
 * DevExtreme (esm/ui/shared/filtering.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDate,
    isDefined
} from "../../core/utils/type";
import {
    inArray
} from "../../core/utils/array";
import {
    map
} from "../../core/utils/iterator";
var DEFAULT_DATE_INTERVAL = ["year", "month", "day"];
var DEFAULT_DATETIME_INTERVAL = ["year", "month", "day", "hour", "minute"];
var isDateType = function(dataType) {
    return "date" === dataType || "datetime" === dataType
};
var getGroupInterval = function(column) {
    var index;
    var result = [];
    var dateIntervals = ["year", "month", "day", "hour", "minute", "second"];
    var groupInterval = column.headerFilter && column.headerFilter.groupInterval;
    var interval = "quarter" === groupInterval ? "month" : groupInterval;
    if (isDateType(column.dataType) && null !== groupInterval) {
        result = "datetime" === column.dataType ? DEFAULT_DATETIME_INTERVAL : DEFAULT_DATE_INTERVAL;
        index = inArray(interval, dateIntervals);
        if (index >= 0) {
            result = dateIntervals.slice(0, index);
            result.push(groupInterval);
            return result
        }
        return result
    } else if (isDefined(groupInterval)) {
        return Array.isArray(groupInterval) ? groupInterval : [groupInterval]
    }
};
export default (function() {
    var getFilterSelector = function(column, target) {
        var selector = column.dataField || column.selector;
        if ("search" === target) {
            selector = column.displayField || column.calculateDisplayValue || selector
        }
        return selector
    };
    var getFilterExpressionByRange = function(filterValue, target) {
        var endFilterValue;
        var startFilterExpression;
        var endFilterExpression;
        var selector = getFilterSelector(this, target);
        if (Array.isArray(filterValue) && isDefined(filterValue[0]) && isDefined(filterValue[1])) {
            startFilterExpression = [selector, ">=", filterValue[0]];
            endFilterExpression = [selector, "<=", filterValue[1]];
            if (isDateType(this.dataType) && (date = filterValue[1], date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1)) {
                endFilterValue = new Date(filterValue[1].getTime());
                if ("date" === this.dataType) {
                    endFilterValue.setDate(filterValue[1].getDate() + 1)
                }
                endFilterExpression = [selector, "<", endFilterValue]
            }
            return [startFilterExpression, "and", endFilterExpression]
        }
        var date
    };
    var getFilterExpressionForDate = function(filterValue, selectedFilterOperation, target) {
        var dateStart;
        var dateEnd;
        var dateInterval;
        var values = function(dateValue) {
            if (isDate(dateValue)) {
                return [dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds()]
            }
            return map(("" + dateValue).split("/"), (function(value, index) {
                return 1 === index ? Number(value) - 1 : Number(value)
            }))
        }(filterValue);
        var selector = getFilterSelector(this, target);
        if ("headerFilter" === target) {
            dateInterval = getGroupInterval(this)[values.length - 1]
        } else if ("datetime" === this.dataType) {
            dateInterval = "minute"
        }
        switch (dateInterval) {
            case "year":
                dateStart = new Date(values[0], 0, 1);
                dateEnd = new Date(values[0] + 1, 0, 1);
                break;
            case "month":
                dateStart = new Date(values[0], values[1], 1);
                dateEnd = new Date(values[0], values[1] + 1, 1);
                break;
            case "quarter":
                dateStart = new Date(values[0], 3 * values[1], 1);
                dateEnd = new Date(values[0], 3 * values[1] + 3, 1);
                break;
            case "hour":
                dateStart = new Date(values[0], values[1], values[2], values[3]);
                dateEnd = new Date(values[0], values[1], values[2], values[3] + 1);
                break;
            case "minute":
                dateStart = new Date(values[0], values[1], values[2], values[3], values[4]);
                dateEnd = new Date(values[0], values[1], values[2], values[3], values[4] + 1);
                break;
            case "second":
                dateStart = new Date(values[0], values[1], values[2], values[3], values[4], values[5]);
                dateEnd = new Date(values[0], values[1], values[2], values[3], values[4], values[5] + 1);
                break;
            default:
                dateStart = new Date(values[0], values[1], values[2]);
                dateEnd = new Date(values[0], values[1], values[2] + 1)
        }
        switch (selectedFilterOperation) {
            case "<":
                return [selector, "<", dateStart];
            case "<=":
                return [selector, "<", dateEnd];
            case ">":
                return [selector, ">=", dateEnd];
            case ">=":
                return [selector, ">=", dateStart];
            case "<>":
                return [
                    [selector, "<", dateStart], "or", [selector, ">=", dateEnd]
                ];
            default:
                return [
                    [selector, ">=", dateStart], "and", [selector, "<", dateEnd]
                ]
        }
    };
    var getFilterExpressionForNumber = function(filterValue, selectedFilterOperation, target) {
        var selector = getFilterSelector(this, target);
        var groupInterval = getGroupInterval(this);
        if ("headerFilter" === target && groupInterval && isDefined(filterValue)) {
            var values = ("" + filterValue).split("/");
            var value = Number(values[values.length - 1]);
            var interval = groupInterval[values.length - 1];
            var startFilterValue = [selector, ">=", value];
            var endFilterValue = [selector, "<", value + interval];
            var condition = [startFilterValue, "and", endFilterValue];
            return condition
        }
        return [selector, selectedFilterOperation || "=", filterValue]
    };
    return {
        defaultCalculateFilterExpression: function(filterValue, selectedFilterOperation, target) {
            var column = this;
            var selector = getFilterSelector(column, target);
            var isSearchByDisplayValue = column.calculateDisplayValue && "search" === target;
            var dataType = isSearchByDisplayValue && column.lookup && column.lookup.dataType || column.dataType;
            var filter = null;
            if (("headerFilter" === target || "filterBuilder" === target) && null === filterValue) {
                filter = [selector, selectedFilterOperation || "=", null];
                if ("string" === dataType) {
                    filter = [filter, "=" === selectedFilterOperation ? "or" : "and", [selector, selectedFilterOperation || "=", ""]]
                }
            } else if ("string" === dataType && (!column.lookup || isSearchByDisplayValue)) {
                filter = [selector, selectedFilterOperation || "contains", filterValue]
            } else if ("between" === selectedFilterOperation) {
                return getFilterExpressionByRange.apply(column, [filterValue, target])
            } else if (isDateType(dataType) && isDefined(filterValue)) {
                return getFilterExpressionForDate.apply(column, arguments)
            } else if ("number" === dataType) {
                return getFilterExpressionForNumber.apply(column, arguments)
            } else if ("object" !== dataType) {
                filter = [selector, selectedFilterOperation || "=", filterValue]
            }
            return filter
        },
        getGroupInterval: getGroupInterval
    }
}());
