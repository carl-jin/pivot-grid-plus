/**
 * DevExtreme (esm/renovation/viz/common/renderers/svg_rect.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "dashStyle", "fill", "height", "opacity", "rotate", "rotateX", "rotateY", "rx", "ry", "scaleX", "scaleY", "sharp", "sharpDirection", "stroke", "strokeOpacity", "strokeWidth", "translateX", "translateY", "width", "x", "y"];
import {
    createVNode,
    normalizeProps
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import SvgGraphicsProps from "./base_graphics_props";
import {
    getGraphicExtraProps
} from "./utils";
export var viewFunction = _ref => {
    var {
        parsedProps: parsedProps,
        rectRef: rectRef
    } = _ref;
    var {
        fill: fill,
        height: height,
        opacity: opacity,
        rx: rx,
        ry: ry,
        stroke: stroke,
        strokeOpacity: strokeOpacity,
        strokeWidth: strokeWidth,
        width: width,
        x: x,
        y: y
    } = parsedProps;
    return normalizeProps(createVNode(32, "rect", null, null, 1, _extends({
        x: x,
        y: y,
        width: width,
        height: height,
        rx: rx,
        ry: ry,
        fill: fill,
        stroke: stroke,
        "stroke-width": strokeWidth,
        "stroke-opacity": strokeOpacity,
        opacity: opacity
    }, getGraphicExtraProps(parsedProps, x, y)), null, rectRef))
};
export var RectSvgElementProps = _extends({}, SvgGraphicsProps, {
    x: 0,
    y: 0,
    width: 0,
    height: 0
});
import {
    createRef as infernoCreateRef
} from "inferno";
export class RectSvgElement extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.rectRef = infernoCreateRef()
    }
    get parsedProps() {
        var tmpX;
        var tmpY;
        var tmpWidth;
        var tmpHeight;
        var tmpProps = _extends({}, this.props);
        var {
            height: height,
            strokeWidth: strokeWidth,
            width: width,
            x: x,
            y: y
        } = tmpProps;
        var sw;
        if (void 0 !== x || void 0 !== y || void 0 !== width || void 0 !== height || void 0 !== strokeWidth) {
            tmpX = void 0 !== x ? x : 0;
            tmpY = void 0 !== y ? y : 0;
            tmpWidth = void 0 !== width ? width : 0;
            tmpHeight = void 0 !== height ? height : 0;
            sw = void 0 !== strokeWidth ? strokeWidth : 0;
            var maxSW = ~~((tmpWidth < tmpHeight ? tmpWidth : tmpHeight) / 2);
            var newSW = Math.min(sw, maxSW);
            tmpProps.x = tmpX + newSW / 2;
            tmpProps.y = tmpY + newSW / 2;
            tmpProps.width = tmpWidth - newSW;
            tmpProps.height = tmpHeight - newSW;
            (sw !== newSW || !(0 === newSW && void 0 === strokeWidth)) && (tmpProps.strokeWidth = newSW)
        }
        tmpProps.sharp && (tmpProps.sharp = false);
        return tmpProps
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
            rectRef: this.rectRef,
            parsedProps: this.parsedProps,
            restAttributes: this.restAttributes
        })
    }
}
RectSvgElement.defaultProps = _extends({}, RectSvgElementProps);
