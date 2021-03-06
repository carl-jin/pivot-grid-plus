/**
 * DevExtreme (esm/ui/tree_list/ui.tree_list.master_detail.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import treeListCore from "./ui.tree_list.core";
import {
    masterDetailModule
} from "../grid_core/ui.grid_core.master_detail";
import {
    extend
} from "../../core/utils/extend";
treeListCore.registerModule("masterDetail", extend(true, {}, masterDetailModule, {
    extenders: {
        controllers: {
            data: {
                isRowExpanded: function() {
                    return this.callBase.apply(this, arguments)
                },
                _processItems: function() {
                    return this.callBase.apply(this, arguments)
                },
                _processDataItem: function() {
                    return this.callBase.apply(this, arguments)
                }
            }
        }
    }
}));
