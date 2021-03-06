/**
 * DevExtreme (esm/integration/jquery/use_jquery.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import jQuery from "jquery";
import config from "../../core/config";
var useJQuery = config().useJQuery;
if (jQuery && false !== useJQuery) {
    config({
        useJQuery: true
    })
}
export default function() {
    return jQuery && config().useJQuery
}
