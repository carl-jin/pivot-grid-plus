/**
 * DevExtreme (esm/ui/button.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import devices from "../core/devices";
import {
    render
} from "./widget/utils.ink_ripple";
import registerComponent from "../core/component_registrator";
import {
    isMaterial,
    current
} from "./themes";
import Action from "../core/action";
import ValidationEngine from "./validation_engine";
import Widget from "./widget/ui.widget";
import {
    active as activeEvents,
    click as clickEvent,
    dxClick as dxClickEvent
} from "../events/short";
import {
    extend
} from "../core/utils/extend";
import {
    FunctionTemplate
} from "../core/templates/function_template";
import {
    getImageContainer,
    getImageSourceType
} from "../core/utils/icon";
import {
    getPublicElement
} from "../core/element";
var ANONYMOUS_TEMPLATE_NAME = "content";
class Button extends Widget {
    constructor() {
        super(...arguments);
        this._feedbackHideTimeout = 100
    }
    _$content() {
        return this.$element().find(".dx-button-content")
    }
    _$submitInput() {
        return this.$element().find(".dx-button-submit-input")
    }
    _attachActiveEvents(active, inactive) {
        var $el = this._eventBindingTarget();
        var selector = this._activeStateUnit;
        activeEvents.off($el, {
            namespace: "inkRipple",
            selector: selector
        });
        activeEvents.on($el, new Action(active), new Action(inactive, {
            excludeValidators: ["disabled", "readOnly"]
        }), {
            showTimeout: this._feedbackShowTimeout,
            hideTimeout: this._feedbackHideTimeout,
            selector: selector,
            namespace: "inkRipple"
        })
    }
    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([{
            device: () => "desktop" === devices.real().deviceType && !devices.isSimulator(),
            options: {
                focusStateEnabled: true
            }
        }, {
            device: () => isMaterial(current()),
            options: {
                useInkRipple: true
            }
        }])
    }
    _executeClickAction(event) {
        this._clickAction({
            validationGroup: this._validationGroupConfig,
            event: event
        })
    }
    _findGroup() {
        var $element = this.$element();
        var model = this._modelByElement($element);
        var {
            validationGroup: validationGroup
        } = this.option();
        return validationGroup || ValidationEngine.findGroup($element, model)
    }
    _getContentData() {
        var {
            icon: icon,
            text: text,
            type: type,
            _templateData: _templateData
        } = this.option();
        return extend({
            icon: "back" === type && !icon ? "back" : icon,
            text: text
        }, _templateData)
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            hoverStateEnabled: true,
            onClick: null,
            type: "normal",
            text: "",
            icon: "",
            iconPosition: "left",
            validationGroup: void 0,
            activeStateEnabled: true,
            template: "content",
            useSubmitBehavior: false,
            useInkRipple: false,
            _templateData: {},
            stylingMode: "contained"
        })
    }
    _getSubmitAction() {
        var needValidate = true;
        var validationStatus = "valid";
        return this._createAction(_ref => {
            var {
                event: event
            } = _ref;
            if (needValidate) {
                var validationGroup = this._validationGroupConfig;
                if (validationGroup) {
                    var {
                        status: status,
                        complete: complete
                    } = validationGroup.validate();
                    validationStatus = status;
                    if ("pending" === status) {
                        needValidate = false;
                        this.option("disabled", true);
                        complete.then(_ref2 => {
                            var {
                                status: status
                            } = _ref2;
                            this.option("disabled", false);
                            validationStatus = status;
                            "valid" === validationStatus && this._submitInput().click();
                            needValidate = true
                        })
                    }
                }
            }
            "valid" !== validationStatus && event.preventDefault();
            event.stopPropagation()
        })
    }
    _initMarkup() {
        this.$element().addClass("dx-button");
        this._renderType();
        this._renderStylingMode();
        this._renderInkRipple();
        this._renderClick();
        this._updateAriaLabel();
        super._initMarkup();
        this._updateContent();
        this.setAria("role", "button")
    }
    _getAnonymousTemplateName() {
        return ANONYMOUS_TEMPLATE_NAME
    }
    _initTemplates() {
        this._templateManager.addDefaultTemplates({
            content: new FunctionTemplate(_ref3 => {
                var {
                    model: model = {},
                    container: container
                } = _ref3;
                var {
                    text: text,
                    icon: icon
                } = model;
                var {
                    iconPosition: iconPosition
                } = this.option();
                var $icon = getImageContainer(icon);
                var $textContainer = text && $("<span>").text(text).addClass("dx-button-text");
                var $container = $(container);
                $container.append($textContainer);
                if ("left" === iconPosition) {
                    $container.prepend($icon)
                } else {
                    $icon.addClass("dx-icon-right");
                    $container.append($icon)
                }
            })
        });
        super._initTemplates()
    }
    _optionChanged(args) {
        var {
            name: name
        } = args;
        switch (name) {
            case "onClick":
                this._updateClick();
                break;
            case "icon":
            case "text":
                this._updateContent();
                this._updateAriaLabel();
                break;
            case "type":
                this._updateType();
                this._updateContent();
                break;
            case "_templateData":
                break;
            case "template":
            case "iconPosition":
                this._updateContent();
                break;
            case "stylingMode":
                this._updateStylingMode();
                break;
            case "useSubmitBehavior":
                this._updateSubmitInput();
                break;
            case "useInkRipple":
                this._invalidate();
                break;
            default:
                super._optionChanged(args)
        }
    }
    _renderClick() {
        var $el = this.$element();
        dxClickEvent.off($el, {
            namespace: this.NAME
        });
        dxClickEvent.on($el, event => this._executeClickAction(event), {
            namespace: this.NAME
        });
        this._updateClick()
    }
    _renderInkRipple() {
        var {
            text: text,
            icon: icon,
            type: type,
            useInkRipple: useInkRipple
        } = this.option();
        if (useInkRipple) {
            var isOnlyIconButton = !text && icon || "back" === type;
            var _inkRipple = render(isOnlyIconButton ? {
                waveSizeCoefficient: 1,
                useHoldAnimation: false,
                isCentered: true
            } : {});
            var changeWaveVisibility = (event, visible) => {
                var {
                    activeStateEnabled: activeStateEnabled,
                    useInkRipple: useInkRipple
                } = this.option();
                if (useInkRipple && activeStateEnabled && !this._disposed) {
                    var config = {
                        element: this._$content(),
                        event: event
                    };
                    visible ? _inkRipple.showWave(config) : _inkRipple.hideWave(config)
                }
            };
            this._attachActiveEvents(_ref4 => {
                var {
                    event: event
                } = _ref4;
                return changeWaveVisibility(event, true)
            }, _ref5 => {
                var {
                    event: event
                } = _ref5;
                return changeWaveVisibility(event)
            })
        }
    }
    _renderStylingMode() {
        var $element = this.$element();
        var {
            stylingMode: stylingMode
        } = this.option();
        if (-1 === ["contained", "text", "outlined"].indexOf(stylingMode)) {
            stylingMode = this._getDefaultOptions().stylingMode
        }
        $element.addClass("dx-button-mode-".concat(stylingMode))
    }
    _renderSubmitInput() {
        var {
            useSubmitBehavior: useSubmitBehavior
        } = this.option();
        if (useSubmitBehavior) {
            var submitAction = this._getSubmitAction();
            var $content = this._$content();
            $("<input>").attr("type", "submit").attr("tabindex", -1).addClass("dx-button-submit-input").appendTo($content);
            clickEvent.on(this._$submitInput(), event => submitAction({
                event: event
            }))
        }
    }
    _renderType() {
        var {
            type: type
        } = this.option();
        var $element = this.$element();
        type && $element.addClass("dx-button-".concat(type))
    }
    _submitInput() {
        return this._$submitInput().get(0)
    }
    _supportedKeys() {
        var click = e => {
            e.preventDefault();
            this._executeClickAction(e)
        };
        return extend(super._supportedKeys(), {
            space: click,
            enter: click
        })
    }
    _updateAriaLabel() {
        var ariaTarget = this._getAriaTarget();
        var {
            icon: icon,
            text: text
        } = this.option();
        if (!text) {
            if ("image" === getImageSourceType(icon)) {
                icon = -1 === icon.indexOf("base64") ? icon.replace(/.+\/([^.]+)\..+$/, "$1") : "Base64"
            }
            text = icon || ""
        }
        ariaTarget.attr("aria-label", text || null)
    }
    _updateClick() {
        this._clickAction = this._createActionByOption("onClick", {
            excludeValidators: ["readOnly"],
            afterExecute: () => {
                var {
                    useSubmitBehavior: useSubmitBehavior
                } = this.option();
                useSubmitBehavior && setTimeout(() => this._submitInput().click())
            }
        })
    }
    _updateContent() {
        var $element = this.$element();
        var $content = this._$content();
        var data = this._getContentData();
        var {
            template: template,
            iconPosition: iconPosition
        } = this.option();
        var {
            icon: icon,
            text: text
        } = data;
        $content.length ? $content.empty() : $content = $("<div>").addClass("dx-button-content").appendTo($element);
        $element.toggleClass("dx-button-has-icon", !!icon).toggleClass("dx-button-icon-right", !!icon && "left" !== iconPosition).toggleClass("dx-button-has-text", !!text);
        var $template = $(this._getTemplateByOption("template").render({
            model: data,
            container: getPublicElement($content),
            transclude: this._templateManager.anonymousTemplateName === template
        }));
        if ($template.hasClass("dx-template-wrapper")) {
            $template.addClass("dx-button-content");
            $content.replaceWith($template)
        }
        this._updateSubmitInput()
    }
    _updateSubmitInput() {
        var {
            useSubmitBehavior: useSubmitBehavior
        } = this.option();
        var $submitInput = this._$submitInput();
        if (!useSubmitBehavior && $submitInput.length) {
            $submitInput.remove()
        } else if (useSubmitBehavior && !$submitInput.length) {
            this._renderSubmitInput()
        }
    }
    _updateStylingMode() {
        var $element = this.$element();
        ["contained", "text", "outlined"].map(mode => "dx-button-mode-".concat(mode)).forEach(className => {
            $element.removeClass(className)
        });
        this._renderStylingMode()
    }
    _updateType() {
        var $element = this.$element();
        ["back", "danger", "default", "normal", "success"].map(type => "dx-button-".concat(type)).forEach(className => {
            $element.removeClass(className)
        });
        this._renderType()
    }
    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup())
    }
}
registerComponent("dxButton", Button);
export default Button;
