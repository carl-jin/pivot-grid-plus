/**
 * DevExtreme (esm/integration/jquery/element_data.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import jQuery from "jquery";
import {
    setDataStrategy
} from "../../core/element_data";
import useJQueryFn from "./use_jquery";
var useJQuery = useJQueryFn();
if (useJQuery) {
    setDataStrategy(jQuery)
}
