/**
 * DevExtreme (esm/renovation/ui/common/icon.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["position", "source"];
import {
    createVNode,
    createFragment
} from "inferno";
import {
    Fragment
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    getImageSourceType
} from "../../../core/utils/icon";
export var viewFunction = _ref => {
    var {
        cssClass: cssClass,
        props: {
            source: source
        },
        sourceType: sourceType
    } = _ref;
    return createFragment(["dxIcon" === sourceType && createVNode(1, "i", "dx-icon dx-icon-".concat(source, " ").concat(cssClass)), "fontIcon" === sourceType && createVNode(1, "i", "dx-icon ".concat(source, " ").concat(cssClass)), "image" === sourceType && createVNode(1, "img", "dx-icon ".concat(cssClass), null, 1, {
        alt: "",
        src: source
    }), "svg" === sourceType && createVNode(1, "i", "dx-icon dx-svg-icon ".concat(cssClass), source, 0)], 0)
};
export var IconProps = {
    position: "left",
    source: ""
};
export class Icon extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get sourceType() {
        return getImageSourceType(this.props.source)
    }
    get cssClass() {
        return "left" !== this.props.position ? "dx-icon-right" : ""
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
            sourceType: this.sourceType,
            cssClass: this.cssClass,
            restAttributes: this.restAttributes
        })
    }
}
Icon.defaultProps = _extends({}, IconProps);
