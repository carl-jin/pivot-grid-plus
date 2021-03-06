/**
 * DevExtreme (esm/renovation/ui/pager/page_size/large.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["defaultPageSize", "pageSize", "pageSizeChange", "pageSizes"];
import {
    createFragment,
    createComponentVNode
} from "inferno";
import {
    Fragment
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    LightButton
} from "../common/light_button";
import {
    PagerProps
} from "../common/pager_props";
import {
    PAGER_SELECTED_PAGE_SIZE_CLASS,
    PAGER_PAGE_SIZE_CLASS
} from "../common/consts";
export var viewFunction = _ref => {
    var {
        pageSizesText: pageSizesText
    } = _ref;
    return createFragment(pageSizesText.map(_ref2 => {
        var {
            className: className,
            click: click,
            label: label,
            text: text
        } = _ref2;
        return createComponentVNode(2, LightButton, {
            className: className,
            label: label,
            onClick: click,
            children: text
        }, text)
    }), 0)
};
export var PageSizeLargeProps = {};
var PageSizeLargePropsType = {
    defaultPageSize: PagerProps.pageSize
};
export class PageSizeLarge extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this._currentState = null;
        this.state = {
            pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.props.defaultPageSize
        };
        this.onPageSizeChange = this.onPageSizeChange.bind(this)
    }
    get __state_pageSize() {
        var state = this._currentState || this.state;
        return void 0 !== this.props.pageSize ? this.props.pageSize : state.pageSize
    }
    set_pageSize(value) {
        this.setState(state => {
            var _this$props$pageSizeC, _this$props;
            this._currentState = state;
            var newValue = value();
            null === (_this$props$pageSizeC = (_this$props = this.props).pageSizeChange) || void 0 === _this$props$pageSizeC ? void 0 : _this$props$pageSizeC.call(_this$props, newValue);
            this._currentState = null;
            return {
                pageSize: newValue
            }
        })
    }
    get pageSizesText() {
        var {
            pageSizes: pageSizes
        } = this.props;
        return pageSizes.map(_ref3 => {
            var {
                text: text,
                value: processedPageSize
            } = _ref3;
            var selected = processedPageSize === this.__state_pageSize;
            var className = selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS;
            return {
                className: className,
                click: this.onPageSizeChange(processedPageSize),
                label: "Display ".concat(processedPageSize, " items on page"),
                text: text
            }
        })
    }
    onPageSizeChange(processedPageSize) {
        return () => {
            this.set_pageSize(() => processedPageSize)
        }
    }
    get restAttributes() {
        var _this$props$pageSize = _extends({}, this.props, {
                pageSize: this.__state_pageSize
            }),
            restProps = _objectWithoutPropertiesLoose(_this$props$pageSize, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageSize: this.__state_pageSize
            }),
            pageSizesText: this.pageSizesText,
            restAttributes: this.restAttributes
        })
    }
}
PageSizeLarge.defaultProps = _extends({}, PageSizeLargePropsType);
