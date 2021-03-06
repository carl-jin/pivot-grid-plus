/**
 * DevExtreme (esm/renovation/ui/button.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["accessKey", "activeStateEnabled", "children", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconPosition", "onClick", "onContentReady", "onKeyDown", "onSubmit", "pressed", "rtlEnabled", "stylingMode", "tabIndex", "template", "text", "type", "useInkRipple", "useSubmitBehavior", "validationGroup", "visible", "width"];
import {
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoEffect,
    InfernoWrapperComponent
} from "@devextreme/vdom";
import {
    createDefaultOptionRules,
    convertRulesToOptions
} from "../../core/options/utils";
import devices from "../../core/devices";
import {
    isMaterial,
    current
} from "../../ui/themes";
import {
    click
} from "../../events/short";
import {
    combineClasses
} from "../utils/combine_classes";
import {
    getImageSourceType
} from "../../core/utils/icon";
import {
    Icon
} from "./common/icon";
import {
    InkRipple
} from "./common/ink_ripple";
import {
    Widget
} from "./common/widget";
import {
    BaseWidgetProps
} from "./common/base_props";
var stylingModes = ["outlined", "text", "contained"];
var getCssClasses = model => {
    var {
        icon: icon,
        iconPosition: iconPosition,
        stylingMode: stylingMode,
        text: text,
        type: type
    } = model;
    var isValidStylingMode = stylingMode && -1 !== stylingModes.indexOf(stylingMode);
    var classesMap = {
        "dx-button": true,
        ["dx-button-mode-".concat(isValidStylingMode ? stylingMode : "contained")]: true,
        ["dx-button-".concat(type || "normal")]: true,
        "dx-button-has-text": !!text,
        "dx-button-has-icon": !!icon,
        "dx-button-icon-right": "left" !== iconPosition
    };
    return combineClasses(classesMap)
};
export var viewFunction = viewModel => {
    var {
        children: children,
        icon: icon,
        iconPosition: iconPosition,
        template: ButtonTemplate,
        text: text
    } = viewModel.props;
    var renderText = !viewModel.props.template && !children && text;
    var isIconLeft = "left" === iconPosition;
    var iconComponent = !viewModel.props.template && !children && viewModel.iconSource && createComponentVNode(2, Icon, {
        source: viewModel.iconSource,
        position: iconPosition
    });
    return normalizeProps(createComponentVNode(2, Widget, _extends({
        accessKey: viewModel.props.accessKey,
        activeStateEnabled: viewModel.props.activeStateEnabled,
        aria: viewModel.aria,
        classes: viewModel.cssClasses,
        disabled: viewModel.props.disabled,
        focusStateEnabled: viewModel.props.focusStateEnabled,
        height: viewModel.props.height,
        hint: viewModel.props.hint,
        hoverStateEnabled: viewModel.props.hoverStateEnabled,
        onActive: viewModel.onActive,
        onContentReady: viewModel.props.onContentReady,
        onClick: viewModel.onWidgetClick,
        onInactive: viewModel.onInactive,
        onKeyDown: viewModel.onWidgetKeyDown,
        rtlEnabled: viewModel.props.rtlEnabled,
        tabIndex: viewModel.props.tabIndex,
        visible: viewModel.props.visible,
        width: viewModel.props.width
    }, viewModel.restAttributes, {
        children: createVNode(1, "div", "dx-button-content", [viewModel.props.template && ButtonTemplate({
            data: {
                icon: icon,
                text: text
            }
        }), !viewModel.props.template && children, isIconLeft && iconComponent, renderText && createVNode(1, "span", "dx-button-text", text, 0), !isIconLeft && iconComponent, viewModel.props.useSubmitBehavior && createVNode(64, "input", "dx-button-submit-input", null, 1, {
            type: "submit",
            tabIndex: -1
        }, null, viewModel.submitInputRef), viewModel.props.useInkRipple && createComponentVNode(2, InkRipple, {
            config: viewModel.inkRippleConfig
        }, null, viewModel.inkRippleRef)], 0, null, null, viewModel.contentRef)
    }), null, viewModel.widgetRef))
};
export var ButtonProps = _extends({}, BaseWidgetProps, {
    activeStateEnabled: true,
    hoverStateEnabled: true,
    icon: "",
    iconPosition: "left",
    text: "",
    useInkRipple: false,
    useSubmitBehavior: false,
    validationGroup: void 0
});
export var defaultOptionRules = createDefaultOptionRules([{
    device: () => "desktop" === devices.real().deviceType && !devices.isSimulator(),
    options: {
        focusStateEnabled: true
    }
}, {
    device: () => isMaterial(current()),
    options: {
        useInkRipple: true
    }
}]);
import {
    createRef as infernoCreateRef
} from "inferno";
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class Button extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.contentRef = infernoCreateRef();
        this.inkRippleRef = infernoCreateRef();
        this.submitInputRef = infernoCreateRef();
        this.widgetRef = infernoCreateRef();
        this.contentReadyEffect = this.contentReadyEffect.bind(this);
        this.focus = this.focus.bind(this);
        this.onActive = this.onActive.bind(this);
        this.onInactive = this.onInactive.bind(this);
        this.onWidgetClick = this.onWidgetClick.bind(this);
        this.onWidgetKeyDown = this.onWidgetKeyDown.bind(this);
        this.submitEffect = this.submitEffect.bind(this)
    }
    createEffects() {
        return [new InfernoEffect(this.contentReadyEffect, [this.props.onContentReady]), new InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior])]
    }
    updateEffects() {
        var _this$_effects$, _this$_effects$2;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.onContentReady]);
        null === (_this$_effects$2 = this._effects[1]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.props.onSubmit, this.props.useSubmitBehavior])
    }
    contentReadyEffect() {
        var {
            onContentReady: onContentReady
        } = this.props;
        null === onContentReady || void 0 === onContentReady ? void 0 : onContentReady({
            element: this.contentRef.current.parentNode
        })
    }
    submitEffect() {
        var {
            onSubmit: onSubmit,
            useSubmitBehavior: useSubmitBehavior
        } = this.props;
        if (useSubmitBehavior && onSubmit) {
            click.on(this.submitInputRef.current, event => onSubmit({
                event: event,
                submitInput: this.submitInputRef.current
            }), {
                namespace: "UIFeedback"
            });
            return () => click.off(this.submitInputRef.current, {
                namespace: "UIFeedback"
            })
        }
        return
    }
    onActive(event) {
        var {
            useInkRipple: useInkRipple
        } = this.props;
        useInkRipple && this.inkRippleRef.current.showWave({
            element: this.contentRef.current,
            event: event
        })
    }
    onInactive(event) {
        var {
            useInkRipple: useInkRipple
        } = this.props;
        useInkRipple && this.inkRippleRef.current.hideWave({
            element: this.contentRef.current,
            event: event
        })
    }
    onWidgetClick(event) {
        var {
            onClick: onClick,
            useSubmitBehavior: useSubmitBehavior,
            validationGroup: validationGroup
        } = this.props;
        null === onClick || void 0 === onClick ? void 0 : onClick({
            event: event,
            validationGroup: validationGroup
        });
        useSubmitBehavior && this.submitInputRef.current.click()
    }
    onWidgetKeyDown(options) {
        var {
            onKeyDown: onKeyDown
        } = this.props;
        var {
            keyName: keyName,
            originalEvent: originalEvent,
            which: which
        } = options;
        var result = null === onKeyDown || void 0 === onKeyDown ? void 0 : onKeyDown(options);
        if (null !== result && void 0 !== result && result.cancel) {
            return result
        }
        if ("space" === keyName || "space" === which || "enter" === keyName || "enter" === which) {
            originalEvent.preventDefault();
            this.onWidgetClick(originalEvent)
        }
        return
    }
    get aria() {
        var {
            icon: icon,
            text: text
        } = this.props;
        var label = text || icon;
        if (!text && icon && "image" === getImageSourceType(icon)) {
            label = -1 === icon.indexOf("base64") ? icon.replace(/.+\/([^.]+)\..+$/, "$1") : "Base64"
        }
        return _extends({
            role: "button"
        }, label ? {
            label: label
        } : {})
    }
    get cssClasses() {
        return getCssClasses(this.props)
    }
    get iconSource() {
        var {
            icon: icon,
            type: type
        } = this.props;
        return icon || "back" === type ? icon || "back" : ""
    }
    get inkRippleConfig() {
        var {
            icon: icon,
            text: text,
            type: type
        } = this.props;
        return !text && icon || "back" === type ? {
            isCentered: true,
            useHoldAnimation: false,
            waveSizeCoefficient: 1
        } : {}
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    focus() {
        this.widgetRef.current.focus()
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                template: getTemplate(props.template)
            }),
            contentRef: this.contentRef,
            submitInputRef: this.submitInputRef,
            inkRippleRef: this.inkRippleRef,
            widgetRef: this.widgetRef,
            onActive: this.onActive,
            onInactive: this.onInactive,
            onWidgetClick: this.onWidgetClick,
            onWidgetKeyDown: this.onWidgetKeyDown,
            aria: this.aria,
            cssClasses: this.cssClasses,
            iconSource: this.iconSource,
            inkRippleConfig: this.inkRippleConfig,
            restAttributes: this.restAttributes
        })
    }
}

function __createDefaultProps() {
    return _extends({}, ButtonProps, convertRulesToOptions(defaultOptionRules))
}
Button.defaultProps = __createDefaultProps();
var __defaultOptionRules = [];
export function defaultOptions(rule) {
    __defaultOptionRules.push(rule);
    Button.defaultProps = _extends({}, __createDefaultProps(), convertRulesToOptions(__defaultOptionRules))
}
