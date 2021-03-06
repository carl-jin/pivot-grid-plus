/**
 * DevExtreme (esm/ui/form/ui.form.item_option_action.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Class from "../../core/class";
export default class ItemOptionAction {
    constructor(options) {
        this._options = options;
        this._itemsRunTimeInfo = this._options.itemsRunTimeInfo
    }
    findInstance() {
        return this._itemsRunTimeInfo.findWidgetInstanceByItem(this._options.item)
    }
    findItemContainer() {
        return this._itemsRunTimeInfo.findItemContainerByItem(this._options.item)
    }
    tryExecute() {
        Class.abstract()
    }
}
