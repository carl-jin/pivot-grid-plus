/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.data_source_adapter.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import DataSourceAdapter from "../grid_core/ui.grid_core.data_source_adapter";
var dataSourceAdapterType = DataSourceAdapter;
export default {
    extend: function(extender) {
        dataSourceAdapterType = dataSourceAdapterType.inherit(extender)
    },
    create: function(component) {
        return new dataSourceAdapterType(component)
    }
};
