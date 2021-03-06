/**
 * DevExtreme (esm/viz/sankey.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import dxSankey from "./sankey/sankey";
import {
    setTooltipCustomOptions
} from "./sankey/tooltip";
import {
    plugin as pluginExport
} from "./core/export";
import {
    plugin as pluginTitle
} from "./core/title";
import {
    plugin as pluginTracker
} from "./sankey/tracker";
import {
    plugin as pluginTooltip
} from "./core/tooltip";
import {
    plugin as pluginLoadingIndicator
} from "./core/loading_indicator";
dxSankey.addPlugin(pluginExport);
dxSankey.addPlugin(pluginTitle);
dxSankey.addPlugin(pluginTracker);
dxSankey.addPlugin(pluginLoadingIndicator);
dxSankey.addPlugin(pluginTooltip);
setTooltipCustomOptions(dxSankey);
export default dxSankey;
