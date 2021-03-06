/**
 * DevExtreme (esm/renovation/ui/scroll_view/_toDelete/ui.scrollable.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    deferUpdate,
    deferRender,
    ensureDefined
} from "../../core/utils/common";
import {
    getWindow,
    hasWindow
} from "../../core/utils/window";
import registerComponent from "../../core/component_registrator";
import DOMComponent from "../../core/dom_component";
var SCROLLABLE = "dxScrollable";
var SCROLLABLE_STRATEGY = "dxScrollableStrategy";
var SCROLLABLE_CLASS = "dx-scrollable";
var SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content";
var VERTICAL = "vertical";
var HORIZONTAL = "horizontal";
var Scrollable = DOMComponent.inherit({
    _getWindowDevicePixelRatio: function() {
        return hasWindow() ? getWindow().devicePixelRatio : 1
    },
    _dimensionChanged: function() {
        this._updateRtlPosition()
    },
    _render: function() {
        this._renderDisabledState();
        this.update();
        this.callBase();
        this._rtlConfig = {
            scrollRight: 0,
            clientWidth: this._container().get(0).clientWidth,
            windowPixelRatio: this._getWindowDevicePixelRatio()
        };
        this._updateRtlPosition()
    },
    _isHorizontalAndRtlEnabled: function() {
        return this.option("rtlEnabled") && this.option("direction") !== VERTICAL
    },
    _updateRtlPosition: function() {
        this._updateBounds();
        if (this._isHorizontalAndRtlEnabled()) {
            deferUpdate(() => {
                var scrollLeft = this._getMaxOffset().left - this._rtlConfig.scrollRight;
                if (scrollLeft <= 0) {
                    scrollLeft = 0;
                    this._rtlConfig.scrollRight = this._getMaxOffset().left
                }
                deferRender(() => {
                    if (this.scrollLeft() !== scrollLeft) {
                        this._rtlConfig.skipUpdating = true;
                        this.scrollTo({
                            left: scrollLeft
                        });
                        this._rtlConfig.skipUpdating = false
                    }
                })
            })
        }
    },
    _getMaxOffset: function() {
        var {
            scrollWidth: scrollWidth,
            clientWidth: clientWidth,
            scrollHeight: scrollHeight,
            clientHeight: clientHeight
        } = this._container().get(0);
        return {
            left: scrollWidth - clientWidth,
            top: scrollHeight - clientHeight
        }
    },
    _updateRtlConfig: function() {
        if (this._isHorizontalAndRtlEnabled() && !this._rtlConfig.skipUpdating) {
            var {
                clientWidth: clientWidth,
                scrollLeft: scrollLeft
            } = this._container().get(0);
            var windowPixelRatio = this._getWindowDevicePixelRatio();
            if (this._rtlConfig.windowPixelRatio === windowPixelRatio && this._rtlConfig.clientWidth === clientWidth) {
                this._rtlConfig.scrollRight = this._getMaxOffset().left - scrollLeft
            }
            this._rtlConfig.clientWidth = clientWidth;
            this._rtlConfig.windowPixelRatio = windowPixelRatio
        }
    },
    _renderStrategy: function() {
        this.$element().data(SCROLLABLE_STRATEGY, this._strategy)
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onStart":
            case "onEnd":
            case "onStop":
            case "onUpdated":
            case "onScroll":
            case "onBounce":
                this._createActions();
                break;
            case "direction":
                this._resetInactiveDirection();
                this._invalidate();
                break;
            case "useNative":
                this._setUseSimulatedScrollbar();
                this._invalidate();
                break;
            case "inertiaEnabled":
            case "scrollByContent":
            case "scrollByThumb":
            case "bounceEnabled":
            case "useKeyboard":
            case "showScrollbar":
            case "useSimulatedScrollbar":
            case "pushBackValue":
                this._invalidate();
                break;
            case "disabled":
                this._renderDisabledState();
                this._strategy && this._strategy.disabledChanged();
                break;
            case "updateManually":
                break;
            case "width":
                this.callBase(args);
                this._updateRtlPosition();
                break;
            default:
                this.callBase(args)
        }
    },
    scrollBy: function(distance) {
        distance = this._normalizeLocation(distance);
        if (!distance.top && !distance.left) {
            return
        }
        this._updateIfNeed();
        this._strategy.scrollBy(distance);
        this._updateRtlConfig()
    },
    scrollTo: function(targetLocation) {
        targetLocation = this._normalizeLocation(targetLocation);
        this._updateIfNeed();
        var location = this._location();
        var distance = this._normalizeLocation({
            left: ensureDefined(targetLocation.left, location.left) - location.top,
            top: ensureDefined(targetLocation.top, location.top) - location.left
        });
        if (!distance.top && !distance.left) {
            return
        }
        this._strategy.scrollBy(distance);
        this._updateRtlConfig()
    },
    scrollToElementTopLeft: function(element) {
        var $element = $(element);
        var elementInsideContent = this.$content().find(element).length;
        var elementIsInsideContent = $element.parents("." + SCROLLABLE_CLASS).length - $element.parents("." + SCROLLABLE_CONTENT_CLASS).length === 0;
        if (!elementInsideContent || !elementIsInsideContent) {
            return
        }
        var scrollPosition = {
            top: 0,
            left: 0
        };
        var direction = this.option("direction");
        if (direction !== VERTICAL) {
            var leftPosition = this._elementPositionRelativeToContent($element, "left");
            scrollPosition.left = true === this.option("rtlEnabled") ? leftPosition + $element.width() - this.clientWidth() : leftPosition
        }
        if (direction !== HORIZONTAL) {
            scrollPosition.top = this._elementPositionRelativeToContent($element, "top")
        }
        this.scrollTo(scrollPosition)
    },
    _updateIfNeed: function() {
        if (!this.option("updateManually")) {
            this.update()
        }
    },
    _useTemplates: function() {
        return false
    }
});
registerComponent(SCROLLABLE, Scrollable);
export default Scrollable;
