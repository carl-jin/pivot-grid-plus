/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/month/date_table/layout.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../../../../core/component_registrator";
import BaseComponent from "../../../../../component_wrapper/component";
import {
    MonthDateTableLayout as MonthDateTableLayoutComponent
} from "./layout";
export default class MonthDateTableLayout extends BaseComponent {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["dataCellTemplate"],
            props: ["viewData", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "topVirtualRowHeight", "bottomVirtualRowHeight", "addDateTableClass", "dataCellTemplate"]
        }
    }
    get _viewComponent() {
        return MonthDateTableLayoutComponent
    }
}
registerComponent("dxMonthDateTableLayout", MonthDateTableLayout);
