/**
 * DevExtreme (esm/ui/slide_out_view/ui.slide_out_view.animation.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import fx from "../../animation/fx";
var ANIMATION_DURATION = 400;
export var animation = {
    moveTo: function($element, position, completeAction) {
        fx.animate($element, {
            type: "slide",
            to: {
                left: position
            },
            duration: ANIMATION_DURATION,
            complete: completeAction
        })
    },
    complete: function($element) {
        fx.stop($element, true)
    }
};
