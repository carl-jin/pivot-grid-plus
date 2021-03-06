/**
 * DevExtreme (esm/viz/translators/datetime_translator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import dateUtils from "../../core/utils/date";

function parse(value) {
    return null !== value ? new Date(value) : value
}
export default {
    fromValue: parse,
    toValue: parse,
    _add: dateUtils.addDateInterval,
    convert: dateUtils.dateToMilliseconds
};
