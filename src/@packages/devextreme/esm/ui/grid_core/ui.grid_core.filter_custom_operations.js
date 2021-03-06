/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.filter_custom_operations.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import messageLocalization from "../../localization/message";
import {
    extend
} from "../../core/utils/extend";
import {
    DataSource
} from "../../data/data_source/data_source";
import {
    Deferred
} from "../../core/utils/deferred";
import {
    isGroup,
    isCondition,
    getFilterExpression,
    renderValueText
} from "../filter_builder/utils";
import errors from "../widget/ui.errors";

function baseOperation(grid) {
    var getFullText = function(itemText, parentText) {
        return parentText ? parentText + "/" + itemText : itemText
    };
    var headerFilterController = grid && grid.getController("headerFilter");
    return {
        dataTypes: ["string", "date", "datetime", "number", "boolean", "object"],
        calculateFilterExpression: function(filterValue, field, fields) {
            var result = [];
            var lastIndex = filterValue.length - 1;
            filterValue && filterValue.forEach((function(value, index) {
                if (isCondition(value) || isGroup(value)) {
                    var filterExpression = getFilterExpression(value, fields, [], "headerFilter");
                    result.push(filterExpression)
                } else {
                    result.push(getFilterExpression([field.dataField, "=", value], fields, [], "headerFilter"))
                }
                index !== lastIndex && result.push("or")
            }));
            if (1 === result.length) {
                result = result[0]
            }
            return result
        },
        editorTemplate: function(conditionInfo, container) {
            var div = $("<div>").addClass("dx-filterbuilder-item-value-text").appendTo(container);
            var column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));
            renderValueText(div, conditionInfo.text && conditionInfo.text.split("|"));
            column.filterType = "include";
            column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];
            headerFilterController.showHeaderFilterMenuBase({
                columnElement: div,
                column: column,
                apply: function() {
                    value = this.filterValues, void conditionInfo.setValue(value);
                    var value;
                    headerFilterController.hideHeaderFilterMenu();
                    conditionInfo.closeEditor()
                },
                onHidden: function() {
                    conditionInfo.closeEditor()
                },
                isFilterBuilder: true
            });
            return container
        },
        customizeText: function(fieldInfo) {
            var value = fieldInfo.value;
            var column = grid.columnOption(fieldInfo.field.dataField);
            var headerFilter = column && column.headerFilter;
            var lookup = column && column.lookup;
            if (headerFilter && headerFilter.dataSource || lookup && lookup.dataSource) {
                column = extend({}, column, {
                    filterType: "include",
                    filterValues: [value]
                });
                var dataSourceOptions = headerFilterController.getDataSource(column);
                dataSourceOptions.paginate = false;
                var dataSource = new DataSource(dataSourceOptions);
                var result = new Deferred;
                var key = dataSource.store().key();
                if (key) {
                    dataSource.filter([key, "=", fieldInfo.value])
                } else if (fieldInfo.field.calculateDisplayValue) {
                    errors.log("W1017")
                }
                dataSource.load().done(items => {
                    result.resolve(function getSelectedItemsTexts(items, parentText) {
                        var result = [];
                        items.forEach((function(item) {
                            if (item.items) {
                                var selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
                                result = result.concat(selectedItemsTexts)
                            }
                            item.selected && result.push(getFullText(item.text, parentText))
                        }));
                        return result
                    }(items)[0])
                });
                return result
            } else {
                var text = headerFilterController.getHeaderItemText(value, column, 0, grid.option("headerFilter"));
                return text
            }
        }
    }
}
export function anyOf(grid) {
    return extend(baseOperation(grid), {
        name: "anyof",
        icon: "selectall",
        caption: messageLocalization.format("dxFilterBuilder-filterOperationAnyOf")
    })
}
export function noneOf(grid) {
    var baseOp = baseOperation(grid);
    return extend({}, baseOp, {
        calculateFilterExpression: function(filterValue, field, fields) {
            var baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
            if (!baseFilter || 0 === baseFilter.length) {
                return null
            }
            return "!" === baseFilter[0] ? baseFilter : ["!", baseFilter]
        },
        name: "noneof",
        icon: "unselectall",
        caption: messageLocalization.format("dxFilterBuilder-filterOperationNoneOf")
    })
}
