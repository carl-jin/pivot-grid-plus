/**
 * DevExtreme (esm/renovation/ui/common/widget.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "aria", "children", "className", "classes", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "name", "onActive", "onClick", "onContentReady", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onKeyboardHandled", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"];
import {
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoEffect,
    InfernoWrapperComponent,
    normalizeStyles
} from "@devextreme/vdom";
import "../../../events/click";
import "../../../events/hover";
import {
    active,
    dxClick,
    focus,
    hover,
    keyboard,
    resize,
    visibility
} from "../../../events/short";
import {
    combineClasses
} from "../../utils/combine_classes";
import {
    extend
} from "../../../core/utils/extend";
import {
    focusable
} from "../../../ui/widget/selectors";
import {
    normalizeStyleProp
} from "../../../core/utils/style";
import {
    BaseWidgetProps
} from "./base_props";
import {
    ConfigContext
} from "../../common/config_context";
import {
    ConfigProvider
} from "../../common/config_provider";
import {
    resolveRtlEnabled,
    resolveRtlEnabledDefinition
} from "../../utils/resolve_rtl";
import resizeCallbacks from "../../../core/utils/resize_callbacks";
var getAria = args => Object.keys(args).reduce((r, key) => {
    if (args[key]) {
        return _extends({}, r, {
            ["role" === key || "id" === key ? key : "aria-".concat(key)]: String(args[key])
        })
    }
    return r
}, {});
var getCssClasses = model => {
    var isFocusable = !!model.focusStateEnabled && !model.disabled;
    var isHoverable = !!model.hoverStateEnabled && !model.disabled;
    var canBeActive = !!model.activeStateEnabled && !model.disabled;
    var classesMap = {
        "dx-widget": true,
        [String(model.classes)]: !!model.classes,
        [String(model.className)]: !!model.className,
        "dx-state-disabled": !!model.disabled,
        "dx-state-invisible": !model.visible,
        "dx-state-focused": !!model.focused && isFocusable,
        "dx-state-active": !!model.active && canBeActive,
        "dx-state-hover": !!model.hovered && isHoverable && !model.active,
        "dx-rtl": !!model.rtlEnabled,
        "dx-visibility-change-handler": !!model.onVisibilityChange
    };
    return combineClasses(classesMap)
};
export var viewFunction = viewModel => {
    var widget = normalizeProps(createVNode(1, "div", viewModel.cssClasses, viewModel.props.children, 0, _extends({}, viewModel.attributes, {
        tabIndex: viewModel.tabIndex,
        title: viewModel.props.hint,
        hidden: !viewModel.props.visible,
        style: normalizeStyles(viewModel.styles)
    }), null, viewModel.widgetRef));
    return viewModel.shouldRenderConfigProvider ? createComponentVNode(2, ConfigProvider, {
        rtlEnabled: viewModel.rtlEnabled,
        children: widget
    }) : widget
};
export var WidgetProps = _extends({}, BaseWidgetProps, {
    _feedbackHideTimeout: 400,
    _feedbackShowTimeout: 30,
    aria: {},
    classes: "",
    className: "",
    name: ""
});
import {
    createRef as infernoCreateRef
} from "inferno";
export class Widget extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this._currentState = null;
        this.widgetRef = infernoCreateRef();
        this.state = {
            active: false,
            focused: false,
            hovered: false
        };
        this.setRootElementRef = this.setRootElementRef.bind(this);
        this.activeEffect = this.activeEffect.bind(this);
        this.clickEffect = this.clickEffect.bind(this);
        this.focus = this.focus.bind(this);
        this.focusEffect = this.focusEffect.bind(this);
        this.hoverEffect = this.hoverEffect.bind(this);
        this.keyboardEffect = this.keyboardEffect.bind(this);
        this.resizeEffect = this.resizeEffect.bind(this);
        this.windowResizeEffect = this.windowResizeEffect.bind(this);
        this.visibilityEffect = this.visibilityEffect.bind(this)
    }
    get config() {
        if ("ConfigContext" in this.context) {
            return this.context.ConfigContext
        }
        return ConfigContext
    }
    createEffects() {
        return [new InfernoEffect(this.setRootElementRef, []), new InfernoEffect(this.activeEffect, [this.props._feedbackHideTimeout, this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive, this.props.onInactive]), new InfernoEffect(this.clickEffect, [this.props.disabled, this.props.name, this.props.onClick]), new InfernoEffect(this.focusEffect, [this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn, this.props.onFocusOut]), new InfernoEffect(this.hoverEffect, [this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverEnd, this.props.onHoverStart, this.active]), new InfernoEffect(this.keyboardEffect, [this.props.onKeyDown]), new InfernoEffect(this.resizeEffect, [this.props.name, this.props.onDimensionChanged]), new InfernoEffect(this.windowResizeEffect, [this.props.onDimensionChanged]), new InfernoEffect(this.visibilityEffect, [this.props.name, this.props.onVisibilityChange])]
    }
    updateEffects() {
        var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8;
        null === (_this$_effects$ = this._effects[1]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props._feedbackHideTimeout, this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive, this.props.onInactive]);
        null === (_this$_effects$2 = this._effects[2]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.props.disabled, this.props.name, this.props.onClick]);
        null === (_this$_effects$3 = this._effects[3]) || void 0 === _this$_effects$3 ? void 0 : _this$_effects$3.update([this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn, this.props.onFocusOut]);
        null === (_this$_effects$4 = this._effects[4]) || void 0 === _this$_effects$4 ? void 0 : _this$_effects$4.update([this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverEnd, this.props.onHoverStart, this.active]);
        null === (_this$_effects$5 = this._effects[5]) || void 0 === _this$_effects$5 ? void 0 : _this$_effects$5.update([this.props.onKeyDown]);
        null === (_this$_effects$6 = this._effects[6]) || void 0 === _this$_effects$6 ? void 0 : _this$_effects$6.update([this.props.name, this.props.onDimensionChanged]);
        null === (_this$_effects$7 = this._effects[7]) || void 0 === _this$_effects$7 ? void 0 : _this$_effects$7.update([this.props.onDimensionChanged]);
        null === (_this$_effects$8 = this._effects[8]) || void 0 === _this$_effects$8 ? void 0 : _this$_effects$8.update([this.props.name, this.props.onVisibilityChange])
    }
    get active() {
        var state = this._currentState || this.state;
        return state.active
    }
    set_active(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                active: newValue
            }
        })
    }
    get focused() {
        var state = this._currentState || this.state;
        return state.focused
    }
    set_focused(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                focused: newValue
            }
        })
    }
    get hovered() {
        var state = this._currentState || this.state;
        return state.hovered
    }
    set_hovered(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                hovered: newValue
            }
        })
    }
    setRootElementRef() {
        var {
            rootElementRef: rootElementRef
        } = this.props;
        if (rootElementRef) {
            rootElementRef.current = this.widgetRef.current
        }
    }
    activeEffect() {
        var {
            _feedbackHideTimeout: _feedbackHideTimeout,
            _feedbackShowTimeout: _feedbackShowTimeout,
            activeStateEnabled: activeStateEnabled,
            activeStateUnit: activeStateUnit,
            disabled: disabled,
            onActive: onActive,
            onInactive: onInactive
        } = this.props;
        var selector = activeStateUnit;
        if (activeStateEnabled && !disabled) {
            active.on(this.widgetRef.current, _ref => {
                var {
                    event: event
                } = _ref;
                this.set_active(() => true);
                null === onActive || void 0 === onActive ? void 0 : onActive(event)
            }, _ref2 => {
                var {
                    event: event
                } = _ref2;
                this.set_active(() => false);
                null === onInactive || void 0 === onInactive ? void 0 : onInactive(event)
            }, {
                hideTimeout: _feedbackHideTimeout,
                namespace: "UIFeedback",
                selector: selector,
                showTimeout: _feedbackShowTimeout
            });
            return () => active.off(this.widgetRef.current, {
                selector: selector,
                namespace: "UIFeedback"
            })
        }
        return
    }
    clickEffect() {
        var {
            disabled: disabled,
            name: name,
            onClick: onClick
        } = this.props;
        var namespace = name;
        if (onClick && !disabled) {
            dxClick.on(this.widgetRef.current, onClick, {
                namespace: namespace
            });
            return () => dxClick.off(this.widgetRef.current, {
                namespace: namespace
            })
        }
        return
    }
    focusEffect() {
        var {
            disabled: disabled,
            focusStateEnabled: focusStateEnabled,
            name: name,
            onFocusIn: onFocusIn,
            onFocusOut: onFocusOut
        } = this.props;
        var namespace = "".concat(name, "Focus");
        var isFocusable = focusStateEnabled && !disabled;
        if (isFocusable) {
            focus.on(this.widgetRef.current, e => {
                if (!e.isDefaultPrevented()) {
                    this.set_focused(() => true);
                    null === onFocusIn || void 0 === onFocusIn ? void 0 : onFocusIn(e)
                }
            }, e => {
                if (!e.isDefaultPrevented()) {
                    this.set_focused(() => false);
                    null === onFocusOut || void 0 === onFocusOut ? void 0 : onFocusOut(e)
                }
            }, {
                isFocusable: focusable,
                namespace: namespace
            });
            return () => focus.off(this.widgetRef.current, {
                namespace: namespace
            })
        }
        return
    }
    hoverEffect() {
        var {
            activeStateUnit: activeStateUnit,
            disabled: disabled,
            hoverStateEnabled: hoverStateEnabled,
            onHoverEnd: onHoverEnd,
            onHoverStart: onHoverStart
        } = this.props;
        var selector = activeStateUnit;
        var isHoverable = hoverStateEnabled && !disabled;
        if (isHoverable) {
            hover.on(this.widgetRef.current, _ref3 => {
                var {
                    event: event
                } = _ref3;
                !this.active && this.set_hovered(() => true);
                null === onHoverStart || void 0 === onHoverStart ? void 0 : onHoverStart(event)
            }, _ref4 => {
                var {
                    event: event
                } = _ref4;
                this.set_hovered(() => false);
                null === onHoverEnd || void 0 === onHoverEnd ? void 0 : onHoverEnd(event)
            }, {
                selector: selector,
                namespace: "UIFeedback"
            });
            return () => hover.off(this.widgetRef.current, {
                selector: selector,
                namespace: "UIFeedback"
            })
        }
        return
    }
    keyboardEffect() {
        var {
            onKeyDown: onKeyDown
        } = this.props;
        if (onKeyDown) {
            var id = keyboard.on(this.widgetRef.current, this.widgetRef.current, e => onKeyDown(e));
            return () => keyboard.off(id)
        }
        return
    }
    resizeEffect() {
        var namespace = "".concat(this.props.name, "VisibilityChange");
        var {
            onDimensionChanged: onDimensionChanged
        } = this.props;
        if (onDimensionChanged) {
            resize.on(this.widgetRef.current, onDimensionChanged, {
                namespace: namespace
            });
            return () => resize.off(this.widgetRef.current, {
                namespace: namespace
            })
        }
        return
    }
    windowResizeEffect() {
        var {
            onDimensionChanged: onDimensionChanged
        } = this.props;
        if (onDimensionChanged) {
            resizeCallbacks.add(onDimensionChanged);
            return () => {
                resizeCallbacks.remove(onDimensionChanged)
            }
        }
        return
    }
    visibilityEffect() {
        var {
            name: name,
            onVisibilityChange: onVisibilityChange
        } = this.props;
        var namespace = "".concat(name, "VisibilityChange");
        if (onVisibilityChange) {
            visibility.on(this.widgetRef.current, () => onVisibilityChange(true), () => onVisibilityChange(false), {
                namespace: namespace
            });
            return () => visibility.off(this.widgetRef.current, {
                namespace: namespace
            })
        }
        return
    }
    get shouldRenderConfigProvider() {
        var {
            rtlEnabled: rtlEnabled
        } = this.props;
        return resolveRtlEnabledDefinition(rtlEnabled, this.config)
    }
    get rtlEnabled() {
        var {
            rtlEnabled: rtlEnabled
        } = this.props;
        return resolveRtlEnabled(rtlEnabled, this.config)
    }
    get attributes() {
        var {
            aria: aria,
            disabled: disabled,
            focusStateEnabled: focusStateEnabled,
            visible: visible
        } = this.props;
        var accessKey = focusStateEnabled && !disabled && this.props.accessKey;
        return _extends({}, extend({}, this.restAttributes, accessKey && {
            accessKey: accessKey
        }), getAria(_extends({}, aria, {
            disabled: disabled,
            hidden: !visible
        })))
    }
    get styles() {
        var {
            height: height,
            width: width
        } = this.props;
        var style = this.restAttributes.style || {};
        var computedWidth = normalizeStyleProp("width", "function" === typeof width ? width() : width);
        var computedHeight = normalizeStyleProp("height", "function" === typeof height ? height() : height);
        return _extends({}, style, {
            height: null !== computedHeight && void 0 !== computedHeight ? computedHeight : style.height,
            width: null !== computedWidth && void 0 !== computedWidth ? computedWidth : style.width
        })
    }
    get cssClasses() {
        var {
            activeStateEnabled: activeStateEnabled,
            className: className,
            classes: classes,
            disabled: disabled,
            focusStateEnabled: focusStateEnabled,
            hoverStateEnabled: hoverStateEnabled,
            onVisibilityChange: onVisibilityChange,
            visible: visible
        } = this.props;
        return getCssClasses({
            active: this.active,
            focused: this.focused,
            hovered: this.hovered,
            className: className,
            classes: classes,
            disabled: disabled,
            activeStateEnabled: activeStateEnabled,
            focusStateEnabled: focusStateEnabled,
            hoverStateEnabled: hoverStateEnabled,
            onVisibilityChange: onVisibilityChange,
            rtlEnabled: this.rtlEnabled,
            visible: visible
        })
    }
    get tabIndex() {
        var {
            disabled: disabled,
            focusStateEnabled: focusStateEnabled,
            tabIndex: tabIndex
        } = this.props;
        var isFocusable = focusStateEnabled && !disabled;
        return isFocusable ? tabIndex : void 0
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    focus() {
        focus.trigger(this.widgetRef.current)
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            active: this.active,
            focused: this.focused,
            hovered: this.hovered,
            widgetRef: this.widgetRef,
            config: this.config,
            shouldRenderConfigProvider: this.shouldRenderConfigProvider,
            rtlEnabled: this.rtlEnabled,
            attributes: this.attributes,
            styles: this.styles,
            cssClasses: this.cssClasses,
            tabIndex: this.tabIndex,
            restAttributes: this.restAttributes
        })
    }
}
Widget.defaultProps = _extends({}, WidgetProps);
