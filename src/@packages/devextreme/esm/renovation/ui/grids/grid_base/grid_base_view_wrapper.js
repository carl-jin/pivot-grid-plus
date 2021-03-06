/**
 * DevExtreme (esm/renovation/ui/grids/grid_base/grid_base_view_wrapper.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["view"];
import {
    createVNode
} from "inferno";
import {
    InfernoEffect,
    InfernoComponent
} from "@devextreme/vdom";
import $ from "../../../../core/renderer";
export var viewFunction = _ref => {
    var {
        viewRef: viewRef
    } = _ref;
    return createVNode(1, "div", null, null, 1, null, null, viewRef)
};
export var GridBaseViewWrapperProps = {};
import {
    createRef as infernoCreateRef
} from "inferno";
export class GridBaseViewWrapper extends InfernoComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.viewRef = infernoCreateRef();
        this.renderView = this.renderView.bind(this)
    }
    createEffects() {
        return [new InfernoEffect(this.renderView, [])]
    }
    updateEffects() {}
    renderView() {
        var $element = $(this.viewRef.current);
        this.props.view._$element = $element;
        this.props.view._$parent = $element.parent();
        this.props.view.render()
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
            viewRef: this.viewRef,
            restAttributes: this.restAttributes
        })
    }
}
GridBaseViewWrapper.defaultProps = _extends({}, GridBaseViewWrapperProps);
