/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.sorting_mixin.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import $ from "../../core/renderer";
var SORT_CLASS = "dx-sort";
var SORT_NONE_CLASS = "dx-sort-none";
var SORTUP_CLASS = "dx-sort-up";
var SORTDOWN_CLASS = "dx-sort-down";
var SORT_INDEX_CLASS = "dx-sort-index";
var SORT_INDEX_ICON_CLASS = "dx-sort-index-icon";
var HEADERS_ACTION_CLASS = "action";
export default {
    _applyColumnState: function(options) {
        var ariaSortState;
        var $sortIndicator;
        var sortingMode = this.option("sorting.mode");
        var rootElement = options.rootElement;
        var column = options.column;
        var $indicatorsContainer = this._getIndicatorContainer(rootElement);
        if ("sort" === options.name) {
            rootElement.find("." + SORT_CLASS).remove();
            !$indicatorsContainer.children().length && $indicatorsContainer.remove();
            var isSortingAllowed = ("single" === sortingMode || "multiple" === sortingMode) && column.allowSorting;
            if (!isDefined(column.groupIndex) && (isSortingAllowed || isDefined(column.sortOrder))) {
                ariaSortState = "asc" === column.sortOrder ? "ascending" : "descending";
                $sortIndicator = this.callBase(options).toggleClass(SORTUP_CLASS, "asc" === column.sortOrder).toggleClass(SORTDOWN_CLASS, "desc" === column.sortOrder);
                var hasSeveralSortIndexes = this.getController && !!this.getController("columns").columnOption("sortIndex:1");
                if (hasSeveralSortIndexes && this.option("sorting.showSortIndexes") && column.sortIndex >= 0) {
                    $("<span>").addClass(SORT_INDEX_ICON_CLASS).text(column.sortIndex + 1).appendTo($sortIndicator);
                    $sortIndicator.addClass(SORT_INDEX_CLASS)
                }
                options.rootElement.addClass(this.addWidgetPrefix(HEADERS_ACTION_CLASS))
            }
            if (!isDefined(column.sortOrder)) {
                this.setAria("sort", "none", rootElement)
            } else {
                this.setAria("sort", ariaSortState, rootElement)
            }
            return $sortIndicator
        } else {
            return this.callBase(options)
        }
    },
    _getIndicatorClassName: function(name) {
        if ("sort" === name) {
            return SORT_CLASS
        } else if ("sortIndex" === name) {
            return SORT_INDEX_ICON_CLASS
        }
        return this.callBase(name)
    },
    _renderIndicator: function(options) {
        var column = options.column;
        var $container = options.container;
        var $indicator = options.indicator;
        if ("sort" === options.name) {
            var rtlEnabled = this.option("rtlEnabled");
            if (!isDefined(column.sortOrder)) {
                $indicator && $indicator.addClass(SORT_NONE_CLASS)
            }
            if ($container.children().length && (!rtlEnabled && "left" === options.columnAlignment || rtlEnabled && "right" === options.columnAlignment)) {
                $container.prepend($indicator);
                return
            }
        }
        this.callBase(options)
    },
    _updateIndicator: function($cell, column, indicatorName) {
        if ("sort" === indicatorName && isDefined(column.groupIndex)) {
            return
        }
        return this.callBase.apply(this, arguments)
    },
    _getIndicatorElements: function($cell, returnAll) {
        var $indicatorElements = this.callBase($cell);
        return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not("." + SORT_NONE_CLASS)
    }
};
