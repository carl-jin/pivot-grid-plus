/**
 * DevExtreme (esm/ui/text_area.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import eventsEngine from "../events/core/events_engine";
import {
    noop,
    ensureDefined
} from "../core/utils/common";
import {
    getWindow
} from "../core/utils/window";
import registerComponent from "../core/component_registrator";
import {
    extend
} from "../core/utils/extend";
import {
    isDefined
} from "../core/utils/type";
import {
    addNamespace,
    eventData
} from "../events/utils/index";
import pointerEvents from "../events/pointer";
import scrollEvents from "../ui/scroll_view/ui.events.emitter.gesture.scroll";
import {
    getVerticalOffsets,
    getElementBoxParams,
    parseHeight
} from "../core/utils/size";
import {
    allowScroll,
    prepareScrollData
} from "./text_box/utils.scroll";
import TextBox from "./text_box";
var TEXTAREA_CLASS = "dx-textarea";
var TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
var TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = "dx-texteditor-input-auto-resize";
var TextArea = TextBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            spellcheck: true,
            minHeight: void 0,
            maxHeight: void 0,
            autoResizeEnabled: false
        })
    },
    _initMarkup: function() {
        this.$element().addClass(TEXTAREA_CLASS);
        this.callBase();
        this.setAria("multiline", "true")
    },
    _renderContentImpl: function() {
        this._updateInputHeight();
        this.callBase()
    },
    _renderInput: function() {
        this.callBase();
        this._renderScrollHandler()
    },
    _createInput: function() {
        var $input = $("<textarea>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        this._updateInputAutoResizeAppearance($input);
        return $input
    },
    _applyInputAttributes: function($input, customAttributes) {
        $input.attr(customAttributes).addClass(TEXTEDITOR_INPUT_CLASS)
    },
    _renderScrollHandler: function() {
        this._eventY = 0;
        var $input = this._input();
        var initScrollData = prepareScrollData($input, true);
        eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
        eventsEngine.on($input, addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
        eventsEngine.on($input, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this))
    },
    _pointerDownHandler: function(e) {
        this._eventY = eventData(e).y
    },
    _pointerMoveHandler: function(e) {
        var currentEventY = eventData(e).y;
        var delta = this._eventY - currentEventY;
        if (allowScroll(this._input(), delta)) {
            e.isScrollingEvent = true;
            e.stopPropagation()
        }
        this._eventY = currentEventY
    },
    _renderDimensions: function() {
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue("width", element);
        var height = this._getOptionValue("height", element);
        var minHeight = this.option("minHeight");
        var maxHeight = this.option("maxHeight");
        $element.css({
            minHeight: void 0 !== minHeight ? minHeight : "",
            maxHeight: void 0 !== maxHeight ? maxHeight : "",
            width: width,
            height: height
        })
    },
    _resetDimensions: function() {
        this.$element().css({
            height: "",
            minHeight: "",
            maxHeight: ""
        })
    },
    _renderEvents: function() {
        if (this.option("autoResizeEnabled")) {
            eventsEngine.on(this._input(), addNamespace("input paste", this.NAME), this._updateInputHeight.bind(this))
        }
        this.callBase()
    },
    _refreshEvents: function() {
        eventsEngine.off(this._input(), addNamespace("input paste", this.NAME));
        this.callBase()
    },
    _getHeightDifference($input) {
        return getVerticalOffsets(this._$element.get(0), false) + getVerticalOffsets(this._$textEditorContainer.get(0), false) + getVerticalOffsets(this._$textEditorInputContainer.get(0), false) + getElementBoxParams("height", getWindow().getComputedStyle($input.get(0))).margin
    },
    _updateInputHeight: function() {
        var $input = this._input();
        var autoHeightResizing = void 0 === this.option("height") && this.option("autoResizeEnabled");
        if (!autoHeightResizing) {
            $input.css("height", "");
            return
        } else {
            this._resetDimensions();
            this._$element.css("height", this._$element.outerHeight())
        }
        $input.css("height", 0);
        var heightDifference = this._getHeightDifference($input);
        this._renderDimensions();
        var minHeight = this._getBoundaryHeight("minHeight");
        var maxHeight = this._getBoundaryHeight("maxHeight");
        var inputHeight = $input[0].scrollHeight;
        if (void 0 !== minHeight) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference)
        }
        if (void 0 !== maxHeight) {
            var adjustedMaxHeight = maxHeight - heightDifference;
            var needScroll = inputHeight > adjustedMaxHeight;
            inputHeight = Math.min(inputHeight, adjustedMaxHeight);
            this._updateInputAutoResizeAppearance($input, !needScroll)
        }
        $input.css("height", inputHeight);
        if (autoHeightResizing) {
            this._$element.css("height", "auto")
        }
    },
    _getBoundaryHeight: function(optionName) {
        var boundaryValue = this.option(optionName);
        if (isDefined(boundaryValue)) {
            return "number" === typeof boundaryValue ? boundaryValue : parseHeight(boundaryValue, this._$textEditorContainer.get(0))
        }
    },
    _renderInputType: noop,
    _visibilityChanged: function(visible) {
        if (visible) {
            this._updateInputHeight()
        }
    },
    _updateInputAutoResizeAppearance: function($input, isAutoResizeEnabled) {
        if ($input) {
            var autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option("autoResizeEnabled"));
            $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled)
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "autoResizeEnabled":
                this._updateInputAutoResizeAppearance(this._input(), args.value);
                this._refreshEvents();
                this._updateInputHeight();
                break;
            case "value":
            case "height":
                this.callBase(args);
                this._updateInputHeight();
                break;
            case "minHeight":
            case "maxHeight":
                this._renderDimensions();
                this._updateInputHeight();
                break;
            case "visible":
                this.callBase(args);
                args.value && this._updateInputHeight();
                break;
            default:
                this.callBase(args)
        }
    }
});
registerComponent("dxTextArea", TextArea);
export default TextArea;
