/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.virtual_scrolling.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import gridCore from "./ui.data_grid.core";
import dataSourceAdapter from "./ui.data_grid.data_source_adapter";
import {
    virtualScrollingModule
} from "../grid_core/ui.grid_core.virtual_scrolling";
gridCore.registerModule("virtualScrolling", virtualScrollingModule);
dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
