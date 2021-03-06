/**
 * DevExtreme (esm/renovation/ui/common/widget.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import BaseComponent from "../../component_wrapper/component";
import {
    Widget as WidgetComponent
} from "./widget";
export default class Widget extends BaseComponent {
    getProps() {
        var props = super.getProps();
        props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
        return props
    }
    focus() {
        var _this$viewRef;
        return null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.focus()
    }
    _getActionConfigs() {
        return {
            onActive: {},
            onDimensionChanged: {},
            onInactive: {},
            onKeyboardHandled: {},
            onVisibilityChange: {},
            onFocusIn: {},
            onFocusOut: {},
            onHoverStart: {},
            onHoverEnd: {},
            onClick: {},
            onContentReady: {
                excludeValidators: ["disabled", "readOnly"]
            }
        }
    }
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["_feedbackHideTimeout", "_feedbackShowTimeout", "activeStateUnit", "aria", "classes", "className", "name", "onActive", "onDimensionChanged", "onInactive", "onKeyboardHandled", "onVisibilityChange", "onFocusIn", "onFocusOut", "onHoverStart", "onHoverEnd", "accessKey", "activeStateEnabled", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "onClick", "onContentReady", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"]
        }
    }
    get _viewComponent() {
        return WidgetComponent
    }
}
registerComponent("dxWidget", Widget);
