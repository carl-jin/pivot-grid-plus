/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.filter_sync.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import modules from "./ui.grid_core.modules";
import {
    getDefaultOperation,
    getMatchedConditions,
    syncFilters,
    removeFieldConditionsFromFilter,
    addItem,
    getNormalizedFilter,
    getFilterExpression,
    filterHasField
} from "../filter_builder/utils";
import errors from "../widget/ui.errors";
import gridCoreUtils from "./ui.grid_core.utils";
import filterUtils from "../shared/filtering";
import {
    anyOf,
    noneOf
} from "./ui.grid_core.filter_custom_operations";
var FILTER_ROW_OPERATIONS = ["=", "<>", "<", "<=", ">", ">=", "notcontains", "contains", "startswith", "endswith", "between"];
var FILTER_TYPES_INCLUDE = "include";
var FILTER_TYPES_EXCLUDE = "exclude";

function getColumnIdentifier(column) {
    return column.dataField || column.name
}

function checkForErrors(columns) {
    columns.forEach(column => {
        var identifier = getColumnIdentifier(column);
        if (!isDefined(identifier) && column.allowFiltering) {
            throw new errors.Error("E1049", column.caption)
        }
    })
}
var FilterSyncController = modules.Controller.inherit(function() {
    var getEmptyFilterValues = function() {
        return {
            filterType: FILTER_TYPES_INCLUDE,
            filterValues: void 0
        }
    };
    var canSyncHeaderFilterWithFilterRow = function(column) {
        return !filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource)
    };
    var getConditionFromFilterRow = function(column) {
        var value = column.filterValue;
        if (isDefined(value)) {
            var operation = column.selectedFilterOperation || column.defaultFilterOperation || getDefaultOperation(column);
            var filter = [getColumnIdentifier(column), operation, column.filterValue];
            return filter
        } else {
            return null
        }
    };
    var getConditionFromHeaderFilter = function(column) {
        var selectedOperation;
        var value;
        var filterValues = column.filterValues;
        if (!filterValues) {
            return null
        }
        if (canSyncHeaderFilterWithFilterRow(column) && 1 === column.filterValues.length && !Array.isArray(filterValues[0])) {
            column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = "<>" : selectedOperation = "=";
            value = filterValues[0]
        } else {
            column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = "noneof" : selectedOperation = "anyof";
            value = filterValues
        }
        return [getColumnIdentifier(column), selectedOperation, value]
    };
    var updateHeaderFilterCondition = function(columnsController, column, headerFilterCondition) {
        var headerFilter = function(headerFilterCondition, column) {
            if (!headerFilterCondition) {
                return getEmptyFilterValues()
            }
            var filterType;
            var selectedFilterOperation = headerFilterCondition[1];
            var value = headerFilterCondition[2];
            var hasArrayValue = Array.isArray(value);
            if (!hasArrayValue) {
                if (!canSyncHeaderFilterWithFilterRow(column)) {
                    return getEmptyFilterValues()
                }
            }
            switch (selectedFilterOperation) {
                case "anyof":
                case "=":
                    filterType = FILTER_TYPES_INCLUDE;
                    break;
                case "noneof":
                case "<>":
                    filterType = FILTER_TYPES_EXCLUDE;
                    break;
                default:
                    return getEmptyFilterValues()
            }
            return {
                filterType: filterType,
                filterValues: hasArrayValue ? value : [value]
            }
        }(headerFilterCondition, column);
        columnsController.columnOption(getColumnIdentifier(column), headerFilter)
    };
    var updateFilterRowCondition = function(columnsController, column, condition) {
        var filterRowOptions;
        var selectedFilterOperation = condition && condition[1];
        var filterOperations = column.filterOperations || column.defaultFilterOperations;
        if ((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation) && FILTER_ROW_OPERATIONS.indexOf(selectedFilterOperation) >= 0) {
            if (selectedFilterOperation === column.defaultFilterOperation && !isDefined(column.selectedFilterOperation)) {
                selectedFilterOperation = column.selectedFilterOperation
            }
            filterRowOptions = {
                filterValue: condition[2],
                selectedFilterOperation: selectedFilterOperation
            }
        } else {
            filterRowOptions = {
                filterValue: void 0,
                selectedFilterOperation: void 0
            }
        }
        columnsController.columnOption(getColumnIdentifier(column), filterRowOptions)
    };
    return {
        syncFilterValue: function() {
            var that = this;
            var columnsController = that.getController("columns");
            var columns = columnsController.getFilteringColumns();
            this._skipSyncColumnOptions = true;
            columns.forEach((function(column) {
                var filterConditions = getMatchedConditions(that.option("filterValue"), getColumnIdentifier(column));
                if (1 === filterConditions.length) {
                    var filterCondition = filterConditions[0];
                    updateHeaderFilterCondition(columnsController, column, filterCondition);
                    updateFilterRowCondition(columnsController, column, filterCondition)
                } else {
                    isDefined(column.filterValues) && updateHeaderFilterCondition(columnsController, column);
                    isDefined(column.filterValue) && updateFilterRowCondition(columnsController, column)
                }
            }));
            this._skipSyncColumnOptions = false
        },
        _initSync: function() {
            var columns = this.getController("columns").getColumns();
            var dataController = this.getController("data");
            var pageIndex = dataController.pageIndex();
            checkForErrors(columns);
            if (!this.option("filterValue")) {
                var filteringColumns = this.getController("columns").getFilteringColumns();
                var filterValue = this.getFilterValueFromColumns(filteringColumns);
                this.option("filterValue", filterValue)
            }
            this.syncFilterValue();
            dataController.pageIndex(pageIndex)
        },
        init: function() {
            var dataController = this.getController("data");
            if (dataController.isFilterSyncActive()) {
                if (this.getController("columns").isAllDataTypesDefined()) {
                    this._initSync()
                } else {
                    dataController.dataSourceChanged.add(() => this._initSync())
                }
            }
        },
        _getSyncFilterRow: function(filterValue, column) {
            var filter = getConditionFromFilterRow(column);
            if (isDefined(filter)) {
                return syncFilters(filterValue, filter)
            } else {
                return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column))
            }
        },
        _getSyncHeaderFilter: function(filterValue, column) {
            var filter = getConditionFromHeaderFilter(column);
            if (filter) {
                return syncFilters(filterValue, filter)
            } else {
                return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column))
            }
        },
        getFilterValueFromColumns: function(columns) {
            if (!this.getController("data").isFilterSyncActive()) {
                return null
            }
            var filterValue = ["and"];
            columns && columns.forEach(column => {
                var headerFilter = getConditionFromHeaderFilter(column);
                var filterRow = getConditionFromFilterRow(column);
                headerFilter && addItem(headerFilter, filterValue);
                filterRow && addItem(filterRow, filterValue)
            });
            return getNormalizedFilter(filterValue)
        },
        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column))
        },
        syncHeaderFilter: function(column) {
            this.option("filterValue", this._getSyncHeaderFilter(this.option("filterValue"), column))
        },
        getCustomFilterOperations: function() {
            var filterBuilderCustomOperations = this.option("filterBuilder.customOperations") || [];
            return [anyOf(this.component), noneOf(this.component)].concat(filterBuilderCustomOperations)
        },
        publicMethods: function() {
            return ["getCustomFilterOperations"]
        }
    }
}());
var DataControllerFilterSyncExtender = {
    isFilterSyncActive: function() {
        var filterSyncEnabledValue = this.option("filterSyncEnabled");
        return "auto" === filterSyncEnabledValue ? this.option("filterPanel.visible") : filterSyncEnabledValue
    },
    skipCalculateColumnFilters: function() {
        return isDefined(this.option("filterValue")) && this.isFilterSyncActive()
    },
    _calculateAdditionalFilter: function() {
        if (false === this.option("filterPanel.filterEnabled")) {
            return this.callBase()
        }
        var filters = [this.callBase()];
        var columns = this.getController("columns").getFilteringColumns();
        var filterValue = this.option("filterValue");
        if (this.isFilterSyncActive()) {
            var currentColumn = this.getController("headerFilter").getCurrentColumn();
            if (currentColumn && filterValue) {
                filterValue = removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn))
            }
        }
        var customOperations = this.getController("filterSync").getCustomFilterOperations();
        var calculatedFilterValue = getFilterExpression(filterValue, columns, customOperations, "filterBuilder");
        if (calculatedFilterValue) {
            filters.push(calculatedFilterValue)
        }
        return gridCoreUtils.combineFilters(filters)
    },
    _parseColumnPropertyName: function(fullName) {
        var matched = fullName.match(/.*\.(.*)/);
        if (matched) {
            return matched[1]
        } else {
            return null
        }
    },
    clearFilter: function(filterName) {
        this.component.beginUpdate();
        if (arguments.length > 0) {
            if ("filterValue" === filterName) {
                this.option("filterValue", null)
            }
            this.callBase(filterName)
        } else {
            this.option("filterValue", null);
            this.callBase()
        }
        this.component.endUpdate()
    },
    optionChanged: function(args) {
        switch (args.name) {
            case "filterValue":
                this._applyFilter();
                this.isFilterSyncActive() && this.getController("filterSync").syncFilterValue();
                args.handled = true;
                break;
            case "filterSyncEnabled":
                args.handled = true;
                break;
            case "columns":
                if (this.isFilterSyncActive()) {
                    var column = this.getController("columns").getColumnByPath(args.fullName);
                    var filterSyncController = this.getController("filterSync");
                    if (column && !filterSyncController._skipSyncColumnOptions) {
                        var propertyName = this._parseColumnPropertyName(args.fullName);
                        filterSyncController._skipSyncColumnOptions = true;
                        if ("filterType" === propertyName) {
                            if (FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                                filterSyncController.syncHeaderFilter(column)
                            }
                        } else if ("filterValues" === propertyName) {
                            filterSyncController.syncHeaderFilter(column)
                        } else if (["filterValue", "selectedFilterOperation"].indexOf(propertyName) > -1) {
                            filterSyncController.syncFilterRow(column, column.filterValue)
                        }
                        filterSyncController._skipSyncColumnOptions = false
                    }
                }
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    }
};
var ColumnHeadersViewFilterSyncExtender = {
    _isHeaderFilterEmpty: function(column) {
        if (this.getController("data").isFilterSyncActive()) {
            return !filterHasField(this.option("filterValue"), getColumnIdentifier(column))
        }
        return this.callBase(column)
    },
    _needUpdateFilterIndicators: function() {
        return !this.getController("data").isFilterSyncActive()
    },
    optionChanged: function(args) {
        if ("filterValue" === args.name) {
            this._updateHeaderFilterIndicators()
        } else {
            this.callBase(args)
        }
    }
};
export var filterSyncModule = {
    defaultOptions: function() {
        return {
            filterValue: null,
            filterSyncEnabled: "auto"
        }
    },
    controllers: {
        filterSync: FilterSyncController
    },
    extenders: {
        controllers: {
            data: DataControllerFilterSyncExtender
        },
        views: {
            columnHeadersView: ColumnHeadersViewFilterSyncExtender
        }
    }
};
