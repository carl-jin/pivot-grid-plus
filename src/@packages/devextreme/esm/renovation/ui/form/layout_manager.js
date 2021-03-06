/**
 * DevExtreme (esm/renovation/ui/form/layout_manager.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    combineClasses
} from "../../utils/combine_classes";
import {
    Widget
} from "../common/widget";
import {
    LayoutManagerProps
} from "./layout_manager_props";
export var viewFunction = viewModel => {
    var {
        cssClasses: cssClasses,
        restAttributes: restAttributes
    } = viewModel;
    return normalizeProps(createComponentVNode(2, Widget, _extends({
        classes: cssClasses
    }, restAttributes)))
};
export class LayoutManager extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get cssClasses() {
        return combineClasses({
            "dx-layout-manager": true
        })
    }
    get restAttributes() {
        var restProps = _extends({}, this.props);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            cssClasses: this.cssClasses,
            restAttributes: this.restAttributes
        })
    }
}
LayoutManager.defaultProps = _extends({}, LayoutManagerProps);
