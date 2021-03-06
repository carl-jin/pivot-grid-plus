/**
 * DevExtreme (esm/renovation/utils/type_conversion.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
export function toNumber(attribute) {
    return attribute ? Number(attribute.replace("px", "")) : 0
}
