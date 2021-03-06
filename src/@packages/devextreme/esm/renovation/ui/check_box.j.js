/**
 * DevExtreme (esm/renovation/ui/check_box.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../core/component_registrator";
import BaseComponent from "../component_wrapper/check_box";
import {
    CheckBox as CheckBoxComponent
} from "./check_box";
export default class CheckBox extends BaseComponent {
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
            onFocusIn: {},
            onClick: {},
            onContentReady: {
                excludeValidators: ["disabled", "readOnly"]
            }
        }
    }
    get _propsInfo() {
        return {
            twoWay: [
                ["value", false, "valueChange"]
            ],
            allowNull: ["validationError", "validationErrors", "defaultValue", "value"],
            elements: [],
            templates: [],
            props: ["activeStateEnabled", "hoverStateEnabled", "validationError", "validationErrors", "text", "validationMessageMode", "validationStatus", "name", "readOnly", "isValid", "useInkRipple", "onFocusIn", "saveValueChangeEvent", "defaultValue", "valueChange", "accessKey", "disabled", "focusStateEnabled", "height", "hint", "onClick", "onContentReady", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width", "value"]
        }
    }
    get _viewComponent() {
        return CheckBoxComponent
    }
}
registerComponent("dxCheckBox", CheckBox);
