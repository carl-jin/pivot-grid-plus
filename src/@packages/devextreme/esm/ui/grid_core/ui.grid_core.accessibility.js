/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.accessibility.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import * as accessibility from "../../ui/shared/accessibility";
export var registerKeyboardAction = function(viewName, instance, $element, selector, action) {
    var keyboardController = instance.getController("keyboardNavigation");
    if (instance.option("useLegacyKeyboardNavigation") || keyboardController && !keyboardController.isKeyboardEnabled()) {
        return
    }
    instance.createAction("onKeyDown");
    accessibility.registerKeyboardAction(viewName, instance, $element, selector, action, args => {
        instance.executeAction("onKeyDown", args)
    })
};
