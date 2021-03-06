/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.editing.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import "./ui.data_grid.editor_factory";
import gridCore from "./ui.data_grid.core";
import {
    editingModule
} from "../grid_core/ui.grid_core.editing";
import {
    extend
} from "../../core/utils/extend";
gridCore.registerModule("editing", extend(true, {}, editingModule, {
    extenders: {
        controllers: {
            data: {
                _changeRowExpandCore: function(key) {
                    var editingController = this._editingController;
                    if (Array.isArray(key)) {
                        editingController && editingController.refresh()
                    }
                    return this.callBase.apply(this, arguments)
                }
            }
        }
    }
}));
