/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/header_panel/layout.js)
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
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoWrapperComponent
} from "@devextreme/vdom";
import {
    isHorizontalGroupOrientation
} from "../../utils";
import {
    GroupPanel
} from "../group_panel/group_panel";
import {
    GroupPanelProps
} from "../group_panel/group_panel_props";
import {
    DateHeaderLayout
} from "./date_header/layout";
export var viewFunction = _ref => {
    var {
        isHorizontalGrouping: isHorizontalGrouping,
        props: {
            columnCountPerGroup: columnCountPerGroup,
            dateCellTemplate: dateCellTemplate,
            dateHeaderData: dateHeaderData,
            dateHeaderTemplate: DateHeader,
            groupByDate: groupByDate,
            groupOrientation: groupOrientation,
            groupPanelCellBaseColSpan: groupPanelCellBaseColSpan,
            groups: groups,
            isRenderDateHeader: isRenderDateHeader,
            resourceCellTemplate: resourceCellTemplate,
            timeCellTemplate: timeCellTemplate
        }
    } = _ref;
    return createVNode(1, "thead", null, [isHorizontalGrouping && !groupByDate && createComponentVNode(2, GroupPanel, {
        groups: groups,
        groupByDate: groupByDate,
        groupOrientation: groupOrientation,
        baseColSpan: groupPanelCellBaseColSpan,
        columnCountPerGroup: columnCountPerGroup,
        resourceCellTemplate: resourceCellTemplate
    }), isRenderDateHeader && DateHeader({
        groupByDate: groupByDate,
        dateHeaderData: dateHeaderData,
        groupOrientation: groupOrientation,
        groups: groups,
        dateCellTemplate: dateCellTemplate,
        timeCellTemplate: timeCellTemplate
    }), groupByDate && createComponentVNode(2, GroupPanel, {
        groups: groups,
        groupByDate: groupByDate,
        groupOrientation: groupOrientation,
        baseColSpan: groupPanelCellBaseColSpan,
        columnCountPerGroup: columnCountPerGroup,
        resourceCellTemplate: resourceCellTemplate
    })], 0)
};
export var HeaderPanelLayoutProps = _extends({}, GroupPanelProps, {
    isRenderDateHeader: true,
    groupPanelCellBaseColSpan: 1,
    dateHeaderTemplate: DateHeaderLayout
});
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class HeaderPanelLayout extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get isHorizontalGrouping() {
        var {
            groupOrientation: groupOrientation,
            groups: groups
        } = this.props;
        return isHorizontalGroupOrientation(groups, groupOrientation)
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
            isHorizontalGrouping: this.isHorizontalGrouping,
            restAttributes: this.restAttributes
        })
    }
}
HeaderPanelLayout.defaultProps = _extends({}, HeaderPanelLayoutProps);
