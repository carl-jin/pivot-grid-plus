/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/group_panel/group_panel.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../../../../core/component_registrator";
import BaseComponent from "../../../../../component_wrapper/component";
import {
    GroupPanel as GroupPanelComponent
} from "./group_panel";
export default class GroupPanel extends BaseComponent {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["resourceCellTemplate"],
            props: ["groups", "groupOrientation", "groupByDate", "height", "baseColSpan", "columnCountPerGroup", "className", "resourceCellTemplate"]
        }
    }
    get _viewComponent() {
        return GroupPanelComponent
    }
}
registerComponent("dxGroupPanel", GroupPanel);
