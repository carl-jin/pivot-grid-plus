/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/month/date_table/cell.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["allDay", "children", "className", "contentTemplate", "contentTemplateProps", "dataCellTemplate", "endDate", "firstDayOfMonth", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "otherMonth", "startDate", "text", "today"];
import {
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    combineClasses
} from "../../../../../utils/combine_classes";
import {
    DateTableCellBase,
    DateTableCellBaseProps
} from "../../base/date_table/cell";
export var viewFunction = _ref => {
    var {
        classes: classes,
        contentTemplateProps: contentTemplateProps,
        props: {
            dataCellTemplate: dataCellTemplate,
            endDate: endDate,
            groupIndex: groupIndex,
            groups: groups,
            index: index,
            isFirstGroupCell: isFirstGroupCell,
            isLastGroupCell: isLastGroupCell,
            startDate: startDate,
            text: text
        }
    } = _ref;
    return createComponentVNode(2, DateTableCellBase, {
        className: classes,
        dataCellTemplate: dataCellTemplate,
        startDate: startDate,
        endDate: endDate,
        text: text,
        groups: groups,
        groupIndex: groupIndex,
        index: index,
        isFirstGroupCell: isFirstGroupCell,
        isLastGroupCell: isLastGroupCell,
        contentTemplateProps: contentTemplateProps,
        children: createVNode(1, "div", "dx-scheduler-date-table-cell-text", text, 0)
    })
};
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class MonthDateTableCell extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get classes() {
        var {
            className: className,
            firstDayOfMonth: firstDayOfMonth,
            otherMonth: otherMonth,
            today: today
        } = this.props;
        return combineClasses({
            "dx-scheduler-date-table-other-month": !!otherMonth,
            "dx-scheduler-date-table-current-date": !!today,
            "dx-scheduler-date-table-first-of-month": !!firstDayOfMonth,
            [className]: !!className
        })
    }
    get contentTemplateProps() {
        var {
            index: index,
            text: text
        } = this.props;
        return {
            data: {
                text: text
            },
            index: index
        }
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
                dataCellTemplate: getTemplate(props.dataCellTemplate),
                contentTemplate: getTemplate(props.contentTemplate)
            }),
            classes: this.classes,
            contentTemplateProps: this.contentTemplateProps,
            restAttributes: this.restAttributes
        })
    }
}
MonthDateTableCell.defaultProps = _extends({}, DateTableCellBaseProps);
