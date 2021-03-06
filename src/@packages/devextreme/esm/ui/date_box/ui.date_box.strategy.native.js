/**
 * DevExtreme (esm/ui/date_box/ui.date_box.strategy.native.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    noop
} from "../../core/utils/common";
import DateBoxStrategy from "./ui.date_box.strategy";
import {
    inputType
} from "../../core/utils/support";
import {
    inArray
} from "../../core/utils/array";
import dateUtils from "./ui.date_utils";
import dateSerialization from "../../core/utils/date_serialization";
import {
    extend
} from "../../core/utils/extend";
import devices from "../../core/devices";
var NativeStrategy = DateBoxStrategy.inherit({
    NAME: "Native",
    popupConfig: function(_popupConfig) {
        return extend({}, _popupConfig, {
            width: "auto"
        })
    },
    getParsedText: function(text, format) {
        if (!text) {
            return null
        }
        if ("datetime" === this.dateBox.option("type")) {
            return new Date(text.replace(/-/g, "/").replace("T", " ").split(".")[0])
        }
        if (this._isTextInput()) {
            return this.callBase(text, format)
        } else {
            return dateUtils.fromStandardDateFormat(text)
        }
    },
    _isTextInput: function() {
        return "text" === this.dateBox._input().prop("type")
    },
    renderPopupContent: noop,
    _getWidgetName: noop,
    _getWidgetOptions: noop,
    _getDateBoxType: function() {
        var type = this.dateBox.option("type");
        if (-1 === inArray(type, dateUtils.SUPPORTED_FORMATS)) {
            type = "date"
        } else if ("datetime" === type && !inputType(type)) {
            type = "datetime-local"
        }
        return type
    },
    customizeButtons: function() {
        var dropDownButton = this.dateBox.getButton("dropDown");
        if (devices.real().android && dropDownButton) {
            dropDownButton.on("click", function() {
                this.dateBox._input().get(0).click()
            }.bind(this))
        }
    },
    getDefaultOptions: function() {
        return {
            mode: this._getDateBoxType()
        }
    },
    getDisplayFormat: function(displayFormat) {
        var type = this._getDateBoxType();
        return displayFormat || dateUtils.FORMATS_MAP[type]
    },
    renderInputMinMax: function($input) {
        $input.attr({
            min: dateSerialization.serializeDate(this.dateBox.dateOption("min"), "yyyy-MM-dd"),
            max: dateSerialization.serializeDate(this.dateBox.dateOption("max"), "yyyy-MM-dd")
        })
    }
});
export default NativeStrategy;
