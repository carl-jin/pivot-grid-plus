/**
 * DevExtreme (esm/integration/jquery/element.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    setPublicElementWrapper
} from "../../core/element";
import useJQueryFn from "./use_jquery";
var useJQuery = useJQueryFn();
var getPublicElement = function($element) {
    return $element
};
if (useJQuery) {
    setPublicElementWrapper(getPublicElement)
}
