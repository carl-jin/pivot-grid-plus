/**
 * DevExtreme (esm/renovation/ui/grids/grid_base/grid_base_views.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["className", "role", "showBorders", "views"];
import {
    createVNode,
    createComponentVNode
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    combineClasses
} from "../../../utils/combine_classes";
import {
    GridBaseViewWrapper
} from "./grid_base_view_wrapper";
import {
    DataGridProps
} from "../data_grid/common/data_grid_props";
var GRIDBASE_CONTAINER_CLASS = "dx-gridbase-container";
var BORDERS_CLASS = "borders";
export var viewFunction = _ref => {
    var {
        className: className,
        props: {
            role: role,
            views: views
        }
    } = _ref;
    return createVNode(1, "div", className, views.map(_ref2 => {
        var {
            name: name,
            view: view
        } = _ref2;
        return createComponentVNode(2, GridBaseViewWrapper, {
            view: view
        }, name)
    }), 0, {
        role: role
    })
};
var GridBaseViewPropsType = {
    showBorders: DataGridProps.showBorders
};
export class GridBaseViews extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get className() {
        var {
            showBorders: showBorders
        } = this.props;
        return combineClasses({
            [GRIDBASE_CONTAINER_CLASS]: true,
            ["".concat(this.props.className)]: !!this.props.className,
            ["".concat(this.props.className, "-").concat(BORDERS_CLASS)]: !!showBorders
        })
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            className: this.className,
            restAttributes: this.restAttributes
        })
    }
}
GridBaseViews.defaultProps = _extends({}, GridBaseViewPropsType);
