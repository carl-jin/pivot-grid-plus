/**
 * DevExtreme (esm/ui/tree_list/ui.tree_list.validating.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
import treeListCore from "./ui.tree_list.core";
import {
    validatingModule
} from "../grid_core/ui.grid_core.validating";
var EditingControllerExtender = extend({}, validatingModule.extenders.controllers.editing);
delete EditingControllerExtender.processItems;
delete EditingControllerExtender.processDataItem;
treeListCore.registerModule("validating", {
    defaultOptions: validatingModule.defaultOptions,
    controllers: validatingModule.controllers,
    extenders: {
        controllers: {
            editing: EditingControllerExtender,
            editorFactory: validatingModule.extenders.controllers.editorFactory
        },
        views: validatingModule.extenders.views
    }
});
