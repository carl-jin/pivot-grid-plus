/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/timeline/header_panel/layout.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["baseColSpan", "className", "columnCountPerGroup", "dateCellTemplate", "dateHeaderData", "dateHeaderTemplate", "groupByDate", "groupOrientation", "groupPanelCellBaseColSpan", "groups", "height", "isRenderDateHeader", "resourceCellTemplate", "timeCellTemplate"];
import {
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoWrapperComponent
} from "@devextreme/vdom";
import {
    HeaderPanelLayout,
    HeaderPanelLayoutProps
} from "../../base/header_panel/layout";
import {
    TimelineDateHeaderLayout
} from "./date_header/layout";
export var viewFunction = _ref => {
    var {
        props: {
            columnCountPerGroup: columnCountPerGroup,
            dateCellTemplate: dateCellTemplate,
            dateHeaderData: dateHeaderData,
            groupByDate: groupByDate,
            groupOrientation: groupOrientation,
            groupPanelCellBaseColSpan: groupPanelCellBaseColSpan,
            groups: groups,
            isRenderDateHeader: isRenderDateHeader,
            resourceCellTemplate: resourceCellTemplate,
            timeCellTemplate: timeCellTemplate
        }
    } = _ref;
    return createComponentVNode(2, HeaderPanelLayout, {
        dateHeaderTemplate: TimelineDateHeaderLayout,
        dateHeaderData: dateHeaderData,
        groupByDate: groupByDate,
        groups: groups,
        groupOrientation: groupOrientation,
        groupPanelCellBaseColSpan: groupPanelCellBaseColSpan,
        columnCountPerGroup: columnCountPerGroup,
        isRenderDateHeader: isRenderDateHeader,
        resourceCellTemplate: resourceCellTemplate,
        dateCellTemplate: dateCellTemplate,
        timeCellTemplate: timeCellTemplate
    })
};
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class TimelineHeaderPanelLayout extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                dateCellTemplate: getTemplate(props.dateCellTemplate),
                timeCellTemplate: getTemplate(props.timeCellTemplate),
                dateHeaderTemplate: getTemplate(props.dateHeaderTemplate),
                resourceCellTemplate: getTemplate(props.resourceCellTemplate)
            }),
            restAttributes: this.restAttributes
        })
    }
}
TimelineHeaderPanelLayout.defaultProps = _extends({}, HeaderPanelLayoutProps);
