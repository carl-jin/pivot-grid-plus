/**
 * DevExtreme (esm/renovation/component_wrapper/button.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import ValidationEngine from "../../ui/validation_engine";
import Component from "./component";
export default class Button extends Component {
    _init() {
        super._init();
        this._addAction("onSubmit", this._getSubmitAction())
    }
    getProps() {
        var props = super.getProps();
        props.validationGroup = this._validationGroupConfig;
        return props
    }
    _getSubmitAction() {
        var needValidate = true;
        var validationStatus = "valid";
        return this._createAction(_ref => {
            var {
                event: event,
                submitInput: submitInput
            } = _ref;
            if (needValidate) {
                var validationGroup = this._validationGroupConfig;
                if (validationGroup) {
                    var {
                        complete: complete,
                        status: status
                    } = validationGroup.validate();
                    validationStatus = status;
                    if ("pending" === status) {
                        needValidate = false;
                        this.option("disabled", true);
                        complete.then(_ref2 => {
                            var {
                                status: status
                            } = _ref2;
                            needValidate = true;
                            this.option("disabled", false);
                            validationStatus = status;
                            "valid" === validationStatus && submitInput.click()
                        })
                    }
                }
            }
            "valid" !== validationStatus && event.preventDefault();
            event.stopPropagation()
        })
    }
    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup())
    }
    _findGroup() {
        var $element = this.$element();
        return this.option("validationGroup") || ValidationEngine.findGroup($element, this._modelByElement($element))
    }
}
