/**
 * DevExtreme (esm/renovation/ui/pager/content.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "infoTextRef", "infoTextVisible", "isLargeDisplayMode", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pageSizesRef", "pagesCountText", "pagesNavigatorVisible", "pagesRef", "rootElementRef", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];
import {
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoEffect,
    InfernoComponent,
    normalizeStyles
} from "@devextreme/vdom";
import {
    InfoText
} from "./info";
import {
    PageIndexSelector
} from "./pages/page_index_selector";
import {
    PageSizeSelector
} from "./page_size/selector";
import {
    PAGER_PAGES_CLASS,
    PAGER_PAGE_INDEXES_CLASS,
    LIGHT_MODE_CLASS,
    PAGER_CLASS
} from "./common/consts";
import {
    PagerProps
} from "./common/pager_props";
import {
    combineClasses
} from "../../utils/combine_classes";
import {
    Widget
} from "../common/widget";
import {
    registerKeyboardAction as _registerKeyboardAction
} from "../../../ui/shared/accessibility";
export var viewFunction = _ref => {
    var {
        classes: classes,
        infoVisible: infoVisible,
        isLargeDisplayMode: isLargeDisplayMode,
        pageIndexSelectorVisible: pageIndexSelectorVisible,
        pagesContainerVisibility: pagesContainerVisibility,
        pagesContainerVisible: pagesContainerVisible,
        props: {
            hasKnownLastPage: hasKnownLastPage,
            infoText: infoText,
            infoTextRef: infoTextRef,
            maxPagesCount: maxPagesCount,
            pageCount: pageCount,
            pageIndex: pageIndex,
            pageIndexChange: pageIndexChange,
            pageSize: pageSize,
            pageSizeChange: pageSizeChange,
            pageSizes: pageSizes,
            pageSizesRef: pageSizesRef,
            pagesCountText: pagesCountText,
            pagesRef: pagesRef,
            rtlEnabled: rtlEnabled,
            showNavigationButtons: showNavigationButtons,
            showPageSizes: showPageSizes,
            totalCount: totalCount,
            visible: visible
        },
        restAttributes: restAttributes,
        widgetRootElementRef: widgetRootElementRef
    } = _ref;
    return normalizeProps(createComponentVNode(2, Widget, _extends({
        rootElementRef: widgetRootElementRef,
        rtlEnabled: rtlEnabled,
        classes: classes,
        visible: visible
    }, restAttributes, {
        children: [showPageSizes && createComponentVNode(2, PageSizeSelector, {
            rootElementRef: pageSizesRef,
            isLargeDisplayMode: isLargeDisplayMode,
            pageSize: pageSize,
            pageSizeChange: pageSizeChange,
            pageSizes: pageSizes
        }), pagesContainerVisible && createVNode(1, "div", PAGER_PAGES_CLASS, [infoVisible && createComponentVNode(2, InfoText, {
            rootElementRef: infoTextRef,
            infoText: infoText,
            pageCount: pageCount,
            pageIndex: pageIndex,
            totalCount: totalCount
        }), pageIndexSelectorVisible && createVNode(1, "div", PAGER_PAGE_INDEXES_CLASS, createComponentVNode(2, PageIndexSelector, {
            hasKnownLastPage: hasKnownLastPage,
            isLargeDisplayMode: isLargeDisplayMode,
            maxPagesCount: maxPagesCount,
            pageCount: pageCount,
            pageIndex: pageIndex,
            pageIndexChange: pageIndexChange,
            pagesCountText: pagesCountText,
            showNavigationButtons: showNavigationButtons,
            totalCount: totalCount
        }), 2, null, null, pagesRef)], 0, {
            style: normalizeStyles({
                visibility: pagesContainerVisibility
            })
        })]
    })))
};
export var PagerContentProps = _extends({}, PagerProps, {
    infoTextVisible: true,
    isLargeDisplayMode: true
});
import {
    createRef as infernoCreateRef
} from "inferno";
export class PagerContent extends InfernoComponent {
    constructor(props) {
        super(props);
        this._currentState = null;
        this.widgetRootElementRef = infernoCreateRef();
        this.state = {
            pageIndex: void 0 !== this.props.pageIndex ? this.props.pageIndex : this.props.defaultPageIndex,
            pageSize: void 0 !== this.props.pageSize ? this.props.pageSize : this.props.defaultPageSize
        };
        this.createFakeInstance = this.createFakeInstance.bind(this);
        this.setRootElementRef = this.setRootElementRef.bind(this)
    }
    createEffects() {
        return [new InfernoEffect(this.setRootElementRef, [])]
    }
    updateEffects() {}
    get __state_pageIndex() {
        var state = this._currentState || this.state;
        return void 0 !== this.props.pageIndex ? this.props.pageIndex : state.pageIndex
    }
    set_pageIndex(value) {
        this.setState(state => {
            var _this$props$pageIndex, _this$props;
            this._currentState = state;
            var newValue = value();
            null === (_this$props$pageIndex = (_this$props = this.props).pageIndexChange) || void 0 === _this$props$pageIndex ? void 0 : _this$props$pageIndex.call(_this$props, newValue);
            this._currentState = null;
            return {
                pageIndex: newValue
            }
        })
    }
    get __state_pageSize() {
        var state = this._currentState || this.state;
        return void 0 !== this.props.pageSize ? this.props.pageSize : state.pageSize
    }
    set_pageSize(value) {
        this.setState(state => {
            var _this$props$pageSizeC, _this$props2;
            this._currentState = state;
            var newValue = value();
            null === (_this$props$pageSizeC = (_this$props2 = this.props).pageSizeChange) || void 0 === _this$props$pageSizeC ? void 0 : _this$props$pageSizeC.call(_this$props2, newValue);
            this._currentState = null;
            return {
                pageSize: newValue
            }
        })
    }
    getChildContext() {
        return _extends({}, this.context, {
            KeyboardActionContext: this.keyboardAction
        })
    }
    setRootElementRef() {
        var {
            rootElementRef: rootElementRef
        } = this.props;
        if (rootElementRef) {
            rootElementRef.current = this.widgetRootElementRef.current
        }
    }
    createFakeInstance() {
        return {
            option: () => false,
            element: () => this.widgetRootElementRef.current,
            _createActionByOption: () => e => {
                var _this$props$onKeyDown, _this$props3;
                null === (_this$props$onKeyDown = (_this$props3 = this.props).onKeyDown) || void 0 === _this$props$onKeyDown ? void 0 : _this$props$onKeyDown.call(_this$props3, e)
            }
        }
    }
    get keyboardAction() {
        return {
            registerKeyboardAction: (element, action) => {
                var fakePagerInstance = this.createFakeInstance();
                return _registerKeyboardAction("pager", fakePagerInstance, element, void 0, action)
            }
        }
    }
    get infoVisible() {
        var {
            infoTextVisible: infoTextVisible,
            showInfo: showInfo
        } = this.props;
        return showInfo && infoTextVisible && this.isLargeDisplayMode
    }
    get pageIndexSelectorVisible() {
        return 0 !== this.__state_pageSize
    }
    get normalizedDisplayMode() {
        var {
            displayMode: displayMode,
            lightModeEnabled: lightModeEnabled
        } = this.props;
        if ("adaptive" === displayMode && void 0 !== lightModeEnabled) {
            return lightModeEnabled ? "compact" : "full"
        }
        return displayMode
    }
    get pagesContainerVisible() {
        return !!this.props.pagesNavigatorVisible && this.props.pageCount > 0
    }
    get pagesContainerVisibility() {
        if ("auto" === this.props.pagesNavigatorVisible && 1 === this.props.pageCount && this.props.hasKnownLastPage) {
            return "hidden"
        }
        return
    }
    get isLargeDisplayMode() {
        var displayMode = this.normalizedDisplayMode;
        var result = false;
        if ("adaptive" === displayMode) {
            result = this.props.isLargeDisplayMode
        } else {
            result = "full" === displayMode
        }
        return result
    }
    get classes() {
        var classesMap = {
            ["".concat(this.props.className)]: !!this.props.className,
            [PAGER_CLASS]: true,
            [LIGHT_MODE_CLASS]: !this.isLargeDisplayMode
        };
        return combineClasses(classesMap)
    }
    get restAttributes() {
        var _this$props$pageIndex2 = _extends({}, this.props, {
                pageIndex: this.__state_pageIndex,
                pageSize: this.__state_pageSize
            }),
            restProps = _objectWithoutPropertiesLoose(_this$props$pageIndex2, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageIndex: this.__state_pageIndex,
                pageSize: this.__state_pageSize
            }),
            widgetRootElementRef: this.widgetRootElementRef,
            keyboardAction: this.keyboardAction,
            infoVisible: this.infoVisible,
            pageIndexSelectorVisible: this.pageIndexSelectorVisible,
            pagesContainerVisible: this.pagesContainerVisible,
            pagesContainerVisibility: this.pagesContainerVisibility,
            isLargeDisplayMode: this.isLargeDisplayMode,
            classes: this.classes,
            restAttributes: this.restAttributes
        })
    }
}
PagerContent.defaultProps = _extends({}, PagerContentProps);
