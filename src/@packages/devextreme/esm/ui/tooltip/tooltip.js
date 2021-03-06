/**
 * DevExtreme (esm/ui/tooltip/tooltip.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import Guid from "../../core/guid";
import registerComponent from "../../core/component_registrator";
import {
    extend
} from "../../core/utils/extend";
import Popover from "../popover";
var TOOLTIP_CLASS = "dx-tooltip";
var TOOLTIP_WRAPPER_CLASS = "dx-tooltip-wrapper";
import {
    isWindow
} from "../../core/utils/type";
var Tooltip = Popover.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            toolbarItems: [],
            showCloseButton: false,
            showTitle: false,
            title: null,
            titleTemplate: null,
            onTitleRendered: null,
            bottomTemplate: null,
            propagateOutsideClick: true
        })
    },
    _render: function() {
        this.$element().addClass(TOOLTIP_CLASS);
        this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
        this.callBase()
    },
    _renderContent: function() {
        this.callBase();
        this._contentId = "dx-" + new Guid;
        this.$overlayContent().attr({
            id: this._contentId,
            role: "tooltip"
        });
        this._toggleAriaDescription(true)
    },
    _toggleAriaDescription: function(showing) {
        var $target = $(this.option("target"));
        var label = showing ? this._contentId : void 0;
        if (!isWindow($target.get(0))) {
            this.setAria("describedby", label, $target)
        }
    }
});
registerComponent("dxTooltip", Tooltip);
export default Tooltip;
