/**
 * DevExtreme (esm/renovation/ui/pager/pager.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import {
    GridPagerWrapper
} from "../../component_wrapper/grid_pager";
import {
    Pager as PagerComponent
} from "./pager";
export default class Pager extends GridPagerWrapper {
    getProps() {
        var props = super.getProps();
        props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
        return props
    }
    get _propsInfo() {
        return {
            twoWay: [
                ["pageIndex", 1, "pageIndexChange"],
                ["pageSize", 5, "pageSizeChange"]
            ],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["gridCompatibility", "className", "showInfo", "infoText", "lightModeEnabled", "displayMode", "maxPagesCount", "pageCount", "pagesCountText", "visible", "hasKnownLastPage", "pagesNavigatorVisible", "pageIndexChange", "pageSizeChange", "showPageSizes", "pageSizes", "rtlEnabled", "showNavigationButtons", "totalCount", "onKeyDown", "defaultPageIndex", "defaultPageSize", "pageIndex", "pageSize"]
        }
    }
    get _viewComponent() {
        return PagerComponent
    }
}
registerComponent("dxPager", Pager);
