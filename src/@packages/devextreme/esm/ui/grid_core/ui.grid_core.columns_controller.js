/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.columns_controller.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import $ from "../../core/renderer";
import Callbacks from "../../core/utils/callbacks";
import variableWrapper from "../../core/utils/variable_wrapper";
import {
    compileGetter,
    compileSetter
} from "../../core/utils/data";
import {
    grep
} from "../../core/utils/common";
import {
    isDefined,
    isString,
    isNumeric,
    isFunction,
    isObject,
    isPlainObject,
    type
} from "../../core/utils/type";
import {
    each,
    map
} from "../../core/utils/iterator";
import {
    getDefaultAlignment
} from "../../core/utils/position";
import {
    extend
} from "../../core/utils/extend";
import {
    inArray,
    normalizeIndexes
} from "../../core/utils/array";
import config from "../../core/config";
import {
    orderEach,
    deepExtendArraySafe
} from "../../core/utils/object";
import errors from "../widget/ui.errors";
import modules from "./ui.grid_core.modules";
import gridCoreUtils from "./ui.grid_core.utils";
import {
    captionize
} from "../../core/utils/inflector";
import dateSerialization from "../../core/utils/date_serialization";
import numberLocalization from "../../localization/number";
import dateLocalization from "../../localization/date";
import messageLocalization from "../../localization/message";
import {
    when,
    Deferred
} from "../../core/utils/deferred";
import Store from "../../data/abstract_store";
import {
    DataSource
} from "../../data/data_source/data_source";
import {
    normalizeDataSourceOptions
} from "../../data/data_source/utils";
import filterUtils from "../shared/filtering";
var USER_STATE_FIELD_NAMES_15_1 = ["filterValues", "filterType", "fixed", "fixedPosition"];
var USER_STATE_FIELD_NAMES = ["visibleIndex", "dataField", "name", "dataType", "width", "visible", "sortOrder", "lastSortOrder", "sortIndex", "groupIndex", "filterValue", "selectedFilterOperation", "added"].concat(USER_STATE_FIELD_NAMES_15_1);
var IGNORE_COLUMN_OPTION_NAMES = {
    visibleWidth: true,
    bestFitWidth: true,
    bufferedFilterValue: true
};
var COMMAND_EXPAND_CLASS = "dx-command-expand";
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
var GROUP_COMMAND_COLUMN_NAME = "groupExpand";
var regExp = /columns\[(\d+)\]\.?/gi;
var globalColumnId = 1;
export var columnsControllerModule = {
    defaultOptions: function() {
        return {
            commonColumnSettings: {
                allowFiltering: true,
                allowHiding: true,
                allowSorting: true,
                allowEditing: true,
                encodeHtml: true,
                trueText: messageLocalization.format("dxDataGrid-trueText"),
                falseText: messageLocalization.format("dxDataGrid-falseText")
            },
            allowColumnReordering: false,
            allowColumnResizing: false,
            columnResizingMode: "nextColumn",
            columnMinWidth: void 0,
            columnWidth: void 0,
            adaptColumnWidthByRatio: true,
            columns: void 0,
            regenerateColumnsByVisibleItems: false,
            customizeColumns: null,
            dateSerializationFormat: void 0
        }
    },
    controllers: {
        columns: modules.Controller.inherit(function() {
            var DEFAULT_COLUMN_OPTIONS = {
                visible: true,
                showInColumnChooser: true
            };
            var DATATYPE_OPERATIONS = {
                number: ["=", "<>", "<", ">", "<=", ">=", "between"],
                string: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
                date: ["=", "<>", "<", ">", "<=", ">=", "between"],
                datetime: ["=", "<>", "<", ">", "<=", ">=", "between"]
            };
            var COLUMN_INDEX_OPTIONS = {
                visibleIndex: true,
                groupIndex: true,
                grouped: true,
                sortIndex: true,
                sortOrder: true
            };
            var setFilterOperationsAsDefaultValues = function(column) {
                column.filterOperations = column.defaultFilterOperations
            };
            var createColumn = function(that, columnOptions, userStateColumnOptions, bandColumn) {
                var commonColumnOptions = {};
                if (columnOptions) {
                    if (isString(columnOptions)) {
                        columnOptions = {
                            dataField: columnOptions
                        }
                    }
                    that.setName(columnOptions);
                    var result = {};
                    if (columnOptions.command) {
                        result = deepExtendArraySafe(commonColumnOptions, columnOptions)
                    } else {
                        commonColumnOptions = that.getCommonSettings(columnOptions);
                        if (userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
                            columnOptions = extend({}, columnOptions, {
                                dataField: userStateColumnOptions.dataField
                            })
                        }
                        var calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);
                        if (!columnOptions.type) {
                            result = {
                                headerId: "dx-col-".concat(globalColumnId++)
                            }
                        }
                        result = deepExtendArraySafe(result, DEFAULT_COLUMN_OPTIONS);
                        deepExtendArraySafe(result, commonColumnOptions);
                        deepExtendArraySafe(result, calculatedColumnOptions);
                        deepExtendArraySafe(result, columnOptions);
                        deepExtendArraySafe(result, {
                            selector: null
                        })
                    }
                    if (columnOptions.filterOperations === columnOptions.defaultFilterOperations) {
                        setFilterOperationsAsDefaultValues(result)
                    }
                    return result
                }
            };
            var createColumnsFromOptions = function createColumnsFromOptions(that, columnsOptions, bandColumn) {
                var result = [];
                if (columnsOptions) {
                    each(columnsOptions, (function(index, columnOptions) {
                        var userStateColumnOptions = that._columnsUserState && checkUserStateColumn(columnOptions, that._columnsUserState[index]) && that._columnsUserState[index];
                        var column = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);
                        if (column) {
                            if (bandColumn) {
                                column.ownerBand = bandColumn
                            }
                            result.push(column);
                            if (column.columns) {
                                result = result.concat(createColumnsFromOptions(that, column.columns, column));
                                delete column.columns;
                                column.hasColumns = true
                            }
                        }
                    }))
                }
                return result
            };
            var getParentBandColumns = function(columnIndex, columnParentByIndex) {
                var result = [];
                var parent = columnParentByIndex[columnIndex];
                while (parent) {
                    result.unshift(parent);
                    columnIndex = parent.index;
                    parent = columnParentByIndex[columnIndex]
                }
                return result
            };
            var _getChildrenByBandColumn = function(columnIndex, columnChildrenByIndex, recursive) {
                var result = [];
                var children = columnChildrenByIndex[columnIndex];
                if (children) {
                    for (var i = 0; i < children.length; i++) {
                        var column = children[i];
                        if (!isDefined(column.groupIndex) || column.showWhenGrouped) {
                            result.push(column);
                            if (recursive && column.isBand) {
                                result = result.concat(_getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive))
                            }
                        }
                    }
                }
                return result
            };
            var getColumnFullPath = function(that, column) {
                var result = [];
                var columns;
                var bandColumnsCache = that.getBandColumnsCache();
                var callbackFilter = function(item) {
                    return item.ownerBand === column.ownerBand
                };
                if (bandColumnsCache.isPlain) {
                    var columnIndex = that._columns.indexOf(column);
                    if (columnIndex >= 0) {
                        result = ["columns[".concat(columnIndex, "]")]
                    }
                } else {
                    columns = that._columns.filter(callbackFilter);
                    while (columns.length && -1 !== columns.indexOf(column)) {
                        result.unshift("columns[".concat(columns.indexOf(column), "]"));
                        column = bandColumnsCache.columnParentByIndex[column.index];
                        columns = column ? that._columns.filter(callbackFilter) : []
                    }
                }
                return result.join(".")
            };
            var calculateColspan = function calculateColspan(that, columnID) {
                var colspan = 0;
                var columns = that.getChildrenByBandColumn(columnID, true);
                each(columns, (function(_, column) {
                    if (column.isBand) {
                        column.colspan = column.colspan || calculateColspan(that, column.index);
                        colspan += column.colspan || 1
                    } else {
                        colspan += 1
                    }
                }));
                return colspan
            };
            var getValueDataType = function(value) {
                var dataType = type(value);
                if ("string" !== dataType && "boolean" !== dataType && "number" !== dataType && "date" !== dataType && "object" !== dataType) {
                    dataType = void 0
                }
                return dataType
            };
            var getSerializationFormat = function(dataType, value) {
                switch (dataType) {
                    case "date":
                    case "datetime":
                        return dateSerialization.getDateSerializationFormat(value);
                    case "number":
                        if (isString(value)) {
                            return "string"
                        }
                        if (isNumeric(value)) {
                            return null
                        }
                }
            };
            var updateSerializers = function(options, dataType) {
                if (!options.deserializeValue) {
                    if (gridCoreUtils.isDateType(dataType)) {
                        options.deserializeValue = function(value) {
                            return dateSerialization.deserializeDate(value)
                        };
                        options.serializeValue = function(value) {
                            return isString(value) ? value : dateSerialization.serializeDate(value, this.serializationFormat)
                        }
                    }
                    if ("number" === dataType) {
                        options.deserializeValue = function(value) {
                            var parsedValue = parseFloat(value);
                            return isNaN(parsedValue) ? value : parsedValue
                        };
                        options.serializeValue = function(value, target) {
                            if ("filter" === target) {
                                return value
                            }
                            return isDefined(value) && "string" === this.serializationFormat ? value.toString() : value
                        }
                    }
                }
            };
            var customizeTextForBooleanDataType = function(e) {
                if (true === e.value) {
                    return this.trueText || "true"
                } else if (false === e.value) {
                    return this.falseText || "false"
                } else {
                    return e.valueText || ""
                }
            };
            var getCustomizeTextByDataType = function(dataType) {
                if ("boolean" === dataType) {
                    return customizeTextForBooleanDataType
                }
            };
            var updateColumnIndexes = function(that) {
                each(that._columns, (function(index, column) {
                    column.index = index
                }));
                each(that._columns, (function(index, column) {
                    if (isObject(column.ownerBand)) {
                        column.ownerBand = column.ownerBand.index
                    }
                }));
                each(that._commandColumns, (function(index, column) {
                    column.index = -(index + 1)
                }))
            };
            var updateColumnGroupIndexes = function(that, currentColumn) {
                normalizeIndexes(that._columns, "groupIndex", currentColumn, (function(column) {
                    var grouped = column.grouped;
                    delete column.grouped;
                    return grouped
                }))
            };
            var getColumnIndexByVisibleIndex = function(that, visibleIndex, location) {
                var rowIndex = isObject(visibleIndex) ? visibleIndex.rowIndex : null;
                var columns = "group" === location ? that.getGroupColumns() : "columnChooser" === location ? that.getChooserColumns() : that.getVisibleColumns(rowIndex);
                var column;
                visibleIndex = isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
                column = columns[visibleIndex];
                if (column && column.type === GROUP_COMMAND_COLUMN_NAME) {
                    column = that._columns.filter(col => column.type === col.type)[0] || column
                }
                return column && isDefined(column.index) ? column.index : -1
            };

            function checkUserStateColumn(column, userStateColumn) {
                return column && userStateColumn && (userStateColumn.name === column.name || !column.name) && (userStateColumn.dataField === column.dataField || column.name)
            }
            var applyUserState = function(that) {
                var columnsUserState = that._columnsUserState;
                var ignoreColumnOptionNames = that._ignoreColumnOptionNames || [];
                var columns = that._columns;
                var columnCountById = {};
                var resultColumns = [];
                var allColumnsHaveState = true;
                var userStateColumnIndexes = [];
                var column;
                var userStateColumnIndex;
                var i;

                function applyFieldsState(column, userStateColumn) {
                    if (!userStateColumn) {
                        return
                    }
                    for (var index = 0; index < USER_STATE_FIELD_NAMES.length; index++) {
                        var fieldName = USER_STATE_FIELD_NAMES[index];
                        if (inArray(fieldName, ignoreColumnOptionNames) >= 0) {
                            continue
                        }
                        if ("dataType" === fieldName) {
                            column[fieldName] = column[fieldName] || userStateColumn[fieldName]
                        } else if (inArray(fieldName, USER_STATE_FIELD_NAMES_15_1) >= 0) {
                            if (fieldName in userStateColumn) {
                                column[fieldName] = userStateColumn[fieldName]
                            }
                        } else {
                            if ("selectedFilterOperation" === fieldName && userStateColumn[fieldName]) {
                                column.defaultSelectedFilterOperation = column[fieldName] || null
                            }
                            column[fieldName] = userStateColumn[fieldName]
                        }
                    }
                }

                function findUserStateColumn(columnsUserState, column) {
                    var id = column.name || column.dataField;
                    var count = columnCountById[id] || 0;
                    for (var j = 0; j < columnsUserState.length; j++) {
                        if (checkUserStateColumn(column, columnsUserState[j])) {
                            if (count) {
                                count--
                            } else {
                                columnCountById[id] = columnCountById[id] || 0;
                                columnCountById[id]++;
                                return j
                            }
                        }
                    }
                    return -1
                }
                if (columnsUserState) {
                    for (i = 0; i < columns.length; i++) {
                        userStateColumnIndex = findUserStateColumn(columnsUserState, columns[i]);
                        allColumnsHaveState = allColumnsHaveState && userStateColumnIndex >= 0;
                        userStateColumnIndexes.push(userStateColumnIndex)
                    }
                    for (i = 0; i < columns.length; i++) {
                        column = columns[i];
                        userStateColumnIndex = userStateColumnIndexes[i];
                        if (that._hasUserState || allColumnsHaveState) {
                            applyFieldsState(column, columnsUserState[userStateColumnIndex])
                        }
                        if (userStateColumnIndex >= 0 && isDefined(columnsUserState[userStateColumnIndex].initialIndex)) {
                            resultColumns[userStateColumnIndex] = column
                        } else {
                            resultColumns.push(column)
                        }
                    }
                    var hasAddedBands = false;
                    for (i = 0; i < columnsUserState.length; i++) {
                        var columnUserState = columnsUserState[i];
                        if (columnUserState.added && findUserStateColumn(columns, columnUserState) < 0) {
                            column = createColumn(that, columnUserState.added);
                            applyFieldsState(column, columnUserState);
                            resultColumns.push(column);
                            if (columnUserState.added.columns) {
                                hasAddedBands = true
                            }
                        }
                    }
                    if (hasAddedBands) {
                        updateColumnIndexes(that);
                        resultColumns = createColumnsFromOptions(that, resultColumns)
                    }
                    assignColumns(that, resultColumns)
                }
            };
            var updateIndexes = function(that, column) {
                updateColumnIndexes(that);
                updateColumnGroupIndexes(that, column);
                ! function(that, currentColumn) {
                    each(that._columns, (function(index, column) {
                        if (isDefined(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
                            delete column.sortIndex
                        }
                    }));
                    normalizeIndexes(that._columns, "sortIndex", currentColumn, (function(column) {
                        return !isDefined(column.groupIndex) && isSortOrderValid(column.sortOrder)
                    }))
                }(that, column);
                resetBandColumnsCache(that);
                ! function(that, currentColumn) {
                    var key;
                    var column;
                    var bandColumns = {};
                    var result = [];
                    var bandColumnsCache = that.getBandColumnsCache();
                    var columns = that._columns.filter(column => !column.command);
                    for (var i = 0; i < columns.length; i++) {
                        column = columns[i];
                        var parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);
                        if (parentBandColumns.length) {
                            var bandColumnIndex = parentBandColumns[parentBandColumns.length - 1].index;
                            bandColumns[bandColumnIndex] = bandColumns[bandColumnIndex] || [];
                            bandColumns[bandColumnIndex].push(column)
                        } else {
                            result.push(column)
                        }
                    }
                    for (key in bandColumns) {
                        normalizeIndexes(bandColumns[key], "visibleIndex", currentColumn)
                    }
                    normalizeIndexes(result, "visibleIndex", currentColumn)
                }(that, column)
            };
            var resetColumnsCache = function(that) {
                that.resetColumnsCache()
            };

            function assignColumns(that, columns) {
                that._columns = columns;
                resetColumnsCache(that);
                that.updateColumnDataTypes()
            }
            var updateColumnChanges = function(that, changeType, optionName, columnIndex) {
                var columnChanges = that._columnChanges || {
                    optionNames: {
                        length: 0
                    },
                    changeTypes: {
                        length: 0
                    },
                    columnIndex: columnIndex
                };
                optionName = optionName || "all";
                optionName = optionName.split(".")[0];
                var changeTypes = columnChanges.changeTypes;
                if (changeType && !changeTypes[changeType]) {
                    changeTypes[changeType] = true;
                    changeTypes.length++
                }
                var optionNames = columnChanges.optionNames;
                if (optionName && !optionNames[optionName]) {
                    optionNames[optionName] = true;
                    optionNames.length++
                }
                if (void 0 === columnIndex || columnIndex !== columnChanges.columnIndex) {
                    delete columnChanges.columnIndex
                }
                that._columnChanges = columnChanges;
                resetColumnsCache(that)
            };
            var fireColumnsChanged = function(that) {
                var onColumnsChanging = that.option("onColumnsChanging");
                var columnChanges = that._columnChanges;
                var reinitOptionNames = ["dataField", "lookup", "dataType", "columns"];
                if (that.isInitialized() && !that._updateLockCount && columnChanges) {
                    if (onColumnsChanging) {
                        that._updateLockCount++;
                        onColumnsChanging(extend({
                            component: that.component
                        }, columnChanges));
                        that._updateLockCount--
                    }
                    that._columnChanges = void 0;
                    if (options = columnChanges.optionNames, options && reinitOptionNames.some(name => options[name])) {
                        that.reinit()
                    } else {
                        that.columnsChanged.fire(columnChanges)
                    }
                }
                var options
            };
            var updateSortOrderWhenGrouping = function(that, column, groupIndex, prevGroupIndex) {
                var columnWasGrouped = prevGroupIndex >= 0;
                if (groupIndex >= 0) {
                    if (!columnWasGrouped) {
                        column.lastSortOrder = column.sortOrder
                    }
                } else {
                    var sortMode = that.option("sorting.mode");
                    var sortOrder = column.lastSortOrder;
                    if ("single" === sortMode) {
                        var sortedByAnotherColumn = that._columns.some(col => col !== column && isDefined(col.sortIndex));
                        if (sortedByAnotherColumn) {
                            sortOrder = void 0
                        }
                    }
                    column.sortOrder = sortOrder
                }
            };
            var fireOptionChanged = function(that, options) {
                var value = options.value;
                var optionName = options.optionName;
                var prevValue = options.prevValue;
                var fullOptionName = options.fullOptionName;
                var fullOptionPath = "".concat(fullOptionName, ".").concat(optionName);
                if (!IGNORE_COLUMN_OPTION_NAMES[optionName] && that._skipProcessingColumnsChange !== fullOptionPath) {
                    that._skipProcessingColumnsChange = fullOptionPath;
                    that.component._notifyOptionChanged(fullOptionPath, value, prevValue);
                    that._skipProcessingColumnsChange = false
                }
            };
            var columnOptionCore = function(that, column, optionName, value, notFireEvent) {
                var optionGetter = compileGetter(optionName);
                var columnIndex = column.index;
                var columns;
                var changeType;
                var initialColumn;
                if (3 === arguments.length) {
                    return optionGetter(column, {
                        functionsAsIs: true
                    })
                }
                var prevValue = optionGetter(column, {
                    functionsAsIs: true
                });
                if (prevValue !== value) {
                    if ("groupIndex" === optionName || "calculateGroupValue" === optionName) {
                        changeType = "grouping";
                        updateSortOrderWhenGrouping(that, column, value, prevValue)
                    } else if ("sortIndex" === optionName || "sortOrder" === optionName || "calculateSortValue" === optionName) {
                        changeType = "sorting"
                    } else {
                        changeType = "columns"
                    }
                    var optionSetter = compileSetter(optionName);
                    optionSetter(column, value, {
                        functionsAsIs: true
                    });
                    var fullOptionName = getColumnFullPath(that, column);
                    if (COLUMN_INDEX_OPTIONS[optionName]) {
                        updateIndexes(that, column);
                        value = optionGetter(column)
                    }
                    if ("name" === optionName || "allowEditing" === optionName) {
                        that._checkColumns()
                    }
                    fullOptionName && fireOptionChanged(that, {
                        fullOptionName: fullOptionName,
                        optionName: optionName,
                        value: value,
                        prevValue: prevValue
                    });
                    if (!isDefined(prevValue) && !isDefined(value) && 0 !== optionName.indexOf("buffer")) {
                        notFireEvent = true
                    }
                    if (!notFireEvent) {
                        if (inArray(optionName, USER_STATE_FIELD_NAMES) < 0 && "visibleWidth" !== optionName) {
                            columns = that.option("columns");
                            initialColumn = that.getColumnByPath(fullOptionName, columns);
                            if (isString(initialColumn)) {
                                initialColumn = columns[columnIndex] = {
                                    dataField: initialColumn
                                }
                            }
                            if (initialColumn && checkUserStateColumn(initialColumn, column)) {
                                optionSetter(initialColumn, value, {
                                    functionsAsIs: true
                                })
                            }
                        }
                        updateColumnChanges(that, changeType, optionName, columnIndex)
                    } else {
                        resetColumnsCache(that)
                    }
                }
            };

            function isSortOrderValid(sortOrder) {
                return "asc" === sortOrder || "desc" === sortOrder
            }
            var defaultSetCellValue = function(data, value) {
                var path = this.dataField.split(".");
                var dotCount = path.length - 1;
                if (this.serializeValue) {
                    value = this.serializeValue(value)
                }
                for (var i = 0; i < dotCount; i++) {
                    var name = path[i];
                    data = data[name] = data[name] || {}
                }
                data[path[dotCount]] = value
            };
            var isCustomCommandColumn = (that, commandColumn) => !!that._columns.filter(column => column.type === commandColumn.type).length;
            var getFixedPosition = function(that, column) {
                var rtlEnabled = that.option("rtlEnabled");
                if (column.command && !isCustomCommandColumn(that, column) || !column.fixedPosition) {
                    return rtlEnabled ? "right" : "left"
                }
                return column.fixedPosition
            };
            var processExpandColumns = function(columns, expandColumns, type, columnIndex) {
                var customColumnIndex;
                var rowCount = this.getRowCount();
                var rowspan = columns[columnIndex] && columns[columnIndex].rowspan;
                var expandColumnsByType = expandColumns.filter(column => column.type === type);
                columns.forEach((column, index) => {
                    if (column.type === type) {
                        customColumnIndex = index;
                        rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount
                    }
                });
                if (rowspan > 1) {
                    expandColumnsByType = map(expandColumnsByType, (function(expandColumn) {
                        return extend({}, expandColumn, {
                            rowspan: rowspan
                        })
                    }))
                }
                expandColumnsByType.unshift.apply(expandColumnsByType, isDefined(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
                columns.splice.apply(columns, expandColumnsByType);
                return rowspan || 1
            };
            var numberToString = function(number, digitsCount) {
                var str = number ? number.toString() : "0";
                while (str.length < digitsCount) {
                    str = "0" + str
                }
                return str
            };
            var mergeColumns = (that, columns, commandColumns, needToExtend) => {
                var column;
                var commandColumnIndex;
                var result = columns.slice().map(column => extend({}, column));
                var isColumnFixing = that._isColumnFixing();
                var defaultCommandColumns = commandColumns.slice().map(column => extend({
                    fixed: isColumnFixing
                }, column));
                var getCommandColumnIndex = column => commandColumns.reduce((result, commandColumn, index) => {
                    var columnType = needToExtend && column.type === GROUP_COMMAND_COLUMN_NAME ? "expand" : column.type;
                    return commandColumn.type === columnType || commandColumn.command === column.command ? index : result
                }, -1);
                var callbackFilter = commandColumn => commandColumn.command !== commandColumns[commandColumnIndex].command;
                for (var i = 0; i < columns.length; i++) {
                    column = columns[i];
                    commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;
                    if (commandColumnIndex >= 0) {
                        if (needToExtend) {
                            result[i] = extend({
                                fixed: isColumnFixing
                            }, commandColumns[commandColumnIndex], column);
                            if (column.type !== GROUP_COMMAND_COLUMN_NAME) {
                                defaultCommandColumns = defaultCommandColumns.filter(callbackFilter)
                            }
                        } else {
                            var columnOptions = {
                                visibleIndex: column.visibleIndex,
                                index: column.index,
                                headerId: column.headerId,
                                allowFixing: 0 === column.groupIndex,
                                allowReordering: 0 === column.groupIndex,
                                groupIndex: column.groupIndex
                            };
                            result[i] = extend({}, column, commandColumns[commandColumnIndex], column.type === GROUP_COMMAND_COLUMN_NAME && columnOptions)
                        }
                    }
                }
                if (columns.length && needToExtend && defaultCommandColumns.length) {
                    result = result.concat(defaultCommandColumns)
                }
                return result
            };
            var isColumnFixed = (that, column) => isDefined(column.fixed) || !column.type ? column.fixed : that._isColumnFixing();
            var resetBandColumnsCache = that => {
                that._bandColumnsCache = void 0
            };
            var findColumn = (columns, identifier) => {
                var identifierOptionName = isString(identifier) && identifier.substr(0, identifier.indexOf(":"));
                var column;
                if (void 0 === identifier) {
                    return
                }
                if (identifierOptionName) {
                    identifier = identifier.substr(identifierOptionName.length + 1)
                }
                if (identifierOptionName) {
                    column = columns.filter(column => "" + column[identifierOptionName] === identifier)[0]
                } else {
                    ["index", "name", "dataField", "caption"].some(optionName => {
                        column = columns.filter(column => column[optionName] === identifier)[0];
                        return !!column
                    })
                }
                return column
            };
            return {
                _getExpandColumnOptions: function() {
                    return {
                        type: "expand",
                        command: "expand",
                        width: "auto",
                        cssClass: COMMAND_EXPAND_CLASS,
                        allowEditing: false,
                        allowGrouping: false,
                        allowSorting: false,
                        allowResizing: false,
                        allowReordering: false,
                        allowHiding: false
                    }
                },
                _getFirstItems: function(dataSource) {
                    var groupsCount;
                    var items = [];
                    if (dataSource && dataSource.items().length > 0) {
                        groupsCount = gridCoreUtils.normalizeSortingInfo(dataSource.group()).length;
                        items = function getFirstItemsCore(items, groupsCount) {
                            if (!items || !groupsCount) {
                                return items
                            }
                            for (var i = 0; i < items.length; i++) {
                                var childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);
                                if (childItems && childItems.length) {
                                    return childItems
                                }
                            }
                        }(dataSource.items(), groupsCount) || []
                    }
                    return items
                },
                _endUpdateCore: function() {
                    !this._skipProcessingColumnsChange && fireColumnsChanged(this)
                },
                init: function() {
                    var columns = this.option("columns");
                    this._commandColumns = this._commandColumns || [];
                    this._columns = this._columns || [];
                    this._isColumnsFromOptions = !!columns;
                    if (this._isColumnsFromOptions) {
                        assignColumns(this, columns ? createColumnsFromOptions(this, columns) : []);
                        applyUserState(this)
                    } else {
                        assignColumns(this, this._columnsUserState ? createColumnsFromOptions(this, this._columnsUserState) : this._columns)
                    }! function(that) {
                        var options = that._getExpandColumnOptions();
                        that.addCommandColumn(options)
                    }(this);
                    if (this._dataSourceApplied) {
                        this.applyDataSource(this._dataSource, true)
                    } else {
                        updateIndexes(this)
                    }
                    this._checkColumns()
                },
                callbackNames: function() {
                    return ["columnsChanged"]
                },
                getColumnByPath: function(path, columns) {
                    var column;
                    var columnIndexes = [];
                    path.replace(regExp, (function(_, columnIndex) {
                        columnIndexes.push(parseInt(columnIndex));
                        return ""
                    }));
                    if (columnIndexes.length) {
                        if (columns) {
                            column = columnIndexes.reduce((function(column, index) {
                                return column && column.columns && column.columns[index]
                            }), {
                                columns: columns
                            })
                        } else {
                            column = function(that, columnIndexes) {
                                var result;
                                var columns;
                                var bandColumnsCache = that.getBandColumnsCache();
                                var callbackFilter = function(column) {
                                    var ownerBand = result ? result.index : void 0;
                                    return column.ownerBand === ownerBand
                                };
                                if (bandColumnsCache.isPlain) {
                                    result = that._columns[columnIndexes[0]]
                                } else {
                                    columns = that._columns.filter(callbackFilter);
                                    for (var i = 0; i < columnIndexes.length; i++) {
                                        result = columns[columnIndexes[i]];
                                        if (result) {
                                            columns = that._columns.filter(callbackFilter)
                                        }
                                    }
                                }
                                return result
                            }(this, columnIndexes)
                        }
                    }
                    return column
                },
                optionChanged: function(args) {
                    var needUpdateRequireResize;
                    switch (args.name) {
                        case "adaptColumnWidthByRatio":
                            args.handled = true;
                            break;
                        case "dataSource":
                            if (args.value !== args.previousValue && !this.option("columns") && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
                                this._columns = []
                            }
                            break;
                        case "columns":
                            needUpdateRequireResize = this._skipProcessingColumnsChange;
                            args.handled = true;
                            if (!this._skipProcessingColumnsChange) {
                                if (args.name === args.fullName) {
                                    this._columnsUserState = null;
                                    this._ignoreColumnOptionNames = null;
                                    this.init()
                                } else {
                                    this._columnOptionChanged(args);
                                    needUpdateRequireResize = true
                                }
                            }
                            if (needUpdateRequireResize) {
                                this._updateRequireResize(args)
                            }
                            break;
                        case "commonColumnSettings":
                        case "columnAutoWidth":
                        case "allowColumnResizing":
                        case "allowColumnReordering":
                        case "columnFixing":
                        case "grouping":
                        case "groupPanel":
                        case "regenerateColumnsByVisibleItems":
                        case "customizeColumns":
                        case "columnHidingEnabled":
                        case "dateSerializationFormat":
                        case "columnResizingMode":
                        case "columnMinWidth":
                        case "columnWidth":
                            args.handled = true;
                            var ignoreColumnOptionNames = "columnWidth" === args.fullName && ["width"];
                            this.reinit(ignoreColumnOptionNames);
                            break;
                        case "rtlEnabled":
                            this.reinit();
                            break;
                        default:
                            this.callBase(args)
                    }
                },
                _columnOptionChanged: function(args) {
                    var columnOptionValue = {};
                    var column = this.getColumnByPath(args.fullName);
                    var columnOptionName = args.fullName.replace(regExp, "");
                    if (column) {
                        if (columnOptionName) {
                            columnOptionValue[columnOptionName] = args.value
                        } else {
                            columnOptionValue = args.value
                        }
                        this._skipProcessingColumnsChange = args.fullName;
                        this.columnOption(column.index, columnOptionValue);
                        this._skipProcessingColumnsChange = false
                    }
                },
                _updateRequireResize: function(args) {
                    var component = this.component;
                    if ("width" === args.fullName.replace(regExp, "") && component._updateLockCount) {
                        component._requireResize = true
                    }
                },
                publicMethods: function() {
                    return ["addColumn", "deleteColumn", "columnOption", "columnCount", "clearSorting", "clearGrouping", "getVisibleColumns", "getVisibleColumnIndex"]
                },
                applyDataSource: function(dataSource, forceApplying) {
                    var isDataSourceLoaded = dataSource && dataSource.isLoaded();
                    this._dataSource = dataSource;
                    if (!this._dataSourceApplied || 0 === this._dataSourceColumnsCount || forceApplying || this.option("regenerateColumnsByVisibleItems")) {
                        if (isDataSourceLoaded) {
                            if (!this._isColumnsFromOptions) {
                                var columnsFromDataSource = function(that, dataSource) {
                                    var firstItems = that._getFirstItems(dataSource);
                                    var fieldName;
                                    var processedFields = {};
                                    var result = [];
                                    for (var i = 0; i < firstItems.length; i++) {
                                        if (firstItems[i]) {
                                            for (fieldName in firstItems[i]) {
                                                if (!isFunction(firstItems[i][fieldName]) || variableWrapper.isWrapped(firstItems[i][fieldName])) {
                                                    processedFields[fieldName] = true
                                                }
                                            }
                                        }
                                    }
                                    for (fieldName in processedFields) {
                                        if (0 !== fieldName.indexOf("__")) {
                                            var column = createColumn(that, fieldName);
                                            result.push(column)
                                        }
                                    }
                                    return result
                                }(this, dataSource);
                                if (columnsFromDataSource.length) {
                                    assignColumns(this, columnsFromDataSource);
                                    this._dataSourceColumnsCount = this._columns.length;
                                    applyUserState(this)
                                }
                            }
                            return this.updateColumns(dataSource, forceApplying)
                        } else {
                            this._dataSourceApplied = false
                        }
                    } else if (isDataSourceLoaded && !this.isAllDataTypesDefined(true) && this.updateColumnDataTypes(dataSource)) {
                        updateColumnChanges(this, "columns");
                        fireColumnsChanged(this);
                        return (new Deferred).reject().promise()
                    }
                },
                reset: function() {
                    this._dataSourceApplied = false;
                    this._dataSourceColumnsCount = void 0;
                    this.reinit()
                },
                resetColumnsCache: function() {
                    this._visibleColumns = void 0;
                    this._fixedColumns = void 0;
                    this._rowCount = void 0;
                    resetBandColumnsCache(this)
                },
                reinit: function(ignoreColumnOptionNames) {
                    this._columnsUserState = this.getUserState();
                    this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
                    this.init();
                    if (ignoreColumnOptionNames) {
                        this._ignoreColumnOptionNames = null
                    }
                },
                isInitialized: function() {
                    return !!this._columns.length || !!this.option("columns")
                },
                isDataSourceApplied: function() {
                    return this._dataSourceApplied
                },
                getCommonSettings: function(column) {
                    var commonColumnSettings = (!column || !column.type) && this.option("commonColumnSettings") || {};
                    var groupingOptions = this.option("grouping") || {};
                    var groupPanelOptions = this.option("groupPanel") || {};
                    return extend({
                        allowFixing: this.option("columnFixing.enabled"),
                        allowResizing: this.option("allowColumnResizing") || void 0,
                        allowReordering: this.option("allowColumnReordering"),
                        minWidth: this.option("columnMinWidth"),
                        width: this.option("columnWidth"),
                        autoExpandGroup: groupingOptions.autoExpandAll,
                        allowCollapsing: groupingOptions.allowCollapsing,
                        allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled
                    }, commonColumnSettings)
                },
                isColumnOptionUsed: function(optionName) {
                    for (var i = 0; i < this._columns.length; i++) {
                        if (this._columns[i][optionName]) {
                            return true
                        }
                    }
                },
                isAllDataTypesDefined: function(checkSerializers) {
                    var columns = this._columns;
                    if (!columns.length) {
                        return false
                    }
                    for (var i = 0; i < columns.length; i++) {
                        if (!columns[i].dataField && columns[i].calculateCellValue === columns[i].defaultCalculateCellValue) {
                            continue
                        }
                        if (!columns[i].dataType || checkSerializers && columns[i].deserializeValue && void 0 === columns[i].serializationFormat) {
                            return false
                        }
                    }
                    return true
                },
                getColumns: function() {
                    return this._columns
                },
                isBandColumnsUsed: function() {
                    return this.getColumns().some((function(column) {
                        return column.isBand
                    }))
                },
                getGroupColumns: function() {
                    var result = [];
                    each(this._columns, (function() {
                        if (isDefined(this.groupIndex)) {
                            result[this.groupIndex] = this
                        }
                    }));
                    return result
                },
                getVisibleColumns: function(rowIndex) {
                    this._visibleColumns = this._visibleColumns || this._getVisibleColumnsCore();
                    rowIndex = isDefined(rowIndex) ? rowIndex : this._visibleColumns.length - 1;
                    return this._visibleColumns[rowIndex] || []
                },
                getFixedColumns: function(rowIndex) {
                    this._fixedColumns = this._fixedColumns || this._getFixedColumnsCore();
                    rowIndex = isDefined(rowIndex) ? rowIndex : this._fixedColumns.length - 1;
                    return this._fixedColumns[rowIndex] || []
                },
                getFilteringColumns: function() {
                    return this.getColumns().filter(item => (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering)).map(item => {
                        var field = extend(true, {}, item);
                        if (!isDefined(field.dataField)) {
                            field.dataField = field.name
                        }
                        field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
                        return field
                    })
                },
                getColumnIndexOffset: function() {
                    return 0
                },
                _getFixedColumnsCore: function() {
                    var result = [];
                    var rowCount = this.getRowCount();
                    var isColumnFixing = this._isColumnFixing();
                    var transparentColumn = {
                        command: "transparent"
                    };
                    var transparentColspan = 0;
                    var notFixedColumnCount;
                    var transparentColumnIndex;
                    var lastFixedPosition;
                    if (isColumnFixing) {
                        for (var i = 0; i <= rowCount; i++) {
                            notFixedColumnCount = 0;
                            lastFixedPosition = null;
                            transparentColumnIndex = null;
                            var visibleColumns = this.getVisibleColumns(i, true);
                            for (var j = 0; j < visibleColumns.length; j++) {
                                var prevColumn = visibleColumns[j - 1];
                                var column = visibleColumns[j];
                                if (!column.fixed) {
                                    if (0 === i) {
                                        if (column.isBand && column.colspan) {
                                            transparentColspan += column.colspan
                                        } else {
                                            transparentColspan++
                                        }
                                    }
                                    notFixedColumnCount++;
                                    if (!isDefined(transparentColumnIndex)) {
                                        transparentColumnIndex = j
                                    }
                                } else if (prevColumn && prevColumn.fixed && getFixedPosition(this, prevColumn) !== getFixedPosition(this, column)) {
                                    if (!isDefined(transparentColumnIndex)) {
                                        transparentColumnIndex = j
                                    }
                                } else {
                                    lastFixedPosition = column.fixedPosition
                                }
                            }
                            if (0 === i && (0 === notFixedColumnCount || notFixedColumnCount >= visibleColumns.length)) {
                                return []
                            }
                            if (!isDefined(transparentColumnIndex)) {
                                transparentColumnIndex = "right" === lastFixedPosition ? 0 : visibleColumns.length
                            }
                            result[i] = visibleColumns.slice(0);
                            if (!transparentColumn.colspan) {
                                transparentColumn.colspan = transparentColspan
                            }
                            result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn)
                        }
                    }
                    return result.map(columns => columns.map(column => {
                        var newColumn = _extends({}, column);
                        if (newColumn.headerId) {
                            newColumn.headerId += "-fixed"
                        }
                        return newColumn
                    }))
                },
                _isColumnFixing: function() {
                    var isColumnFixing = this.option("columnFixing.enabled");
                    !isColumnFixing && each(this._columns, (function(_, column) {
                        if (column.fixed) {
                            isColumnFixing = true;
                            return false
                        }
                    }));
                    return isColumnFixing
                },
                _getExpandColumnsCore: function() {
                    return this.getGroupColumns()
                },
                getExpandColumns: function() {
                    var expandColumns = this._getExpandColumnsCore();
                    var expandColumn;
                    var firstGroupColumn = expandColumns.filter(column => 0 === column.groupIndex)[0];
                    var isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;
                    var isColumnFixing = this._isColumnFixing();
                    if (expandColumns.length) {
                        expandColumn = this.columnOption("command:expand")
                    }
                    expandColumns = map(expandColumns, column => extend({}, column, {
                        visibleWidth: null,
                        minWidth: null,
                        cellTemplate: !isDefined(column.groupIndex) ? column.cellTemplate : null,
                        headerCellTemplate: null,
                        fixed: !isDefined(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true
                    }, expandColumn, {
                        index: column.index,
                        type: column.type || GROUP_COMMAND_COLUMN_NAME
                    }));
                    return expandColumns
                },
                getBandColumnsCache: function() {
                    if (!this._bandColumnsCache) {
                        var columns = this._columns;
                        var columnChildrenByIndex = {};
                        var columnParentByIndex = {};
                        var isPlain = true;
                        columns.forEach((function(column) {
                            var parentIndex = column.ownerBand;
                            var parent = columns[parentIndex];
                            if (column.hasColumns) {
                                isPlain = false
                            }
                            if (column.colspan) {
                                column.colspan = void 0
                            }
                            if (column.rowspan) {
                                column.rowspan = void 0
                            }
                            if (parent) {
                                columnParentByIndex[column.index] = parent
                            } else {
                                parentIndex = -1
                            }
                            columnChildrenByIndex[parentIndex] = columnChildrenByIndex[parentIndex] || [];
                            columnChildrenByIndex[parentIndex].push(column)
                        }));
                        this._bandColumnsCache = {
                            isPlain: isPlain,
                            columnChildrenByIndex: columnChildrenByIndex,
                            columnParentByIndex: columnParentByIndex
                        }
                    }
                    return this._bandColumnsCache
                },
                _isColumnVisible: function(column) {
                    return column.visible && this.isParentColumnVisible(column.index)
                },
                _getVisibleColumnsCore: function() {
                    var that = this;
                    var i;
                    var result = [];
                    var rowspanGroupColumns = 0;
                    var rowspanExpandColumns = 0;
                    var rowCount = that.getRowCount();
                    var positiveIndexedColumns = [];
                    var negativeIndexedColumns = [];
                    var notGroupedColumnsCount = 0;
                    var isFixedToEnd;
                    var rtlEnabled = that.option("rtlEnabled");
                    var bandColumnsCache = that.getBandColumnsCache();
                    var expandColumns = mergeColumns(that, that.getExpandColumns(), that._columns);
                    var columns = mergeColumns(that, that._columns, that._commandColumns, true);
                    var columnDigitsCount = function(number) {
                        var i;
                        for (i = 0; number > 1; i++) {
                            number /= 10
                        }
                        return i
                    }(columns.length);
                    ! function(that, columns, bandColumnsCache) {
                        var rowspan;
                        for (var i = 0; i < columns.length; i++) {
                            var column = columns[i];
                            if (column.visible || column.command) {
                                if (column.isBand) {
                                    column.colspan = column.colspan || calculateColspan(that, column.index)
                                }
                                if (!column.isBand || !column.colspan) {
                                    rowspan = that.getRowCount();
                                    if (!column.command && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
                                        rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length
                                    }
                                    if (rowspan > 1) {
                                        column.rowspan = rowspan
                                    }
                                }
                            }
                        }
                    }(that, columns, bandColumnsCache);
                    for (i = 0; i < rowCount; i++) {
                        result[i] = [];
                        negativeIndexedColumns[i] = [{}];
                        positiveIndexedColumns[i] = [{}, {}, {}]
                    }
                    each(columns, (function() {
                        var visibleIndex = this.visibleIndex;
                        var indexedColumns;
                        var parentBandColumns = getParentBandColumns(this.index, bandColumnsCache.columnParentByIndex);
                        var visible = that._isColumnVisible(this);
                        if (visible && (!isDefined(this.groupIndex) || this.showWhenGrouped)) {
                            var rowIndex = parentBandColumns.length;
                            if (visibleIndex < 0) {
                                visibleIndex = -visibleIndex;
                                indexedColumns = negativeIndexedColumns[rowIndex]
                            } else {
                                this.fixed = parentBandColumns.length ? parentBandColumns[0].fixed : this.fixed;
                                this.fixedPosition = parentBandColumns.length ? parentBandColumns[0].fixedPosition : this.fixedPosition;
                                if (this.fixed) {
                                    isFixedToEnd = "right" === this.fixedPosition;
                                    if (rtlEnabled && (!this.command || isCustomCommandColumn(that, this))) {
                                        isFixedToEnd = !isFixedToEnd
                                    }
                                    if (isFixedToEnd) {
                                        indexedColumns = positiveIndexedColumns[rowIndex][2]
                                    } else {
                                        indexedColumns = positiveIndexedColumns[rowIndex][0]
                                    }
                                } else {
                                    indexedColumns = positiveIndexedColumns[rowIndex][1]
                                }
                            }
                            if (parentBandColumns.length) {
                                visibleIndex = numberToString(visibleIndex, columnDigitsCount);
                                for (i = parentBandColumns.length - 1; i >= 0; i--) {
                                    visibleIndex = numberToString(parentBandColumns[i].visibleIndex, columnDigitsCount) + visibleIndex
                                }
                            }
                            indexedColumns[visibleIndex] = indexedColumns[visibleIndex] || [];
                            indexedColumns[visibleIndex].push(this);
                            notGroupedColumnsCount++
                        }
                    }));
                    each(result, (function(rowIndex) {
                        orderEach(negativeIndexedColumns[rowIndex], (function(_, columns) {
                            result[rowIndex].unshift.apply(result[rowIndex], columns)
                        }));
                        var firstPositiveIndexColumn = result[rowIndex].length;
                        each(positiveIndexedColumns[rowIndex], (function(index, columnsByFixing) {
                            orderEach(columnsByFixing, (function(_, columnsByVisibleIndex) {
                                result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex)
                            }))
                        }));
                        if (rowspanExpandColumns < rowIndex + 1) {
                            rowspanExpandColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, "detailExpand", firstPositiveIndexColumn)
                        }
                        if (rowspanGroupColumns < rowIndex + 1) {
                            rowspanGroupColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn)
                        }
                    }));
                    result.push(function getDataColumns(columns, rowIndex, bandColumnID) {
                        var result = [];
                        rowIndex = rowIndex || 0;
                        columns[rowIndex] && each(columns[rowIndex], (function(_, column) {
                            if (column.ownerBand === bandColumnID || column.type === GROUP_COMMAND_COLUMN_NAME) {
                                if (!column.isBand || !column.colspan) {
                                    if (!column.command || rowIndex < 1) {
                                        result.push(column)
                                    }
                                } else {
                                    result.push.apply(result, getDataColumns(columns, rowIndex + 1, column.index))
                                }
                            }
                        }));
                        return result
                    }(result));
                    if (!notGroupedColumnsCount && that._columns.length) {
                        result[rowCount].push({
                            command: "empty"
                        })
                    }
                    return result
                },
                getInvisibleColumns: function(columns, bandColumnIndex) {
                    var that = this;
                    var result = [];
                    var hiddenColumnsByBand;
                    columns = columns || that._columns;
                    each(columns, (function(_, column) {
                        if (column.ownerBand !== bandColumnIndex) {
                            return
                        }
                        if (column.isBand) {
                            if (!column.visible) {
                                hiddenColumnsByBand = that.getChildrenByBandColumn(column.index)
                            } else {
                                hiddenColumnsByBand = that.getInvisibleColumns(that.getChildrenByBandColumn(column.index), column.index)
                            }
                            if (hiddenColumnsByBand.length) {
                                result.push(column);
                                result = result.concat(hiddenColumnsByBand)
                            }
                            return
                        }
                        if (!column.visible) {
                            result.push(column)
                        }
                    }));
                    return result
                },
                getChooserColumns: function(getAllColumns) {
                    var columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();
                    return grep(columns, (function(column) {
                        return column.showInColumnChooser
                    }))
                },
                allowMoveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    var columnIndex = getColumnIndexByVisibleIndex(this, fromVisibleIndex, sourceLocation);
                    var sourceColumn = this._columns[columnIndex];
                    if (sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
                        if (sourceLocation === targetLocation) {
                            if ("columnChooser" === sourceLocation) {
                                return false
                            }
                            fromVisibleIndex = isObject(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
                            toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
                            return fromVisibleIndex !== toVisibleIndex && fromVisibleIndex + 1 !== toVisibleIndex
                        } else if ("group" === sourceLocation && "columnChooser" !== targetLocation || "group" === targetLocation) {
                            return sourceColumn && sourceColumn.allowGrouping
                        } else if ("columnChooser" === sourceLocation || "columnChooser" === targetLocation) {
                            return sourceColumn && sourceColumn.allowHiding
                        }
                        return true
                    }
                    return false
                },
                moveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    var options = {};
                    var prevGroupIndex;
                    var fromIndex = getColumnIndexByVisibleIndex(this, fromVisibleIndex, sourceLocation);
                    var toIndex = getColumnIndexByVisibleIndex(this, toVisibleIndex, targetLocation);
                    var targetGroupIndex;
                    if (fromIndex >= 0) {
                        var column = this._columns[fromIndex];
                        toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
                        targetGroupIndex = toIndex >= 0 ? this._columns[toIndex].groupIndex : -1;
                        if (isDefined(column.groupIndex) && "group" === sourceLocation) {
                            if (targetGroupIndex > column.groupIndex) {
                                targetGroupIndex--
                            }
                            if ("group" !== targetLocation) {
                                options.groupIndex = void 0
                            } else {
                                prevGroupIndex = column.groupIndex;
                                delete column.groupIndex;
                                updateColumnGroupIndexes(this)
                            }
                        }
                        if ("group" === targetLocation) {
                            options.groupIndex = function(that, column, groupIndex) {
                                var groupColumns = that.getGroupColumns();
                                var i;
                                if (groupIndex >= 0) {
                                    for (i = 0; i < groupColumns.length; i++) {
                                        if (groupColumns[i].groupIndex >= groupIndex) {
                                            groupColumns[i].groupIndex++
                                        }
                                    }
                                } else {
                                    groupIndex = 0;
                                    for (i = 0; i < groupColumns.length; i++) {
                                        groupIndex = Math.max(groupIndex, groupColumns[i].groupIndex + 1)
                                    }
                                }
                                return groupIndex
                            }(this, 0, targetGroupIndex);
                            column.groupIndex = prevGroupIndex
                        } else if (toVisibleIndex >= 0) {
                            var targetColumn = this._columns[toIndex];
                            if (!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
                                options.visibleIndex = MAX_SAFE_INTEGER
                            } else if (isColumnFixed(this, column) ^ isColumnFixed(this, targetColumn)) {
                                options.visibleIndex = MAX_SAFE_INTEGER
                            } else {
                                options.visibleIndex = targetColumn.visibleIndex
                            }
                        }
                        var isVisible = "columnChooser" !== targetLocation;
                        if (column.visible !== isVisible) {
                            options.visible = isVisible
                        }
                        this.columnOption(column.index, options)
                    }
                },
                changeSortOrder: function(columnIndex, sortOrder) {
                    var options = {};
                    var sortingOptions = this.option("sorting");
                    var sortingMode = sortingOptions && sortingOptions.mode;
                    var needResetSorting = "single" === sortingMode || !sortOrder;
                    var allowSorting = "single" === sortingMode || "multiple" === sortingMode;
                    var column = this._columns[columnIndex];
                    if (allowSorting && column && column.allowSorting) {
                        if (needResetSorting && !isDefined(column.groupIndex)) {
                            each(this._columns, (function(index) {
                                if (index !== columnIndex && this.sortOrder) {
                                    if (!isDefined(this.groupIndex)) {
                                        delete this.sortOrder
                                    }
                                    delete this.sortIndex
                                }
                            }))
                        }
                        if (isSortOrderValid(sortOrder)) {
                            if (column.sortOrder !== sortOrder) {
                                options.sortOrder = sortOrder
                            }
                        } else if ("none" === sortOrder) {
                            if (column.sortOrder) {
                                options.sortIndex = void 0;
                                options.sortOrder = void 0
                            }
                        } else {
                            ! function(column) {
                                if ("ctrl" === sortOrder) {
                                    if (!("sortOrder" in column && "sortIndex" in column)) {
                                        return false
                                    }
                                    options.sortOrder = void 0;
                                    options.sortIndex = void 0
                                } else if (isDefined(column.groupIndex) || isDefined(column.sortIndex)) {
                                    options.sortOrder = "desc" === column.sortOrder ? "asc" : "desc"
                                } else {
                                    options.sortOrder = "asc"
                                }
                                return true
                            }(column)
                        }
                    }
                    this.columnOption(column.index, options)
                },
                getSortDataSourceParameters: function(useLocalSelector) {
                    var sortColumns = [];
                    var sort = [];
                    each(this._columns, (function() {
                        if ((this.dataField || this.selector || this.calculateCellValue) && isDefined(this.sortIndex) && !isDefined(this.groupIndex)) {
                            sortColumns[this.sortIndex] = this
                        }
                    }));
                    each(sortColumns, (function() {
                        var sortOrder = this && this.sortOrder;
                        if (isSortOrderValid(sortOrder)) {
                            var sortItem = {
                                selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue,
                                desc: "desc" === this.sortOrder
                            };
                            if (this.sortingMethod) {
                                sortItem.compare = this.sortingMethod.bind(this)
                            }
                            sort.push(sortItem)
                        }
                    }));
                    return sort.length > 0 ? sort : null
                },
                getGroupDataSourceParameters: function(useLocalSelector) {
                    var group = [];
                    each(this.getGroupColumns(), (function() {
                        var selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue;
                        if (selector) {
                            var groupItem = {
                                selector: selector,
                                desc: "desc" === this.sortOrder,
                                isExpanded: !!this.autoExpandGroup
                            };
                            if (this.sortingMethod) {
                                groupItem.compare = this.sortingMethod.bind(this)
                            }
                            group.push(groupItem)
                        }
                    }));
                    return group.length > 0 ? group : null
                },
                refresh: function(updateNewLookupsOnly) {
                    var deferreds = [];
                    each(this._columns, (function() {
                        var lookup = this.lookup;
                        if (lookup && !this.calculateDisplayValue) {
                            if (updateNewLookupsOnly && lookup.valueMap) {
                                return
                            }
                            if (lookup.update) {
                                deferreds.push(lookup.update())
                            }
                        }
                    }));
                    return when.apply($, deferreds).done(resetColumnsCache.bind(null, this))
                },
                _updateColumnOptions: function(column, columnIndex) {
                    column.selector = column.selector || function(data) {
                        return column.calculateCellValue(data)
                    };
                    each(["calculateSortValue", "calculateGroupValue", "calculateDisplayValue"], (function(_, calculateCallbackName) {
                        var calculateCallback = column[calculateCallbackName];
                        if (isFunction(calculateCallback) && !calculateCallback.originalCallback) {
                            column[calculateCallbackName] = function(data) {
                                return calculateCallback.call(column, data)
                            };
                            column[calculateCallbackName].originalCallback = calculateCallback;
                            column[calculateCallbackName].columnIndex = columnIndex
                        }
                    }));
                    if (isString(column.calculateDisplayValue)) {
                        column.displayField = column.calculateDisplayValue;
                        column.calculateDisplayValue = compileGetter(column.displayField)
                    }
                    if (column.calculateDisplayValue) {
                        column.displayValueMap = column.displayValueMap || {}
                    }
                    updateSerializers(column, column.dataType);
                    var lookup = column.lookup;
                    if (lookup) {
                        updateSerializers(lookup, lookup.dataType)
                    }
                    var dataType = lookup ? lookup.dataType : column.dataType;
                    if (dataType) {
                        column.alignment = column.alignment || function(dataType, isRTL) {
                            switch (dataType) {
                                case "number":
                                    return "right";
                                case "boolean":
                                    return "center";
                                default:
                                    return getDefaultAlignment(isRTL)
                            }
                        }(dataType, this.option("rtlEnabled"));
                        column.format = column.format || gridCoreUtils.getFormatByDataType(dataType);
                        column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
                        column.defaultFilterOperations = column.defaultFilterOperations || !lookup && DATATYPE_OPERATIONS[dataType] || [];
                        if (!isDefined(column.filterOperations)) {
                            setFilterOperationsAsDefaultValues(column)
                        }
                        column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || "=";
                        column.showEditorAlways = isDefined(column.showEditorAlways) ? column.showEditorAlways : "boolean" === dataType && !column.cellTemplate
                    }
                },
                updateColumnDataTypes: function(dataSource) {
                    var that = this;
                    var dateSerializationFormat = that.option("dateSerializationFormat");
                    var firstItems = that._getFirstItems(dataSource);
                    var isColumnDataTypesUpdated = false;
                    each(that._columns, (function(index, column) {
                        var i;
                        var value;
                        var dataType;
                        var lookupDataType;
                        var valueDataType;
                        var lookup = column.lookup;
                        if (gridCoreUtils.isDateType(column.dataType) && void 0 === column.serializationFormat) {
                            column.serializationFormat = dateSerializationFormat
                        }
                        if (lookup && gridCoreUtils.isDateType(lookup.dataType) && void 0 === column.serializationFormat) {
                            lookup.serializationFormat = dateSerializationFormat
                        }
                        if (column.calculateCellValue && firstItems.length) {
                            if (!column.dataType || lookup && !lookup.dataType) {
                                for (i = 0; i < firstItems.length; i++) {
                                    value = column.calculateCellValue(firstItems[i]);
                                    if (!column.dataType) {
                                        valueDataType = getValueDataType(value);
                                        dataType = dataType || valueDataType;
                                        if (dataType && valueDataType && dataType !== valueDataType) {
                                            dataType = "string"
                                        }
                                    }
                                    if (lookup && !lookup.dataType) {
                                        valueDataType = getValueDataType(gridCoreUtils.getDisplayValue(column, value, firstItems[i]));
                                        lookupDataType = lookupDataType || valueDataType;
                                        if (lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                                            lookupDataType = "string"
                                        }
                                    }
                                }
                                if (dataType || lookupDataType) {
                                    if (dataType) {
                                        column.dataType = dataType
                                    }
                                    if (lookup && lookupDataType) {
                                        lookup.dataType = lookupDataType
                                    }
                                    isColumnDataTypesUpdated = true
                                }
                            }
                            if (void 0 === column.serializationFormat || lookup && void 0 === lookup.serializationFormat) {
                                for (i = 0; i < firstItems.length; i++) {
                                    value = column.calculateCellValue(firstItems[i], true);
                                    if (void 0 === column.serializationFormat) {
                                        column.serializationFormat = getSerializationFormat(column.dataType, value)
                                    }
                                    if (lookup && void 0 === lookup.serializationFormat) {
                                        lookup.serializationFormat = getSerializationFormat(lookup.dataType, lookup.calculateCellValue(value, true))
                                    }
                                }
                            }
                        }
                        that._updateColumnOptions(column, index)
                    }));
                    return isColumnDataTypesUpdated
                },
                _customizeColumns: function(columns) {
                    var customizeColumns = this.option("customizeColumns");
                    if (customizeColumns) {
                        var hasOwnerBand = columns.some((function(column) {
                            return isObject(column.ownerBand)
                        }));
                        if (hasOwnerBand) {
                            updateIndexes(this)
                        }
                        customizeColumns(columns);
                        assignColumns(this, createColumnsFromOptions(this, columns))
                    }
                },
                updateColumns: function(dataSource, forceApplying) {
                    if (!forceApplying) {
                        this.updateSortingGrouping(dataSource)
                    }
                    if (!dataSource || dataSource.isLoaded()) {
                        var sortParameters = dataSource ? dataSource.sort() || [] : this.getSortDataSourceParameters();
                        var groupParameters = dataSource ? dataSource.group() || [] : this.getGroupDataSourceParameters();
                        var filterParameters = null === dataSource || void 0 === dataSource ? void 0 : dataSource.lastLoadOptions().filter;
                        this._customizeColumns(this._columns);
                        updateIndexes(this);
                        var columns = this._columns;
                        return when(this.refresh(true)).always(() => {
                            if (this._columns !== columns) {
                                return
                            }
                            this._updateChanges(dataSource, {
                                sorting: sortParameters,
                                grouping: groupParameters,
                                filtering: filterParameters
                            });
                            fireColumnsChanged(this)
                        })
                    }
                },
                _updateChanges: function(dataSource, parameters) {
                    if (dataSource) {
                        this.updateColumnDataTypes(dataSource);
                        this._dataSourceApplied = true
                    }
                    if (!gridCoreUtils.equalSortParameters(parameters.sorting, this.getSortDataSourceParameters())) {
                        updateColumnChanges(this, "sorting")
                    }
                    if (!gridCoreUtils.equalSortParameters(parameters.grouping, this.getGroupDataSourceParameters())) {
                        updateColumnChanges(this, "grouping")
                    }
                    var dataController = this.getController("data");
                    if (dataController && !gridCoreUtils.equalFilterParameters(parameters.filtering, dataController.getCombinedFilter())) {
                        updateColumnChanges(this, "filtering")
                    }
                    updateColumnChanges(this, "columns")
                },
                updateSortingGrouping: function(dataSource, fromDataSource) {
                    var that = this;
                    var sortParameters;
                    var isColumnsChanged;
                    var updateSortGroupParameterIndexes = function(columns, sortParameters, indexParameterName) {
                        each(columns, (function(index, column) {
                            delete column[indexParameterName];
                            if (sortParameters) {
                                for (var i = 0; i < sortParameters.length; i++) {
                                    var selector = sortParameters[i].selector;
                                    var isExpanded = sortParameters[i].isExpanded;
                                    if (selector === column.dataField || selector === column.name || selector === column.selector || selector === column.calculateCellValue || selector === column.calculateGroupValue || selector === column.calculateDisplayValue) {
                                        column.sortOrder = column.sortOrder || (sortParameters[i].desc ? "desc" : "asc");
                                        if (void 0 !== isExpanded) {
                                            column.autoExpandGroup = isExpanded
                                        }
                                        column[indexParameterName] = i;
                                        break
                                    }
                                }
                            }
                        }))
                    };
                    if (dataSource) {
                        sortParameters = gridCoreUtils.normalizeSortingInfo(dataSource.sort());
                        var groupParameters = gridCoreUtils.normalizeSortingInfo(dataSource.group());
                        var columnsGroupParameters = that.getGroupDataSourceParameters();
                        var columnsSortParameters = that.getSortDataSourceParameters();
                        if (!that._columns.length) {
                            each(groupParameters, (function(index, group) {
                                that._columns.push(group.selector)
                            }));
                            each(sortParameters, (function(index, sort) {
                                that._columns.push(sort.selector)
                            }));
                            assignColumns(that, createColumnsFromOptions(that, that._columns))
                        }
                        if ((fromDataSource || !columnsGroupParameters && !that._hasUserState) && !gridCoreUtils.equalSortParameters(groupParameters, columnsGroupParameters)) {
                            updateSortGroupParameterIndexes(that._columns, groupParameters, "groupIndex");
                            if (fromDataSource) {
                                updateColumnChanges(that, "grouping");
                                isColumnsChanged = true
                            }
                        }
                        if ((fromDataSource || !columnsSortParameters && !that._hasUserState) && !gridCoreUtils.equalSortParameters(sortParameters, columnsSortParameters)) {
                            updateSortGroupParameterIndexes(that._columns, sortParameters, "sortIndex");
                            if (fromDataSource) {
                                updateColumnChanges(that, "sorting");
                                isColumnsChanged = true
                            }
                        }
                        if (isColumnsChanged) {
                            fireColumnsChanged(that)
                        }
                    }
                },
                updateFilter: function(filter, remoteFiltering, columnIndex, filterValue) {
                    if (!Array.isArray(filter)) {
                        return filter
                    }
                    filter = extend([], filter);
                    columnIndex = void 0 !== filter.columnIndex ? filter.columnIndex : columnIndex;
                    filterValue = void 0 !== filter.filterValue ? filter.filterValue : filterValue;
                    if (isString(filter[0]) && "!" !== filter[0]) {
                        var column = this.columnOption(filter[0]);
                        if (remoteFiltering) {
                            if (config().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
                                filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], "filter")
                            }
                        } else if (column && column.selector) {
                            filter[0] = column.selector;
                            filter[0].columnIndex = column.index
                        }
                    } else if (isFunction(filter[0])) {
                        filter[0].columnIndex = columnIndex;
                        filter[0].filterValue = filterValue
                    }
                    for (var i = 0; i < filter.length; i++) {
                        filter[i] = this.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue)
                    }
                    return filter
                },
                columnCount: function() {
                    return this._columns ? this._columns.length : 0
                },
                columnOption: function(identifier, option, value, notFireEvent) {
                    var that = this;
                    var columns = that._columns.concat(that._commandColumns);
                    var column = findColumn(columns, identifier);
                    if (column) {
                        if (1 === arguments.length) {
                            return extend({}, column)
                        }
                        if (isString(option)) {
                            if (2 === arguments.length) {
                                return columnOptionCore(that, column, option)
                            } else {
                                columnOptionCore(that, column, option, value, notFireEvent)
                            }
                        } else if (isObject(option)) {
                            each(option, (function(optionName, value) {
                                columnOptionCore(that, column, optionName, value, notFireEvent)
                            }))
                        }
                        fireColumnsChanged(that)
                    }
                },
                clearSorting: function() {
                    var columnCount = this.columnCount();
                    this.beginUpdate();
                    for (var i = 0; i < columnCount; i++) {
                        this.columnOption(i, "sortOrder", void 0)
                    }
                    this.endUpdate()
                },
                clearGrouping: function() {
                    var columnCount = this.columnCount();
                    this.beginUpdate();
                    for (var i = 0; i < columnCount; i++) {
                        this.columnOption(i, "groupIndex", void 0)
                    }
                    this.endUpdate()
                },
                getVisibleIndex: function(index, rowIndex) {
                    var columns = this.getVisibleColumns(rowIndex);
                    for (var i = columns.length - 1; i >= 0; i--) {
                        if (columns[i].index === index) {
                            return i
                        }
                    }
                    return -1
                },
                getVisibleIndexByColumn: function(column, rowIndex) {
                    var visibleColumns = this.getVisibleColumns(rowIndex);
                    var visibleColumn = visibleColumns.filter(col => col.index === column.index && col.command === column.command)[0];
                    return visibleColumns.indexOf(visibleColumn)
                },
                getVisibleColumnIndex: function(id, rowIndex) {
                    var index = this.columnOption(id, "index");
                    return this.getVisibleIndex(index, rowIndex)
                },
                addColumn: function(options) {
                    var column = createColumn(this, options);
                    var index = this._columns.length;
                    this._columns.push(column);
                    if (column.isBand) {
                        this._columns = createColumnsFromOptions(this, this._columns);
                        column = this._columns[index]
                    }
                    column.added = options;
                    updateIndexes(this, column);
                    this.updateColumns(this._dataSource);
                    this._checkColumns()
                },
                deleteColumn: function(id) {
                    var column = this.columnOption(id);
                    if (column && column.index >= 0) {
                        columns = this._columns, void columns.forEach(column => {
                            if (isDefined(column.ownerBand)) {
                                column.ownerBand = columns[column.ownerBand]
                            }
                        });
                        this._columns.splice(column.index, 1);
                        if (column.isBand) {
                            var childIndexes = this.getChildrenByBandColumn(column.index).map(column => column.index);
                            this._columns = this._columns.filter(column => childIndexes.indexOf(column.index) < 0)
                        }
                        updateIndexes(this);
                        this.updateColumns(this._dataSource)
                    }
                    var columns
                },
                addCommandColumn: function(options) {
                    var commandColumn = this._commandColumns.filter(column => column.command === options.command)[0];
                    if (!commandColumn) {
                        commandColumn = options;
                        this._commandColumns.push(commandColumn)
                    }
                },
                getUserState: function() {
                    var columns = this._columns;
                    var result = [];
                    var i;

                    function handleStateField(index, value) {
                        if (void 0 !== columns[i][value]) {
                            result[i][value] = columns[i][value]
                        }
                    }
                    for (i = 0; i < columns.length; i++) {
                        result[i] = {};
                        each(USER_STATE_FIELD_NAMES, handleStateField)
                    }
                    return result
                },
                setName: function(column) {
                    var dataField = column.dataField;
                    if (!isDefined(column.name) && isDefined(dataField)) {
                        column.name = dataField
                    }
                },
                setUserState: function(state) {
                    var dataSource = this._dataSource;
                    var ignoreColumnOptionNames = this.option("stateStoring.ignoreColumnOptionNames");
                    null === state || void 0 === state ? void 0 : state.forEach(this.setName);
                    if (!ignoreColumnOptionNames) {
                        ignoreColumnOptionNames = [];
                        var commonColumnSettings = this.getCommonSettings();
                        if (!this.option("columnChooser.enabled")) {
                            ignoreColumnOptionNames.push("visible")
                        }
                        if ("none" === this.option("sorting.mode")) {
                            ignoreColumnOptionNames.push("sortIndex", "sortOrder")
                        }
                        if (!commonColumnSettings.allowGrouping) {
                            ignoreColumnOptionNames.push("groupIndex")
                        }
                        if (!commonColumnSettings.allowFixing) {
                            ignoreColumnOptionNames.push("fixed", "fixedPosition")
                        }
                        if (!commonColumnSettings.allowResizing) {
                            ignoreColumnOptionNames.push("width", "visibleWidth")
                        }
                        var isFilterPanelHidden = !this.option("filterPanel.visible");
                        if (!this.option("filterRow.visible") && isFilterPanelHidden) {
                            ignoreColumnOptionNames.push("filterValue", "selectedFilterOperation")
                        }
                        if (!this.option("headerFilter.visible") && isFilterPanelHidden) {
                            ignoreColumnOptionNames.push("filterValues", "filterType")
                        }
                    }
                    this._columnsUserState = state;
                    this._ignoreColumnOptionNames = ignoreColumnOptionNames;
                    this._hasUserState = !!state;
                    updateColumnChanges(this, "filtering");
                    this.init();
                    if (dataSource) {
                        dataSource.sort(this.getSortDataSourceParameters());
                        dataSource.group(this.getGroupDataSourceParameters())
                    }
                },
                _checkColumns: function() {
                    var usedNames = {};
                    var hasEditableColumnWithoutName = false;
                    var duplicatedNames = [];
                    this._columns.forEach(column => {
                        var _column$columns;
                        var name = column.name;
                        var isBand = null === (_column$columns = column.columns) || void 0 === _column$columns ? void 0 : _column$columns.length;
                        var isEditable = column.allowEditing && (column.dataField || column.setCellValue) && !isBand;
                        if (name) {
                            if (usedNames[name]) {
                                duplicatedNames.push('"'.concat(name, '"'))
                            }
                            usedNames[name] = true
                        } else if (isEditable) {
                            hasEditableColumnWithoutName = true
                        }
                    });
                    if (duplicatedNames.length) {
                        errors.log("E1059", duplicatedNames.join(", "))
                    }
                    if (hasEditableColumnWithoutName) {
                        errors.log("E1060")
                    }
                },
                _createCalculatedColumnOptions: function(columnOptions, bandColumn) {
                    var calculatedColumnOptions = {};
                    var dataField = columnOptions.dataField;
                    if (Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
                        calculatedColumnOptions.isBand = true;
                        dataField = null
                    }
                    if (dataField) {
                        if (isString(dataField)) {
                            var getter = compileGetter(dataField);
                            calculatedColumnOptions = {
                                caption: captionize(dataField),
                                calculateCellValue: function(data, skipDeserialization) {
                                    var value = getter(data);
                                    return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value
                                },
                                setCellValue: defaultSetCellValue,
                                parseValue: function(text) {
                                    var result;
                                    var parsedValue;
                                    if ("number" === this.dataType) {
                                        if (isString(text) && this.format) {
                                            parsedValue = numberLocalization.parse(text);
                                            if (isNumeric(parsedValue)) {
                                                result = parsedValue
                                            }
                                        } else if (isDefined(text) && isNumeric(text)) {
                                            result = Number(text)
                                        }
                                    } else if ("boolean" === this.dataType) {
                                        if (text === this.trueText) {
                                            result = true
                                        } else if (text === this.falseText) {
                                            result = false
                                        }
                                    } else if (gridCoreUtils.isDateType(this.dataType)) {
                                        parsedValue = dateLocalization.parse(text, this.format);
                                        if (parsedValue) {
                                            result = parsedValue
                                        }
                                    } else {
                                        result = text
                                    }
                                    return result
                                }
                            }
                        }
                        calculatedColumnOptions.allowFiltering = true
                    } else {
                        calculatedColumnOptions.allowFiltering = !!columnOptions.calculateFilterExpression
                    }
                    calculatedColumnOptions.calculateFilterExpression = function() {
                        return filterUtils.defaultCalculateFilterExpression.apply(this, arguments)
                    };
                    calculatedColumnOptions.createFilterExpression = function(filterValue) {
                        var result;
                        if (this.calculateFilterExpression) {
                            result = this.calculateFilterExpression.apply(this, arguments)
                        }
                        if (isFunction(result)) {
                            result = [result, "=", true]
                        }
                        if (result) {
                            result.columnIndex = this.index;
                            result.filterValue = filterValue
                        }
                        return result
                    };
                    if (!dataField || !isString(dataField)) {
                        extend(true, calculatedColumnOptions, {
                            allowSorting: false,
                            allowGrouping: false,
                            calculateCellValue: function() {
                                return null
                            }
                        })
                    }
                    if (bandColumn) {
                        calculatedColumnOptions.allowFixing = false
                    }
                    if (columnOptions.dataType) {
                        calculatedColumnOptions.userDataType = columnOptions.dataType
                    }
                    if (columnOptions.selectedFilterOperation && !("defaultSelectedFilterOperation" in calculatedColumnOptions)) {
                        calculatedColumnOptions.defaultSelectedFilterOperation = columnOptions.selectedFilterOperation
                    }
                    if (columnOptions.lookup) {
                        calculatedColumnOptions.lookup = {
                            calculateCellValue: function(value, skipDeserialization) {
                                if (this.valueExpr) {
                                    value = this.valueMap && this.valueMap[value]
                                }
                                return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value
                            },
                            updateValueMap: function() {
                                this.valueMap = {};
                                if (this.items) {
                                    var calculateValue = compileGetter(this.valueExpr);
                                    var calculateDisplayValue = compileGetter(this.displayExpr);
                                    for (var i = 0; i < this.items.length; i++) {
                                        var item = this.items[i];
                                        var displayValue = calculateDisplayValue(item);
                                        this.valueMap[calculateValue(item)] = displayValue;
                                        this.dataType = this.dataType || getValueDataType(displayValue)
                                    }
                                }
                            },
                            update: function() {
                                var that = this;
                                var dataSource = that.dataSource;
                                if (dataSource) {
                                    if (isFunction(dataSource) && !variableWrapper.isWrapped(dataSource)) {
                                        dataSource = dataSource({})
                                    }
                                    if (isPlainObject(dataSource) || dataSource instanceof Store || Array.isArray(dataSource)) {
                                        if (that.valueExpr) {
                                            var dataSourceOptions = normalizeDataSourceOptions(dataSource);
                                            dataSourceOptions.paginate = false;
                                            dataSource = new DataSource(dataSourceOptions);
                                            return dataSource.load().done((function(data) {
                                                that.items = data;
                                                that.updateValueMap && that.updateValueMap()
                                            }))
                                        }
                                    } else {
                                        errors.log("E1016")
                                    }
                                } else {
                                    that.updateValueMap && that.updateValueMap()
                                }
                            }
                        }
                    }
                    calculatedColumnOptions.resizedCallbacks = Callbacks();
                    if (columnOptions.resized) {
                        calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions))
                    }
                    each(calculatedColumnOptions, (function(optionName) {
                        if (isFunction(calculatedColumnOptions[optionName]) && 0 !== optionName.indexOf("default")) {
                            var defaultOptionName = "default" + optionName.charAt(0).toUpperCase() + optionName.substr(1);
                            calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName]
                        }
                    }));
                    return calculatedColumnOptions
                },
                getRowCount: function() {
                    this._rowCount = this._rowCount || function(that) {
                        var rowCount = 1;
                        var bandColumnsCache = that.getBandColumnsCache();
                        var columnParentByIndex = bandColumnsCache.columnParentByIndex;
                        that._columns.forEach((function(column) {
                            var parents = getParentBandColumns(column.index, columnParentByIndex);
                            var invisibleParents = parents.filter((function(column) {
                                return !column.visible
                            }));
                            if (column.visible && !invisibleParents.length) {
                                rowCount = Math.max(rowCount, parents.length + 1)
                            }
                        }));
                        return rowCount
                    }(this);
                    return this._rowCount
                },
                getRowIndex: function(columnIndex, alwaysGetRowIndex) {
                    var column = this._columns[columnIndex];
                    var bandColumnsCache = this.getBandColumnsCache();
                    return column && (alwaysGetRowIndex || column.visible && !(column.command || isDefined(column.groupIndex))) ? getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length : 0
                },
                getChildrenByBandColumn: function(bandColumnIndex, onlyVisibleDirectChildren) {
                    var bandColumnsCache = this.getBandColumnsCache();
                    var result = _getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);
                    if (onlyVisibleDirectChildren) {
                        return result.filter((function(column) {
                            return column.visible && !column.command
                        })).sort((function(column1, column2) {
                            return column1.visibleIndex - column2.visibleIndex
                        }))
                    }
                    return result
                },
                isParentBandColumn: function(columnIndex, bandColumnIndex) {
                    var result = false;
                    var column = this._columns[columnIndex];
                    var bandColumnsCache = this.getBandColumnsCache();
                    var parentBandColumns = column && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);
                    if (parentBandColumns) {
                        each(parentBandColumns, (function(_, bandColumn) {
                            if (bandColumn.index === bandColumnIndex) {
                                result = true;
                                return false
                            }
                        }))
                    }
                    return result
                },
                isParentColumnVisible: function(columnIndex) {
                    var result = true;
                    var bandColumnsCache = this.getBandColumnsCache();
                    var bandColumns = columnIndex >= 0 && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);
                    bandColumns && each(bandColumns, (function(_, bandColumn) {
                        result = result && bandColumn.visible;
                        return result
                    }));
                    return result
                },
                getColumnId: function(column) {
                    if (column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
                        if (isCustomCommandColumn(this, column)) {
                            return "type:" + column.type
                        }
                        return "command:" + column.command
                    }
                    return column.index
                },
                getCustomizeTextByDataType: getCustomizeTextByDataType,
                getHeaderContentAlignment: function(columnAlignment) {
                    var rtlEnabled = this.option("rtlEnabled");
                    if (rtlEnabled) {
                        return "left" === columnAlignment ? "right" : "left"
                    }
                    return columnAlignment
                }
            }
        }())
    }
};
