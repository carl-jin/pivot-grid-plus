/**
 * DevExtreme (esm/ui/list/ui.list.edit.decorator.swipe.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    move
} from "../../animation/translator";
import fx from "../../animation/fx";
import {
    register as registerDecorator
} from "./ui.list.edit.decorator_registry";
import EditDecorator from "./ui.list.edit.decorator";
import {
    Deferred
} from "../../core/utils/deferred";
registerDecorator("delete", "swipe", EditDecorator.inherit({
    _shouldHandleSwipe: true,
    _renderItemPosition: function($itemElement, offset, animate) {
        var deferred = new Deferred;
        var itemOffset = offset * this._itemElementWidth;
        if (animate) {
            fx.animate($itemElement, {
                to: {
                    left: itemOffset
                },
                type: "slide",
                complete: function() {
                    deferred.resolve($itemElement, offset)
                }
            })
        } else {
            move($itemElement, {
                left: itemOffset
            });
            deferred.resolve()
        }
        return deferred.promise()
    },
    _swipeStartHandler: function($itemElement) {
        this._itemElementWidth = $itemElement.width();
        return true
    },
    _swipeUpdateHandler: function($itemElement, args) {
        this._renderItemPosition($itemElement, args.offset);
        return true
    },
    _swipeEndHandler: function($itemElement, args) {
        var offset = args.targetOffset;
        this._renderItemPosition($itemElement, offset, true).done(function($itemElement, offset) {
            if (Math.abs(offset)) {
                this._list.deleteItem($itemElement).fail(function() {
                    this._renderItemPosition($itemElement, 0, true)
                }.bind(this))
            }
        }.bind(this));
        return true
    }
}));
