/**
 * DevExtreme (esm/renovation/ui/button.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../core/component_registrator";
import BaseComponent from "../component_wrapper/button";
import {
    Button as ButtonComponent
} from "./button";
export default class Button extends BaseComponent {
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
            onClick: {
                excludeValidators: ["readOnly"]
            },
            onSubmit: {},
            onContentReady: {
                excludeValidators: ["disabled", "readOnly"]
            }
        }
    }
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: ["onSubmit"],
            templates: ["template"],
            props: ["activeStateEnabled", "hoverStateEnabled", "icon", "iconPosition", "onClick", "onSubmit", "pressed", "stylingMode", "template", "text", "type", "useInkRipple", "useSubmitBehavior", "validationGroup", "accessKey", "disabled", "focusStateEnabled", "height", "hint", "onContentReady", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"]
        }
    }
    get _viewComponent() {
        return ButtonComponent
    }
}
registerComponent("dxButton", Button);
