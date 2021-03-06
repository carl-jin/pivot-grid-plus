/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.virtual_scrolling.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    getWindow
} from "../../core/utils/window";
import {
    VirtualScrollController,
    subscribeToExternalScrollers
} from "./ui.grid_core.virtual_scrolling_core";
import gridCoreUtils from "./ui.grid_core.utils";
import {
    each
} from "../../core/utils/iterator";
import {
    Deferred
} from "../../core/utils/deferred";
import LoadIndicator from "../load_indicator";
import browser from "../../core/utils/browser";
import {
    getBoundingRect
} from "../../core/utils/position";
import {
    isDefined
} from "../../core/utils/type";
var TABLE_CLASS = "table";
var BOTTOM_LOAD_PANEL_CLASS = "bottom-load-panel";
var TABLE_CONTENT_CLASS = "table-content";
var GROUP_SPACE_CLASS = "group-space";
var CONTENT_CLASS = "content";
var ROW_CLASS = "dx-row";
var FREESPACE_CLASS = "dx-freespace-row";
var COLUMN_LINES_CLASS = "dx-column-lines";
var VIRTUAL_ROW_CLASS = "dx-virtual-row";
var SCROLLING_MODE_INFINITE = "infinite";
var SCROLLING_MODE_VIRTUAL = "virtual";
var SCROLLING_MODE_STANDARD = "standard";
var PIXELS_LIMIT = 25e4;
var LOAD_TIMEOUT = 300;
var NEW_SCROLLING_MODE = "scrolling.newMode";
var isVirtualMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_VIRTUAL
};
var isAppendMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_INFINITE
};
var isVirtualRowRendering = function(that) {
    var rowRenderingMode = that.option("scrolling.rowRenderingMode");
    if (rowRenderingMode === SCROLLING_MODE_VIRTUAL) {
        return true
    } else if (rowRenderingMode === SCROLLING_MODE_STANDARD) {
        return false
    }
};
var _correctCount = function(items, count, fromEnd, isItemCountableFunc) {
    for (var i = 0; i < count + 1; i++) {
        var item = items[fromEnd ? items.length - 1 - i : i];
        if (item && !isItemCountableFunc(item, i === count, fromEnd)) {
            count++
        }
    }
    return count
};
var isItemCountableByDataSource = function(item, dataSource) {
    return "data" === item.rowType && !item.isNewRow || "group" === item.rowType && dataSource.isGroupItemCountable(item.data)
};
var updateItemIndices = function(items) {
    items.forEach((function(item, index) {
        item.rowIndex = index
    }));
    return items
};
var VirtualScrollingDataSourceAdapterExtender = function() {
    var _updateLoading = function(that) {
        var beginPageIndex = that._virtualScrollController.beginPageIndex(-1);
        if (isVirtualMode(that)) {
            if (beginPageIndex < 0 || that.viewportSize() >= 0 && that.getViewportItemIndex() >= 0 && (beginPageIndex * that.pageSize() > that.getViewportItemIndex() || beginPageIndex * that.pageSize() + that.itemsCount() < that.getViewportItemIndex() + that.viewportSize()) && that._dataSource.isLoading()) {
                if (!that._isLoading) {
                    that._isLoading = true;
                    that.loadingChanged.fire(true)
                }
            } else if (that._isLoading) {
                that._isLoading = false;
                that.loadingChanged.fire(false)
            }
        }
    };
    var result = {
        init: function() {
            this.callBase.apply(this, arguments);
            this._items = [];
            this._isLoaded = true;
            this._loadPageCount = 1;
            this._virtualScrollController = new VirtualScrollController(this.component, this._getVirtualScrollDataOptions())
        },
        _getVirtualScrollDataOptions: function() {
            var that = this;
            return {
                pageSize: function() {
                    return that.pageSize()
                },
                totalItemsCount: function() {
                    return that.totalItemsCount()
                },
                hasKnownLastPage: function() {
                    return that.hasKnownLastPage()
                },
                pageIndex: function(index) {
                    return that._dataSource.pageIndex(index)
                },
                isLoading: function() {
                    return that._dataSource.isLoading() && !that.isCustomLoading()
                },
                pageCount: function() {
                    return that.pageCount()
                },
                load: function() {
                    return that._dataSource.load()
                },
                updateLoading: function() {
                    _updateLoading(that)
                },
                itemsCount: function() {
                    return that.itemsCount(true)
                },
                items: function() {
                    return that._dataSource.items()
                },
                viewportItems: function(items) {
                    if (items) {
                        that._items = items
                    }
                    return that._items
                },
                onChanged: function(e) {
                    that.changed.fire(e)
                },
                changingDuration: function(e) {
                    if (that.isLoading()) {
                        return LOAD_TIMEOUT
                    }
                    return that._renderTime || 0
                }
            }
        },
        _handleLoadingChanged: function(isLoading) {
            if (this.option(NEW_SCROLLING_MODE)) {
                this.callBase.apply(this, arguments);
                return
            }
            if (!isVirtualMode(this) || this._isLoadingAll) {
                this._isLoading = isLoading;
                this.callBase.apply(this, arguments)
            }
            if (isLoading) {
                this._startLoadTime = new Date
            } else {
                this._startLoadTime = void 0
            }
        },
        _handleLoadError: function() {
            if (!this.option(NEW_SCROLLING_MODE)) {
                this._isLoading = false;
                this.loadingChanged.fire(false)
            }
            this.callBase.apply(this, arguments)
        },
        _handleDataChanged: function(e) {
            if (this.option(NEW_SCROLLING_MODE)) {
                this.callBase.apply(this, arguments);
                return
            }
            var callBase = this.callBase.bind(this);
            this._virtualScrollController.handleDataChanged(callBase, e)
        },
        _customizeRemoteOperations: function(options, operationTypes) {
            var newMode = this.option(NEW_SCROLLING_MODE);
            if ((isVirtualMode(this) || isAppendMode(this) && newMode) && !operationTypes.reload && (operationTypes.skip || newMode) && this._renderTime < this.option("scrolling.renderingThreshold")) {
                options.delay = void 0
            }
            this.callBase.apply(this, arguments)
        },
        items: function() {
            if (this.option(NEW_SCROLLING_MODE)) {
                return this._dataSource.items()
            }
            return this._items
        },
        itemsCount: function(isBase) {
            if (isBase) {
                return this.callBase()
            }
            return this._virtualScrollController.itemsCount()
        },
        load: function(loadOptions) {
            if (this.option(NEW_SCROLLING_MODE) || loadOptions) {
                return this.callBase(loadOptions)
            }
            return this._virtualScrollController.load()
        },
        isLoading: function() {
            return this._isLoading
        },
        isLoaded: function() {
            return this._dataSource.isLoaded() && this._isLoaded
        },
        resetPagesCache: function(isLiveUpdate) {
            if (!isLiveUpdate) {
                this._virtualScrollController.reset(true)
            }
            this.callBase.apply(this, arguments)
        },
        _changeRowExpandCore: function() {
            var result = this.callBase.apply(this, arguments);
            if (this.option(NEW_SCROLLING_MODE)) {
                return result
            }
            this.resetPagesCache();
            _updateLoading(this);
            return result
        },
        reload: function() {
            this._dataSource.pageIndex(this.pageIndex());
            var virtualScrollController = this._virtualScrollController;
            if (!this.option(NEW_SCROLLING_MODE) && virtualScrollController) {
                var d = new Deferred;
                this.callBase.apply(this, arguments).done((function(r) {
                    var delayDeferred = virtualScrollController.getDelayDeferred();
                    if (delayDeferred) {
                        delayDeferred.done(d.resolve).fail(d.reject)
                    } else {
                        d.resolve(r)
                    }
                })).fail(d.reject);
                return d
            } else {
                return this.callBase.apply(this, arguments)
            }
        },
        refresh: function(options, operationTypes) {
            if (!this.option(NEW_SCROLLING_MODE)) {
                var storeLoadOptions = options.storeLoadOptions;
                var dataSource = this._dataSource;
                if (operationTypes.reload) {
                    this._virtualScrollController.reset();
                    dataSource.items().length = 0;
                    this._isLoaded = false;
                    _updateLoading(this);
                    this._isLoaded = true;
                    if (isAppendMode(this)) {
                        this.pageIndex(0);
                        dataSource.pageIndex(0);
                        storeLoadOptions.pageIndex = 0;
                        options.pageIndex = 0;
                        storeLoadOptions.skip = 0
                    } else {
                        dataSource.pageIndex(this.pageIndex());
                        if (dataSource.paginate()) {
                            options.pageIndex = this.pageIndex();
                            storeLoadOptions.skip = this.pageIndex() * this.pageSize()
                        }
                    }
                } else if (isAppendMode(this) && storeLoadOptions.skip && this._skipCorrection < 0) {
                    storeLoadOptions.skip += this._skipCorrection
                }
            }
            return this.callBase.apply(this, arguments)
        },
        dispose: function() {
            this._virtualScrollController.dispose();
            this.callBase.apply(this, arguments)
        },
        loadPageCount: function(count) {
            if (!isDefined(count)) {
                return this._loadPageCount
            }
            this._loadPageCount = count
        },
        _handleDataLoading: function(options) {
            var loadPageCount = this.loadPageCount();
            options.loadPageCount = loadPageCount;
            if (this.option(NEW_SCROLLING_MODE) && loadPageCount > 1) {
                options.storeLoadOptions.take = loadPageCount * this.pageSize()
            }
            this.callBase.apply(this, arguments)
        },
        _loadPageSize: function() {
            return this.callBase.apply(this, arguments) * this.loadPageCount()
        }
    };
    ["beginPageIndex", "endPageIndex"].forEach((function(name) {
        result[name] = function() {
            if (this.option(NEW_SCROLLING_MODE)) {
                var dataSource = this._dataSource;
                return dataSource.pageIndex.apply(dataSource, arguments)
            }
            var virtualScrollController = this._virtualScrollController;
            return virtualScrollController[name].apply(virtualScrollController, arguments)
        }
    }));
    ["virtualItemsCount", "getContentOffset", "getVirtualContentSize", "setContentItemSizes", "setViewportPosition", "getViewportItemIndex", "setViewportItemIndex", "getItemIndexByPosition", "viewportSize", "viewportItemSize", "getItemSize", "getItemSizes", "pageIndex", "loadIfNeed"].forEach((function(name) {
        result[name] = function() {
            var virtualScrollController = this._virtualScrollController;
            return virtualScrollController[name].apply(virtualScrollController, arguments)
        }
    }));
    return result
}();
var VirtualScrollingRowsViewExtender = function() {
    var removeEmptyRows = function($emptyRows, className) {
        var tBodies = $emptyRows.toArray().map(row => $(row).parent("." + className).get(0)).filter(row => row);
        if (tBodies.length) {
            $emptyRows = $(tBodies)
        }
        var rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;
        for (var i = 0; i < rowCount; i++) {
            $emptyRows.eq(i).remove()
        }
    };
    return {
        init: function() {
            var _dataController$state;
            var dataController = this.getController("data");
            this.callBase();
            dataController.pageChanged.add(() => {
                this.scrollToPage(dataController.pageIndex())
            });
            dataController.dataSourceChanged.add(() => {
                !this._scrollTop && this._scrollToCurrentPageOnResize()
            });
            null === (_dataController$state = dataController.stateLoaded) || void 0 === _dataController$state ? void 0 : _dataController$state.add(() => {
                this._scrollToCurrentPageOnResize()
            });
            this._scrollToCurrentPageOnResize()
        },
        _scrollToCurrentPageOnResize: function() {
            var dataController = this.getController("data");
            if (dataController.pageIndex() > 0) {
                var resizeHandler = () => {
                    this.resizeCompleted.remove(resizeHandler);
                    this.scrollToPage(dataController.pageIndex())
                };
                this.resizeCompleted.add(resizeHandler)
            }
        },
        scrollToPage: function(pageIndex) {
            var dataController = this._dataController;
            var pageSize = dataController ? dataController.pageSize() : 0;
            var scrollPosition;
            if (isVirtualMode(this) || isAppendMode(this)) {
                var itemSize = dataController.getItemSize();
                var itemSizes = dataController.getItemSizes();
                var itemIndex = pageIndex * pageSize;
                scrollPosition = itemIndex * itemSize;
                for (var index in itemSizes) {
                    if (index < itemIndex) {
                        scrollPosition += itemSizes[index] - itemSize
                    }
                }
            } else {
                scrollPosition = 0
            }
            this.scrollTo({
                y: scrollPosition,
                x: this._scrollLeft
            })
        },
        renderDelayedTemplates: function(e) {
            this._updateContentPosition(true);
            this.callBase.apply(this, arguments)
        },
        _renderCore: function(e) {
            var that = this;
            var startRenderTime = new Date;
            that.callBase.apply(that, arguments);
            var dataSource = that._dataController._dataSource;
            if (dataSource && e) {
                var itemCount = e.items ? e.items.length : 20;
                var viewportSize = that._dataController.viewportSize() || 20;
                if (isVirtualRowRendering(that) && itemCount > 0) {
                    dataSource._renderTime = (new Date - startRenderTime) * viewportSize / itemCount
                } else {
                    dataSource._renderTime = new Date - startRenderTime
                }
            }
        },
        _getRowElements: function(tableElement) {
            var $rows = this.callBase(tableElement);
            return $rows && $rows.not("." + VIRTUAL_ROW_CLASS)
        },
        _removeRowsElements: function(contentTable, removeCount, changeType) {
            var rowElements = this._getRowElements(contentTable).toArray();
            if ("append" === changeType) {
                rowElements = rowElements.slice(0, removeCount)
            } else {
                rowElements = rowElements.slice(-removeCount)
            }
            var errorHandlingController = this.getController("errorHandling");
            rowElements.map(rowElement => {
                var $rowElement = $(rowElement);
                errorHandlingController && errorHandlingController.removeErrorRow($rowElement.next());
                $rowElement.remove()
            })
        },
        _restoreErrorRow: function(contentTable) {
            var editingController = this.getController("editing");
            editingController && editingController.hasChanges() && this._getRowElements(contentTable).each((_, item) => {
                var rowOptions = $(item).data("options");
                if (rowOptions) {
                    var change = editingController.getChangeByKey(rowOptions.key);
                    change && editingController._showErrorRow(change)
                }
            })
        },
        _updateContent: function(tableElement, change) {
            var $freeSpaceRowElements;
            var contentElement = this._findContentElement();
            var changeType = change && change.changeType;
            if ("append" === changeType || "prepend" === changeType) {
                var contentTable = contentElement.children().first();
                var $tBodies = this._getBodies(tableElement);
                if (1 === $tBodies.length) {
                    this._getBodies(contentTable)["append" === changeType ? "append" : "prepend"]($tBodies.children())
                } else {
                    $tBodies["append" === changeType ? "appendTo" : "prependTo"](contentTable)
                }
                tableElement.remove();
                $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
                removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);
                if (change.removeCount) {
                    this._removeRowsElements(contentTable, change.removeCount, changeType)
                }
                this._restoreErrorRow(contentTable)
            } else {
                this.callBase.apply(this, arguments)
            }
            this._updateBottomLoading()
        },
        _addVirtualRow: function($table, isFixed, location, position) {
            if (!position) {
                return
            }
            var $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);
            $virtualRow = this._wrapRowIfNeed($table, $virtualRow);
            this._appendEmptyRow($table, $virtualRow, location)
        },
        _getRowHeights: function() {
            var rowHeights = this._getRowElements(this._tableElement).toArray().map((function(row) {
                return getBoundingRect(row).height
            }));
            return rowHeights
        },
        _correctRowHeights: function(rowHeights) {
            var dataController = this._dataController;
            var dataSource = dataController._dataSource;
            var correctedRowHeights = [];
            var visibleRows = dataController.getVisibleRows();
            var itemSize = 0;
            var firstCountableItem = true;
            for (var i = 0; i < rowHeights.length; i++) {
                var currentItem = visibleRows[i];
                if (!isDefined(currentItem)) {
                    continue
                }
                if (isItemCountableByDataSource(currentItem, dataSource)) {
                    if (firstCountableItem) {
                        firstCountableItem = false
                    } else {
                        correctedRowHeights.push(itemSize);
                        itemSize = 0
                    }
                }
                itemSize += rowHeights[i]
            }
            itemSize > 0 && correctedRowHeights.push(itemSize);
            return correctedRowHeights
        },
        _updateContentPosition: function(isRender) {
            var dataController = this._dataController;
            var rowHeight = this._rowHeight || 20;
            dataController.viewportItemSize(rowHeight);
            if (isVirtualMode(this) || isVirtualRowRendering(this)) {
                if (!isRender) {
                    var rowHeights = this._getRowHeights();
                    var correctedRowHeights = this._correctRowHeights(rowHeights);
                    dataController.setContentItemSizes(correctedRowHeights)
                }
                var top = dataController.getContentOffset("begin");
                var bottom = dataController.getContentOffset("end");
                var $tables = this.getTableElements();
                var $virtualRows = $tables.children("tbody").children("." + VIRTUAL_ROW_CLASS);
                removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);
                $tables.each((index, element) => {
                    var isFixed = index > 0;
                    this._isFixedTableRendering = isFixed;
                    this._addVirtualRow($(element), isFixed, "top", top);
                    this._addVirtualRow($(element), isFixed, "bottom", bottom);
                    this._isFixedTableRendering = false
                })
            }
        },
        _isTableLinesDisplaysCorrect: function(table) {
            var hasColumnLines = table.find("." + COLUMN_LINES_CLASS).length > 0;
            return hasColumnLines === this.option("showColumnLines")
        },
        _isColumnElementsEqual: function($columns, $virtualColumns) {
            var result = $columns.length === $virtualColumns.length;
            if (result) {
                each($columns, (function(index, element) {
                    if (element.style.width !== $virtualColumns[index].style.width) {
                        result = false;
                        return result
                    }
                }))
            }
            return result
        },
        _renderVirtualTableContent: function(container, height) {
            var columns = this._columnsController.getVisibleColumns();
            var html = this._createColGroup(columns).prop("outerHTML");
            var freeSpaceCellsHtml = "";
            var columnLinesClass = this.option("showColumnLines") ? COLUMN_LINES_CLASS : "";
            var createFreeSpaceRowHtml = function(height) {
                return "<tr style='height:" + height + "px;' class='" + FREESPACE_CLASS + " " + ROW_CLASS + " " + columnLinesClass + "' >" + freeSpaceCellsHtml + "</tr>"
            };
            for (var i = 0; i < columns.length; i++) {
                var classes = this._getCellClasses(columns[i]);
                var classString = classes.length ? " class='" + classes.join(" ") + "'" : "";
                freeSpaceCellsHtml += "<td" + classString + "/>"
            }
            while (height > PIXELS_LIMIT) {
                html += createFreeSpaceRowHtml(PIXELS_LIMIT);
                height -= PIXELS_LIMIT
            }
            html += createFreeSpaceRowHtml(height);
            container.addClass(this.addWidgetPrefix(TABLE_CLASS));
            container.html(html)
        },
        _getCellClasses: function(column) {
            var classes = [];
            var cssClass = column.cssClass;
            var isExpandColumn = "expand" === column.command;
            cssClass && classes.push(cssClass);
            isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));
            return classes
        },
        _findBottomLoadPanel: function($contentElement) {
            var $element = $contentElement || this.element();
            var $bottomLoadPanel = $element && $element.find("." + this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS));
            if ($bottomLoadPanel && $bottomLoadPanel.length) {
                return $bottomLoadPanel
            }
        },
        _updateBottomLoading: function() {
            var virtualMode = isVirtualMode(this);
            var appendMode = isAppendMode(this);
            var showBottomLoading = !this._dataController.hasKnownLastPage() && this._dataController.isLoaded() && (virtualMode || appendMode);
            var $contentElement = this._findContentElement();
            var bottomLoadPanelElement = this._findBottomLoadPanel($contentElement);
            if (showBottomLoading) {
                if (!bottomLoadPanelElement) {
                    $("<div>").addClass(this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)).append(this._createComponent($("<div>"), LoadIndicator).$element()).appendTo($contentElement)
                }
            } else if (bottomLoadPanelElement) {
                bottomLoadPanelElement.remove()
            }
        },
        _handleScroll: function(e) {
            var that = this;
            if (that._hasHeight && that._rowHeight) {
                that._dataController.setViewportPosition(e.scrollOffset.top)
            }
            that.callBase.apply(that, arguments)
        },
        _needUpdateRowHeight: function(itemsCount) {
            var that = this;
            return that.callBase.apply(that, arguments) || itemsCount > 0 && that.option("scrolling.mode") === SCROLLING_MODE_INFINITE && that.option("scrolling.rowRenderingMode") !== SCROLLING_MODE_VIRTUAL
        },
        _updateRowHeight: function() {
            this.callBase.apply(this, arguments);
            if (this._rowHeight) {
                this._updateContentPosition();
                var viewportHeight = this._hasHeight ? this.element().outerHeight() : $(getWindow()).outerHeight();
                var dataController = this._dataController;
                dataController.viewportSize(Math.ceil(viewportHeight / this._rowHeight));
                if (this.option(NEW_SCROLLING_MODE) && !isDefined(dataController._loadViewportParams)) {
                    var viewportSize = dataController.viewportSize();
                    var viewportIsNotFilled = viewportSize > dataController.items().length && (isAppendMode(this) || dataController.totalItemsCount() > viewportSize);
                    viewportIsNotFilled && dataController.loadViewport()
                }
            }
        },
        updateFreeSpaceRowHeight: function() {
            var result = this.callBase.apply(this, arguments);
            if (result) {
                this._updateContentPosition()
            }
            return result
        },
        setLoading: function(isLoading, messageText) {
            var dataController = this._dataController;
            var hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();
            if (this.option(NEW_SCROLLING_MODE) && isLoading && dataController.isViewportChanging()) {
                return
            }
            if (hasBottomLoadPanel) {
                isLoading = false
            }
            this.callBase.call(this, isLoading, messageText)
        },
        _resizeCore: function() {
            var that = this;
            var $element = that.element();
            that.callBase();
            if (that.component.$element() && !that._windowScroll && $element.closest(getWindow().document).length) {
                that._windowScroll = subscribeToExternalScrollers($element, (function(scrollPos) {
                    if (!that._hasHeight && that._rowHeight) {
                        that._dataController.setViewportPosition(scrollPos)
                    }
                }), that.component.$element());
                that.on("disposing", (function() {
                    that._windowScroll.dispose()
                }))
            }
            that.loadIfNeed()
        },
        loadIfNeed: function() {
            var _dataController$loadI;
            var dataController = this._dataController;
            null === dataController || void 0 === dataController ? void 0 : null === (_dataController$loadI = dataController.loadIfNeed) || void 0 === _dataController$loadI ? void 0 : _dataController$loadI.call(dataController)
        },
        setColumnWidths: function(widths) {
            var scrollable = this.getScrollable();
            var $content;
            this.callBase.apply(this, arguments);
            if ("virtual" === this.option("scrolling.mode")) {
                $content = scrollable ? $(scrollable.content()) : this.element();
                this.callBase(widths, $content.children("." + this.addWidgetPrefix(CONTENT_CLASS)).children(":not(." + this.addWidgetPrefix(TABLE_CONTENT_CLASS) + ")"))
            }
        },
        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this.callBase()
        }
    }
}();
export var virtualScrollingModule = {
    defaultOptions: function() {
        return {
            scrolling: {
                timeout: 300,
                updateTimeout: 300,
                minTimeout: 0,
                renderingThreshold: 100,
                removeInvisiblePages: true,
                rowPageSize: 5,
                mode: "standard",
                preloadEnabled: false,
                rowRenderingMode: "standard",
                loadTwoPagesOnStart: false,
                newMode: false,
                minGap: 1
            }
        }
    },
    extenders: {
        dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
        controllers: {
            data: function() {
                var members = {
                    _refreshDataSource: function() {
                        var baseResult = this.callBase.apply(this, arguments) || (new Deferred).resolve().promise();
                        baseResult.done(this.initVirtualRows.bind(this));
                        return baseResult
                    },
                    getRowPageSize: function() {
                        var rowPageSize = this.option("scrolling.rowPageSize");
                        var pageSize = this.pageSize();
                        return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize
                    },
                    reload: function() {
                        var rowsScrollController = this._rowsScrollController || this._dataSource;
                        var itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
                        var result = this.callBase.apply(this, arguments);
                        return result && result.done(() => {
                            if (isVirtualMode(this) || isVirtualRowRendering(this)) {
                                var rowIndexOffset = this.getRowIndexOffset();
                                var rowIndex = Math.floor(itemIndex) - rowIndexOffset;
                                var component = this.component;
                                var scrollable = component.getScrollable && component.getScrollable();
                                var isSortingOperation = this.dataSource().operationTypes().sorting;
                                if (scrollable && !isSortingOperation) {
                                    var rowElement = component.getRowElement(rowIndex);
                                    var $rowElement = rowElement && rowElement[0] && $(rowElement[0]);
                                    var top = $rowElement && $rowElement.position().top;
                                    var isChromeLatest = browser.chrome && browser.version >= 91;
                                    var allowedTopOffset = browser.mozilla || browser.msie || isChromeLatest ? 1 : 0;
                                    if (top > allowedTopOffset) {
                                        top = Math.round(top + $rowElement.outerHeight() * (itemIndex % 1));
                                        scrollable.scrollTo({
                                            y: top
                                        })
                                    }
                                }
                            }
                        })
                    },
                    initVirtualRows: function() {
                        var virtualRowsRendering = isVirtualRowRendering(this);
                        if ("virtual" !== this.option("scrolling.mode") && true !== virtualRowsRendering || false === virtualRowsRendering || !this.option("scrolling.rowPageSize")) {
                            this._visibleItems = null;
                            this._rowsScrollController = null;
                            return
                        }
                        var pageIndex = !isVirtualMode(this) && this.pageIndex() >= this.pageCount() ? this.pageCount() - 1 : this.pageIndex();
                        this._rowPageIndex = Math.ceil(pageIndex * this.pageSize() / this.getRowPageSize());
                        this._uncountableItemCount = 0;
                        this._visibleItems = this.option(NEW_SCROLLING_MODE) ? null : [];
                        this._rowsScrollController = new VirtualScrollController(this.component, this._getRowsScrollDataOptions(), true);
                        this._viewportChanging = false;
                        this._rowsScrollController.positionChanged.add(() => {
                            var _this$_dataSource;
                            if (this.option(NEW_SCROLLING_MODE)) {
                                this._viewportChanging = true;
                                this.loadViewport();
                                this._viewportChanging = false;
                                return
                            }
                            null === (_this$_dataSource = this._dataSource) || void 0 === _this$_dataSource ? void 0 : _this$_dataSource.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex())
                        });
                        if (this.isLoaded() && !this.option(NEW_SCROLLING_MODE)) {
                            this._rowsScrollController.load()
                        }
                    },
                    isViewportChanging: function() {
                        return this._viewportChanging
                    },
                    _getRowsScrollDataOptions: function() {
                        var that = this;
                        var isItemCountable = function(item) {
                            return isItemCountableByDataSource(item, that._dataSource)
                        };
                        return {
                            pageSize: function() {
                                return that.getRowPageSize()
                            },
                            totalItemsCount: function() {
                                if (that.option(NEW_SCROLLING_MODE)) {
                                    return that.totalItemsCount() + that._uncountableItemCount
                                }
                                return isVirtualMode(that) ? that.totalItemsCount() : that._items.filter(isItemCountable).length
                            },
                            hasKnownLastPage: function() {
                                return true
                            },
                            pageIndex: function(index) {
                                if (void 0 !== index) {
                                    that._rowPageIndex = index
                                }
                                return that._rowPageIndex
                            },
                            isLoading: function() {
                                return that.isLoading()
                            },
                            pageCount: function() {
                                var pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
                                return pageCount ? pageCount : 1
                            },
                            load: function() {
                                if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
                                    that._rowPageIndex = this.pageCount() - 1;
                                    that._rowsScrollController.pageIndex(that._rowPageIndex)
                                }
                                if (!this.items().length && this.totalItemsCount()) {
                                    return
                                }
                                that._rowsScrollController.handleDataChanged(change => {
                                    change = change || {};
                                    change.changeType = change.changeType || "refresh";
                                    change.items = change.items || that._visibleItems;
                                    that._visibleItems.forEach((item, index) => {
                                        item.rowIndex = index
                                    });
                                    that._fireChanged(change)
                                })
                            },
                            updateLoading: function() {},
                            itemsCount: function() {
                                return this.items().filter(isItemCountable).length
                            },
                            correctCount: function(items, count, fromEnd) {
                                return _correctCount(items, count, fromEnd, (item, isNextAfterLast, fromEnd) => {
                                    if (item.isNewRow) {
                                        return isNextAfterLast && !fromEnd
                                    }
                                    if (isNextAfterLast && fromEnd) {
                                        return !item.isNewRow
                                    }
                                    return isItemCountable(item)
                                })
                            },
                            items: function(countableOnly) {
                                var dataSource = that.dataSource();
                                var virtualItemsCount = dataSource && dataSource.virtualItemsCount();
                                var begin = virtualItemsCount ? virtualItemsCount.begin : 0;
                                var rowPageSize = that.getRowPageSize();
                                var skip = that._rowPageIndex * rowPageSize - begin;
                                var take = rowPageSize;
                                var result = that._items;
                                if (skip < 0) {
                                    return []
                                }
                                if (skip) {
                                    skip = this.correctCount(result, skip);
                                    result = result.slice(skip)
                                }
                                if (take) {
                                    take = this.correctCount(result, take);
                                    result = result.slice(0, take)
                                }
                                return countableOnly ? result.filter(isItemCountable) : result
                            },
                            viewportItems: function(items) {
                                if (items && !that.option(NEW_SCROLLING_MODE)) {
                                    that._visibleItems = items
                                }
                                return that._visibleItems
                            },
                            onChanged: function() {},
                            changingDuration: function(e) {
                                var dataSource = that.dataSource();
                                if (dataSource.isLoading() && !that.option(NEW_SCROLLING_MODE)) {
                                    return LOAD_TIMEOUT
                                }
                                return (null === dataSource || void 0 === dataSource ? void 0 : dataSource._renderTime) || 0
                            }
                        }
                    },
                    _updateItemsCore: function(change) {
                        var delta = this.getRowIndexDelta();
                        this.callBase.apply(this, arguments);
                        if (this.option(NEW_SCROLLING_MODE) && isVirtualRowRendering(this)) {
                            return
                        }
                        var rowsScrollController = this._rowsScrollController;
                        if (rowsScrollController) {
                            var visibleItems = this._visibleItems;
                            var isRefresh = "refresh" === change.changeType || change.isLiveUpdate;
                            if ("append" === change.changeType && change.items && !change.items.length) {
                                return
                            }
                            if (isRefresh || "append" === change.changeType || "prepend" === change.changeType) {
                                change.cancel = true;
                                isRefresh && rowsScrollController.reset(true);
                                rowsScrollController.load()
                            } else {
                                if ("update" === change.changeType) {
                                    change.rowIndices.forEach((rowIndex, index) => {
                                        var changeType = change.changeTypes[index];
                                        var newItem = change.items[index];
                                        if ("update" === changeType) {
                                            visibleItems[rowIndex] = newItem
                                        } else if ("insert" === changeType) {
                                            visibleItems.splice(rowIndex, 0, newItem)
                                        } else if ("remove" === changeType) {
                                            visibleItems.splice(rowIndex, 1)
                                        }
                                    })
                                } else {
                                    visibleItems.forEach((item, index) => {
                                        visibleItems[index] = this._items[index + delta] || visibleItems[index]
                                    });
                                    change.items = visibleItems
                                }
                                updateItemIndices(visibleItems)
                            }
                        }
                    },
                    _updateLoadViewportParams: function() {
                        this._loadViewportParams = this._rowsScrollController.getViewportParams()
                    },
                    _afterProcessItems: function(items, change) {
                        this._uncountableItemCount = 0;
                        if (isDefined(this._loadViewportParams)) {
                            this._uncountableItemCount = items.filter(item => !isItemCountableByDataSource(item, this._dataSource)).length;
                            this._updateLoadViewportParams();
                            var {
                                skipForCurrentPage: skipForCurrentPage
                            } = this.getLoadPageParams();
                            change.repaintChangesOnly = "refresh" === change.changeType;
                            return items.slice(skipForCurrentPage, skipForCurrentPage + this._loadViewportParams.take)
                        }
                        return this.callBase.apply(this, arguments)
                    },
                    _applyChange: function(change) {
                        var that = this;
                        var items = change.items;
                        var changeType = change.changeType;
                        var removeCount = change.removeCount;
                        if (removeCount) {
                            var fromEnd = "prepend" === changeType;
                            removeCount = _correctCount(that._items, removeCount, fromEnd, (function(item, isNextAfterLast) {
                                return "data" === item.rowType && !item.isNewRow || "group" === item.rowType && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast)
                            }));
                            change.removeCount = removeCount
                        }
                        switch (changeType) {
                            case "prepend":
                                that._items.unshift.apply(that._items, items);
                                if (removeCount) {
                                    that._items.splice(-removeCount)
                                }
                                break;
                            case "append":
                                that._items.push.apply(that._items, items);
                                if (removeCount) {
                                    that._items.splice(0, removeCount)
                                }
                                break;
                            default:
                                that.callBase(change)
                        }
                    },
                    items: function(allItems) {
                        return allItems ? this._items : this._visibleItems || this._items
                    },
                    getRowIndexDelta: function() {
                        var visibleItems = this._visibleItems;
                        var delta = 0;
                        if (visibleItems && visibleItems[0]) {
                            delta = this._items.indexOf(visibleItems[0])
                        }
                        return delta < 0 ? 0 : delta
                    },
                    getRowIndexOffset: function(byLoadedRows) {
                        var offset = 0;
                        var dataSource = this.dataSource();
                        var rowsScrollController = this._rowsScrollController;
                        var virtualMode = isVirtualMode(this);
                        var appendMode = isAppendMode(this);
                        var newMode = this.option(NEW_SCROLLING_MODE);
                        if (rowsScrollController && !byLoadedRows) {
                            if (this.option(NEW_SCROLLING_MODE) && isDefined(this._loadViewportParams)) {
                                var {
                                    skipForCurrentPage: skipForCurrentPage,
                                    pageIndex: pageIndex
                                } = this.getLoadPageParams();
                                offset = pageIndex * this.pageSize() + skipForCurrentPage
                            } else {
                                offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize()
                            }
                        } else if ((virtualMode || appendMode && newMode) && dataSource) {
                            offset = dataSource.beginPageIndex() * dataSource.pageSize()
                        }
                        return offset
                    },
                    viewportSize: function() {
                        var rowsScrollController = this._rowsScrollController;
                        var dataSource = this._dataSource;
                        var result = null === rowsScrollController || void 0 === rowsScrollController ? void 0 : rowsScrollController.viewportSize.apply(rowsScrollController, arguments);
                        if (this.option(NEW_SCROLLING_MODE)) {
                            return result
                        }
                        return null === dataSource || void 0 === dataSource ? void 0 : dataSource.viewportSize.apply(dataSource, arguments)
                    },
                    viewportItemSize: function() {
                        var rowsScrollController = this._rowsScrollController;
                        var dataSource = this._dataSource;
                        var result = null === rowsScrollController || void 0 === rowsScrollController ? void 0 : rowsScrollController.viewportItemSize.apply(rowsScrollController, arguments);
                        if (this.option(NEW_SCROLLING_MODE)) {
                            return result
                        }
                        return null === dataSource || void 0 === dataSource ? void 0 : dataSource.viewportItemSize.apply(dataSource, arguments)
                    },
                    setViewportPosition: function() {
                        var rowsScrollController = this._rowsScrollController;
                        var dataSource = this._dataSource;
                        if (rowsScrollController) {
                            rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments)
                        } else {
                            null === dataSource || void 0 === dataSource ? void 0 : dataSource.setViewportPosition.apply(dataSource, arguments)
                        }
                    },
                    setContentItemSizes: function(sizes) {
                        var rowsScrollController = this._rowsScrollController;
                        var dataSource = this._dataSource;
                        var result = null === rowsScrollController || void 0 === rowsScrollController ? void 0 : rowsScrollController.setContentItemSizes(sizes);
                        if (this.option(NEW_SCROLLING_MODE)) {
                            return result
                        }
                        return null === dataSource || void 0 === dataSource ? void 0 : dataSource.setContentItemSizes(sizes)
                    },
                    getLoadPageParams: function() {
                        var viewportParams = this._loadViewportParams;
                        var pageIndex = Math.floor(viewportParams.skip / this.pageSize());
                        var skipForCurrentPage = viewportParams.skip - pageIndex * this.pageSize();
                        var loadPageCount = Math.ceil((skipForCurrentPage + viewportParams.take) / this.pageSize());
                        return {
                            pageIndex: pageIndex,
                            loadPageCount: loadPageCount,
                            skipForCurrentPage: skipForCurrentPage
                        }
                    },
                    loadViewport: function() {
                        if (isVirtualMode(this) || isAppendMode(this)) {
                            this._updateLoadViewportParams();
                            var {
                                pageIndex: pageIndex,
                                loadPageCount: loadPageCount
                            } = this.getLoadPageParams();
                            var dataSourceAdapter = this._dataSource;
                            if (pageIndex !== dataSourceAdapter.pageIndex() || loadPageCount !== dataSourceAdapter.loadPageCount()) {
                                dataSourceAdapter.pageIndex(pageIndex);
                                dataSourceAdapter.loadPageCount(loadPageCount);
                                this.load()
                            } else if (!this._isLoading) {
                                this.updateItems()
                            }
                        }
                    },
                    loadIfNeed: function() {
                        if (this.option(NEW_SCROLLING_MODE)) {
                            return
                        }
                        var rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.loadIfNeed();
                        var dataSource = this._dataSource;
                        return dataSource && dataSource.loadIfNeed()
                    },
                    getItemSize: function() {
                        var rowsScrollController = this._rowsScrollController;
                        if (rowsScrollController) {
                            return rowsScrollController.getItemSize.apply(rowsScrollController, arguments)
                        }
                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSize.apply(dataSource, arguments)
                    },
                    getItemSizes: function() {
                        var rowsScrollController = this._rowsScrollController;
                        if (rowsScrollController) {
                            return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments)
                        }
                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getItemSizes.apply(dataSource, arguments)
                    },
                    getContentOffset: function() {
                        var rowsScrollController = this._rowsScrollController;
                        if (rowsScrollController) {
                            return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments)
                        }
                        var dataSource = this._dataSource;
                        return dataSource && dataSource.getContentOffset.apply(dataSource, arguments)
                    },
                    refresh: function(options) {
                        var dataSource = this._dataSource;
                        if (dataSource && options && options.load && isAppendMode(this)) {
                            dataSource.resetCurrentTotalCount()
                        }
                        return this.callBase.apply(this, arguments)
                    },
                    dispose: function() {
                        var rowsScrollController = this._rowsScrollController;
                        rowsScrollController && rowsScrollController.dispose();
                        this.callBase.apply(this, arguments)
                    },
                    topItemIndex: function() {
                        var _this$_loadViewportPa;
                        return null === (_this$_loadViewportPa = this._loadViewportParams) || void 0 === _this$_loadViewportPa ? void 0 : _this$_loadViewportPa.skip
                    },
                    bottomItemIndex: function() {
                        var viewportParams = this._loadViewportParams;
                        return viewportParams && viewportParams.skip + viewportParams.take
                    },
                    virtualItemsCount: function() {
                        var rowsScrollController = this._rowsScrollController;
                        if (rowsScrollController) {
                            return rowsScrollController.virtualItemsCount.apply(rowsScrollController, arguments)
                        }
                        var dataSource = this._dataSource;
                        return null === dataSource || void 0 === dataSource ? void 0 : dataSource.virtualItemsCount.apply(dataSource, arguments)
                    }
                };
                gridCoreUtils.proxyMethod(members, "getVirtualContentSize");
                gridCoreUtils.proxyMethod(members, "setViewportItemIndex");
                return members
            }(),
            resizing: {
                resize: function() {
                    var that = this;
                    var callBase = that.callBase;
                    var result;
                    if (isVirtualMode(that) || isVirtualRowRendering(that)) {
                        clearTimeout(that._resizeTimeout);
                        var diff = new Date - that._lastTime;
                        var updateTimeout = that.option("scrolling.updateTimeout");
                        if (that._lastTime && diff < updateTimeout) {
                            result = new Deferred;
                            that._resizeTimeout = setTimeout((function() {
                                callBase.apply(that).done(result.resolve).fail(result.reject);
                                that._lastTime = new Date
                            }), updateTimeout);
                            that._lastTime = new Date
                        } else {
                            result = callBase.apply(that);
                            if (that._dataController.isLoaded()) {
                                that._lastTime = new Date
                            }
                        }
                    } else {
                        result = callBase.apply(that)
                    }
                    return result
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._resizeTimeout)
                }
            }
        },
        views: {
            rowsView: VirtualScrollingRowsViewExtender
        }
    }
};
