/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.grouping.collapsed.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
import {
    each
} from "../../core/utils/iterator";
import dataGridCore from "./ui.data_grid.core";
import {
    GroupingHelper as GroupingHelperCore,
    createOffsetFilter
} from "./ui.data_grid.grouping.core";
import {
    createGroupFilter
} from "./ui.data_grid.utils";
import errors from "../widget/ui.errors";
import {
    errors as dataErrors
} from "../../data/errors";
import {
    when,
    Deferred
} from "../../core/utils/deferred";

function getContinuationGroupCount(groupOffset, pageSize, groupSize, groupIndex) {
    groupIndex = groupIndex || 0;
    if (pageSize > 1 && groupSize > 0) {
        var pageOffset = groupOffset - Math.floor(groupOffset / pageSize) * pageSize || pageSize;
        pageOffset += groupSize - groupIndex - 2;
        if (pageOffset < 0) {
            pageOffset += pageSize
        }
        return Math.floor(pageOffset / (pageSize - groupIndex - 1))
    }
    return 0
}
export var GroupingHelper = GroupingHelperCore.inherit(function() {
    var foreachExpandedGroups = function(that, callback, updateGroups) {
        return that.foreachGroups((function(groupInfo, parents) {
            if (groupInfo.isExpanded) {
                return callback(groupInfo, parents)
            }
        }), true, false, updateGroups, updateGroups)
    };
    var processGroupItems = function processGroupItems(that, items, groupsCount, expandedInfo, path, isCustomLoading, isLastGroupExpanded) {
        var isExpanded;
        expandedInfo.items = expandedInfo.items || [];
        expandedInfo.paths = expandedInfo.paths || [];
        expandedInfo.count = expandedInfo.count || 0;
        expandedInfo.lastCount = expandedInfo.lastCount || 0;
        if (!groupsCount) {
            return
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (void 0 !== item.items) {
                path.push(item.key);
                if (isCustomLoading) {
                    isExpanded = true
                } else {
                    var groupInfo = that.findGroupInfo(path);
                    isExpanded = groupInfo && groupInfo.isExpanded
                }
                if (!isExpanded) {
                    item.collapsedItems = item.items;
                    item.items = null
                } else if (item.items) {
                    processGroupItems(that, item.items, groupsCount - 1, expandedInfo, path, isCustomLoading, isLastGroupExpanded)
                } else if (1 === groupsCount && item.count && (!isCustomLoading || isLastGroupExpanded)) {
                    expandedInfo.items.push(item);
                    expandedInfo.paths.push(path.slice(0));
                    expandedInfo.count += expandedInfo.lastCount;
                    expandedInfo.lastCount = item.count
                }
                path.pop()
            }
        }
    };
    var updateGroupInfoItem = function(that, item, isLastGroupLevel, path, offset) {
        var groupInfo = that.findGroupInfo(path);
        var count;
        if (!groupInfo) {
            if (isLastGroupLevel) {
                count = item.count > 0 ? item.count : item.items.length
            }
            that.addGroupInfo({
                isExpanded: that._isGroupExpanded(path.length - 1),
                path: path.slice(0),
                offset: offset,
                count: count || 0
            })
        } else {
            if (isLastGroupLevel) {
                groupInfo.count = item.count > 0 ? item.count : item.items && item.items.length || 0
            } else {
                item.count = groupInfo.count || item.count
            }
            groupInfo.offset = offset
        }
    };
    var updateGroupInfos = function updateGroupInfos(that, options, items, loadedGroupCount, groupIndex, path, parentIndex) {
        var groupCount = options.group ? options.group.length : 0;
        var isLastGroupLevel = groupCount === loadedGroupCount;
        var remotePaging = options.remoteOperations.paging;
        var offset = 0;
        var totalCount = 0;
        var count;
        groupIndex = groupIndex || 0;
        path = path || [];
        if (remotePaging && !parentIndex) {
            offset = 0 === groupIndex ? options.skip || 0 : options.skips[groupIndex - 1] || 0
        }
        if (groupIndex >= loadedGroupCount) {
            return items.length
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item) {
                path.push(item.key);
                if (!item.count && !item.items || void 0 === item.items) {
                    return -1
                }
                updateGroupInfoItem(that, item, isLastGroupLevel, path, offset + i);
                count = item.items ? updateGroupInfos(that, options, item.items, loadedGroupCount, groupIndex + 1, path, i) : item.count || -1;
                if (count < 0) {
                    return -1
                }
                totalCount += count;
                path.pop()
            }
        }
        return totalCount
    };
    var isGroupExpanded = function(groups, groupIndex) {
        return groups && groups.length && groups[groupIndex] && !!groups[groupIndex].isExpanded
    };
    var getTotalOffset = function(groupInfos, pageSize, offset) {
        var groupSize;
        var totalOffset = offset;
        for (var groupIndex = 0; groupIndex < groupInfos.length; groupIndex++) {
            groupSize = groupInfos[groupIndex].offset + 1;
            if (groupIndex > 0) {
                groupSize += groupInfos[groupIndex - 1].childrenTotalCount;
                if (pageSize) {
                    groupSize += getContinuationGroupCount(totalOffset, pageSize, groupSize, groupIndex - 1) * groupIndex
                }
            }
            totalOffset += groupSize
        }
        return totalOffset
    };

    function applyContinuationToGroupItem(options, expandedInfo, groupLevel, expandedItemIndex) {
        var item = expandedInfo.items[expandedItemIndex];
        var skip = options.skips && options.skips[groupLevel];
        var take = options.takes && options.takes[groupLevel];
        var isLastExpandedItem = expandedItemIndex === expandedInfo.items.length - 1;
        var isFirstExpandedItem = 0 === expandedItemIndex;
        var lastExpandedItemSkip = isFirstExpandedItem && skip || 0;
        var isItemsTruncatedByTake = item.count > take + lastExpandedItemSkip;
        if (isFirstExpandedItem && void 0 !== skip) {
            item.isContinuation = true
        }
        if (isLastExpandedItem && void 0 !== take && isItemsTruncatedByTake) {
            item.isContinuationOnNextPage = true
        }
    }

    function isDataDeferred(data) {
        return !Array.isArray(data)
    }

    function makeDataDeferred(options) {
        if (!isDataDeferred(options.data)) {
            options.data = new Deferred
        }
    }

    function loadGroupItems(that, options, loadedGroupCount, expandedInfo, groupLevel, data) {
        if (!options.isCustomLoading) {
            expandedInfo = {};
            processGroupItems(that, data, loadedGroupCount, expandedInfo, []);
            ! function(options, expandedInfo, currentGroupCount) {
                var currentGroupIndex = currentGroupCount - 1;
                var groupCount = options.group ? options.group.length : 0;
                expandedInfo.skip = options.skips && options.skips[currentGroupIndex];
                if (options.takes && void 0 !== options.takes[currentGroupIndex]) {
                    if (groupCount === currentGroupCount) {
                        expandedInfo.take = expandedInfo.count ? expandedInfo.count - (expandedInfo.skip || 0) : 0
                    } else {
                        expandedInfo.take = 0
                    }
                    expandedInfo.take += options.takes[currentGroupIndex]
                }
            }(options, expandedInfo, loadedGroupCount)
        }
        var groupCount = options.group ? options.group.length : 0;
        if (expandedInfo.paths.length && groupCount - loadedGroupCount > 0) {
            makeDataDeferred(options);
            ! function(that, options, expandedInfo, loadedGroupCount, groupLevel, data) {
                var groups = options.group || [];
                var currentGroup = groups[groupLevel + 1];
                var deferreds = [];
                each(expandedInfo.paths, (function(expandedItemIndex) {
                    var loadOptions = {
                        requireTotalCount: false,
                        requireGroupCount: true,
                        group: [currentGroup],
                        groupSummary: options.storeLoadOptions.groupSummary,
                        filter: createGroupFilter(expandedInfo.paths[expandedItemIndex], {
                            filter: options.storeLoadOptions.filter,
                            group: groups
                        }),
                        select: options.storeLoadOptions.select
                    };
                    if (0 === expandedItemIndex) {
                        loadOptions.skip = expandedInfo.skip || 0
                    }
                    if (expandedItemIndex === expandedInfo.paths.length - 1) {
                        loadOptions.take = expandedInfo.take
                    }
                    var loadResult = 0 === loadOptions.take ? [] : that._dataSource.loadFromStore(loadOptions);
                    when(loadResult).done((function(data) {
                        var item = expandedInfo.items[expandedItemIndex];
                        applyContinuationToGroupItem(options, expandedInfo, groupLevel, expandedItemIndex);
                        item.items = data
                    }));
                    deferreds.push(loadResult)
                }));
                when.apply(null, deferreds).done((function() {
                    updateGroupInfos(that, options, data, loadedGroupCount + 1);
                    loadGroupItems(that, options, loadedGroupCount + 1, expandedInfo, groupLevel + 1, data)
                }))
            }(that, options, expandedInfo, loadedGroupCount, groupLevel, data)
        } else if (expandedInfo.paths.length && options.storeLoadOptions.group) {
            makeDataDeferred(options);
            ! function(that, options, expandedInfo, data) {
                var expandedFilters = [];
                var groups = options.group || [];
                each(expandedInfo.paths, (function(_, expandedPath) {
                    expandedFilters.push(createGroupFilter(expandedPath, {
                        group: options.isCustomLoading ? options.storeLoadOptions.group : groups
                    }))
                }));
                var filter = options.storeLoadOptions.filter;
                if (!options.storeLoadOptions.isLoadingAll) {
                    filter = dataGridCore.combineFilters([filter, dataGridCore.combineFilters(expandedFilters, "or")])
                }
                var loadOptions = extend({}, options.storeLoadOptions, {
                    requireTotalCount: false,
                    requireGroupCount: false,
                    group: null,
                    sort: groups.concat(dataGridCore.normalizeSortingInfo(options.storeLoadOptions.sort || [])),
                    filter: filter
                });
                var isPagingLocal = that._dataSource.isLastLevelGroupItemsPagingLocal();
                if (!isPagingLocal) {
                    loadOptions.skip = expandedInfo.skip;
                    loadOptions.take = expandedInfo.take
                }
                when(0 === expandedInfo.take ? [] : that._dataSource.loadFromStore(loadOptions)).done((function(items, extra) {
                    if (isPagingLocal) {
                        items = that._dataSource.sortLastLevelGroupItems(items, groups, expandedInfo.paths);
                        items = expandedInfo.skip ? items.slice(expandedInfo.skip) : items;
                        items = expandedInfo.take ? items.slice(0, expandedInfo.take) : items
                    }
                    each(expandedInfo.items, (function(index, item) {
                        var itemCount = item.count - (0 === index && expandedInfo.skip || 0);
                        var expandedItems = items.splice(0, itemCount);
                        applyContinuationToGroupItem(options, expandedInfo, groups.length - 1, index);
                        item.items = expandedItems
                    }));
                    options.data.resolve(data)
                })).fail(options.data.reject)
            }(that, options, expandedInfo, data)
        } else if (isDataDeferred(options.data)) {
            options.data.resolve(data)
        }
    }
    var loadGroupTotalCount = function(dataSource, options) {
        var d = new Deferred;
        var isGrouping = !!(options.group && options.group.length);
        var loadOptions = extend({
            skip: 0,
            take: 1,
            requireGroupCount: isGrouping,
            requireTotalCount: !isGrouping
        }, options, {
            group: isGrouping ? options.group : null
        });
        dataSource.load(loadOptions).done((function(data, extra) {
            var count = extra && (isGrouping ? extra.groupCount : extra.totalCount);
            if (!isFinite(count)) {
                d.reject(dataErrors.Error(isGrouping ? "E4022" : "E4021"));
                return
            }
            d.resolve(count)
        })).fail(d.reject.bind(d));
        return d
    };
    return {
        updateTotalItemsCount: function(options) {
            var totalItemsCount = 0;
            var totalCount = options.extra && options.extra.totalCount || 0;
            var groupCount = options.extra && options.extra.groupCount || 0;
            var pageSize = this._dataSource.pageSize();
            var isVirtualPaging = this._isVirtualPaging();
            foreachExpandedGroups(this, (function(groupInfo) {
                groupInfo.childrenTotalCount = 0
            }));
            foreachExpandedGroups(this, (function(groupInfo, parents) {
                var totalOffset = getTotalOffset(parents, isVirtualPaging ? 0 : pageSize, totalItemsCount);
                var count = groupInfo.count + groupInfo.childrenTotalCount;
                if (!isVirtualPaging) {
                    count += getContinuationGroupCount(totalOffset, pageSize, count, parents.length - 1)
                }
                if (parents[parents.length - 2]) {
                    parents[parents.length - 2].childrenTotalCount += count
                } else {
                    totalItemsCount += count
                }
            }));
            this.callBase(totalItemsCount - totalCount + groupCount)
        },
        _isGroupExpanded: function(groupIndex) {
            var groups = this._dataSource.group();
            return isGroupExpanded(groups, groupIndex)
        },
        _updatePagingOptions: function(options, callback) {
            var isVirtualPaging = this._isVirtualPaging();
            var pageSize = this._dataSource.pageSize();
            var skips = [];
            var takes = [];
            var skipChildrenTotalCount = 0;
            var childrenTotalCount = 0;
            if (options.take) {
                foreachExpandedGroups(this, (function(groupInfo) {
                    groupInfo.childrenTotalCount = 0;
                    groupInfo.skipChildrenTotalCount = 0
                }));
                foreachExpandedGroups(this, (function(groupInfo, parents) {
                    var take;
                    var takeCorrection = 0;
                    var parentTakeCorrection = 0;
                    var totalOffset = getTotalOffset(parents, isVirtualPaging ? 0 : pageSize, childrenTotalCount);
                    var continuationGroupCount = 0;
                    var skipContinuationGroupCount = 0;
                    var groupInfoCount = groupInfo.count + groupInfo.childrenTotalCount;
                    var childrenGroupInfoCount = groupInfoCount;
                    callback && callback(groupInfo, totalOffset);
                    var skip = options.skip - totalOffset;
                    if (totalOffset <= options.skip + options.take && groupInfoCount) {
                        take = options.take;
                        if (!isVirtualPaging) {
                            continuationGroupCount = getContinuationGroupCount(totalOffset, pageSize, groupInfoCount, parents.length - 1);
                            groupInfoCount += continuationGroupCount * parents.length;
                            childrenGroupInfoCount += continuationGroupCount;
                            if (pageSize && skip >= 0) {
                                takeCorrection = parents.length;
                                parentTakeCorrection = parents.length - 1;
                                skipContinuationGroupCount = Math.floor(skip / pageSize)
                            }
                        }
                        if (skip >= 0) {
                            if (totalOffset + groupInfoCount > options.skip) {
                                skips.unshift(skip - skipContinuationGroupCount * takeCorrection - groupInfo.skipChildrenTotalCount)
                            }
                            if (totalOffset + groupInfoCount >= options.skip + take) {
                                takes.unshift(take - takeCorrection - groupInfo.childrenTotalCount + groupInfo.skipChildrenTotalCount)
                            }
                        } else if (totalOffset + groupInfoCount >= options.skip + take) {
                            takes.unshift(take + skip - groupInfo.childrenTotalCount)
                        }
                    }
                    if (totalOffset <= options.skip) {
                        if (parents[parents.length - 2]) {
                            parents[parents.length - 2].skipChildrenTotalCount += Math.min(childrenGroupInfoCount, skip + 1 - skipContinuationGroupCount * parentTakeCorrection)
                        } else {
                            skipChildrenTotalCount += Math.min(childrenGroupInfoCount, skip + 1)
                        }
                    }
                    if (totalOffset <= options.skip + take) {
                        groupInfoCount = Math.min(childrenGroupInfoCount, skip + take - (skipContinuationGroupCount + 1) * parentTakeCorrection);
                        if (parents[parents.length - 2]) {
                            parents[parents.length - 2].childrenTotalCount += groupInfoCount
                        } else {
                            childrenTotalCount += groupInfoCount
                        }
                    }
                }));
                options.skip -= skipChildrenTotalCount;
                options.take -= childrenTotalCount - skipChildrenTotalCount
            }
            options.skips = skips;
            options.takes = takes
        },
        changeRowExpand: function(path) {
            var groupInfo = this.findGroupInfo(path);
            var dataSource = this._dataSource;
            var remoteGroupPaging = dataSource.remoteOperations().groupPaging;
            var groups = dataGridCore.normalizeSortingInfo(dataSource.group());
            if (groupInfo) {
                groupInfo.isExpanded = !groupInfo.isExpanded;
                if (remoteGroupPaging && groupInfo.isExpanded && path.length < groups.length) {
                    return loadGroupTotalCount(dataSource, {
                        filter: createGroupFilter(path, {
                            filter: dataSource.lastLoadOptions().filter,
                            group: dataSource.group()
                        }),
                        group: [groups[path.length]],
                        select: dataSource.select()
                    }).done((function(groupCount) {
                        groupInfo.count = groupCount
                    }))
                }
                return (new Deferred).resolve()
            }
            return (new Deferred).reject()
        },
        handleDataLoading: function(options) {
            var storeLoadOptions = options.storeLoadOptions;
            var groups = dataGridCore.normalizeSortingInfo(storeLoadOptions.group || options.loadOptions.group);
            if (options.isCustomLoading || !groups.length) {
                return
            }
            if (options.remoteOperations.grouping) {
                var remotePaging = this._dataSource.remoteOperations().paging;
                storeLoadOptions.group = dataGridCore.normalizeSortingInfo(storeLoadOptions.group);
                storeLoadOptions.group.forEach((function(group, index) {
                    var isLastGroup = index === storeLoadOptions.group.length - 1;
                    group.isExpanded = !remotePaging || !isLastGroup
                }))
            }
            options.group = options.group || groups;
            if (options.remoteOperations.paging) {
                options.skip = storeLoadOptions.skip;
                options.take = storeLoadOptions.take;
                storeLoadOptions.requireGroupCount = true;
                storeLoadOptions.group = groups.slice(0, 1);
                this._updatePagingOptions(options);
                storeLoadOptions.skip = options.skip;
                storeLoadOptions.take = options.take
            }
        },
        handleDataLoadedCore: function(options, callBase) {
            var loadedGroupCount = dataGridCore.normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group).length;
            var groupCount = options.group ? options.group.length : 0;
            var totalCount;
            var expandedInfo = {};
            if (options.isCustomLoading) {
                callBase(options);
                processGroupItems(this, options.data, loadedGroupCount, expandedInfo, [], options.isCustomLoading, options.storeLoadOptions.isLoadingAll)
            } else {
                if (!options.remoteOperations.paging) {
                    this.foreachGroups((function(groupInfo) {
                        groupInfo.count = 0
                    }))
                }
                totalCount = updateGroupInfos(this, options, options.data, loadedGroupCount);
                if (totalCount < 0) {
                    options.data = (new Deferred).reject(errors.Error("E1037"));
                    return
                }
                if (!options.remoteOperations.paging) {
                    if (loadedGroupCount && options.extra && options.loadOptions.requireTotalCount) {
                        options.extra.totalCount = totalCount;
                        options.extra.groupCount = options.data.length
                    }
                }
                if (groupCount && options.storeLoadOptions.requireGroupCount && !isFinite(options.extra.groupCount)) {
                    options.data = (new Deferred).reject(dataErrors.Error("E4022"));
                    return
                }
                this.updateTotalItemsCount(options);
                if (!options.remoteOperations.paging) {
                    this._updatePagingOptions(options)
                }
                callBase(options);
                if (!options.remoteOperations.paging) {
                    this._processPaging(options, loadedGroupCount)
                }
            }
            loadGroupItems(this, options, loadedGroupCount, expandedInfo, 0, options.data)
        },
        _processSkips: function(items, skips, groupCount) {
            if (!groupCount) {
                return
            }
            var firstItem = items[0];
            var skip = skips[0];
            var children = firstItem && firstItem.items;
            if (void 0 !== skip) {
                firstItem.isContinuation = true;
                if (children) {
                    firstItem.items = children.slice(skip);
                    this._processSkips(firstItem.items, skips.slice(1), groupCount - 1)
                }
            }
        },
        _processTakes: function(items, skips, takes, groupCount, parents) {
            if (!groupCount || !items) {
                return
            }
            parents = parents || [];
            var lastItem = items[items.length - 1];
            var children = lastItem && lastItem.items;
            var take = takes[0];
            var skip = skips[0];
            if (lastItem) {
                var maxTakeCount = lastItem.count - (lastItem.isContinuation && skip || 0) || children.length;
                if (void 0 !== take && maxTakeCount > take) {
                    lastItem.isContinuationOnNextPage = true;
                    parents.forEach((function(parent) {
                        parent.isContinuationOnNextPage = true
                    }));
                    if (children) {
                        children = children.slice(0, take);
                        lastItem.items = children
                    }
                }
                parents.push(lastItem);
                this._processTakes(children, skips.slice(1), takes.slice(1), groupCount - 1, parents)
            }
        },
        _processPaging: function(options, groupCount) {
            this._processSkips(options.data, options.skips, groupCount);
            this._processTakes(options.data, options.skips, options.takes, groupCount)
        },
        isLastLevelGroupItemsPagingLocal: function() {
            return false
        },
        sortLastLevelGroupItems: function(items) {
            return items
        },
        refresh: function(options, operationTypes) {
            var that = this;
            var dataSource = that._dataSource;
            var storeLoadOptions = options.storeLoadOptions;
            var group = options.group || options.storeLoadOptions.group;
            var oldGroups = dataGridCore.normalizeSortingInfo(that._group);
            var isExpanded;
            var groupIndex;

            function handleGroup(groupInfo, parents) {
                if (parents.length === groupIndex + 1) {
                    groupInfo.isExpanded = isExpanded
                }
            }
            for (groupIndex = 0; groupIndex < oldGroups.length; groupIndex++) {
                isExpanded = isGroupExpanded(group, groupIndex);
                if (isGroupExpanded(that._group, groupIndex) !== isExpanded) {
                    that.foreachGroups(handleGroup)
                }
            }
            that.callBase.apply(this, arguments);
            if (group && options.remoteOperations.paging && operationTypes.reload) {
                return foreachExpandedGroups(that, (function(groupInfo) {
                    var groupCountQuery = loadGroupTotalCount(dataSource, {
                        filter: createGroupFilter(groupInfo.path, {
                            filter: storeLoadOptions.filter,
                            group: group
                        }),
                        group: group.slice(groupInfo.path.length),
                        select: storeLoadOptions.select
                    });
                    var groupOffsetQuery = loadGroupTotalCount(dataSource, {
                        filter: createOffsetFilter(groupInfo.path, {
                            filter: storeLoadOptions.filter,
                            group: group
                        }, true),
                        group: group.slice(groupInfo.path.length - 1, groupInfo.path.length),
                        select: storeLoadOptions.select
                    });
                    return when(groupOffsetQuery, groupCountQuery).done((function(offset, count) {
                        offset = parseInt(offset.length ? offset[0] : offset);
                        count = parseInt(count.length ? count[0] : count);
                        groupInfo.offset = offset;
                        if (groupInfo.count !== count) {
                            groupInfo.count = count;
                            that.updateTotalItemsCount(options)
                        }
                    }))
                }), true)
            }
        }
    }
}());
