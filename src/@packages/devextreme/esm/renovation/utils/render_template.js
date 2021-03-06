/**
 * DevExtreme (esm/renovation/utils/render_template.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    render
} from "inferno";
import {
    createElement
} from "inferno-create-element";
export function renderTemplate(template, props, container) {
    setTimeout(() => {
        render(createElement(template, props), null === container || void 0 === container ? void 0 : container.get(0))
    }, 0)
}
