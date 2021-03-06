/**
 * DevExtreme (esm/viz/tree_map/tree_map.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import dxTreeMap from "./tree_map.base";
export default dxTreeMap;
import "./tiling.squarified";
import "./tiling.strip";
import "./tiling.slice_and_dice";
import "./tiling.rotated_slice_and_dice";
import "./colorizing.discrete";
import "./colorizing.gradient";
import "./colorizing.range";
import "./api";
import "./hover";
import "./selection";
import "./tooltip";
import "./tracker";
import "./drilldown";
import "./plain_data_source";
import {
    plugin as pluginExport
} from "../core/export";
import {
    plugin as pluginTitle
} from "../core/title";
import {
    plugin as pluginLoadIndicator
} from "../core/loading_indicator";
dxTreeMap.addPlugin(pluginExport);
dxTreeMap.addPlugin(pluginTitle);
dxTreeMap.addPlugin(pluginLoadIndicator);
