/**
 * DevExtreme (esm/ui/sortable.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import eventsEngine from "../events/core/events_engine";
import registerComponent from "../core/component_registrator";
import {
    extend
} from "../core/utils/extend";
import Draggable from "./draggable";
import {
    getPublicElement
} from "../core/element";
import {
    getWindow
} from "../core/utils/window";
import {
    getBoundingRect
} from "../core/utils/position";
import {
    resetPosition
} from "../animation/translator";
import fx from "../animation/fx";
import {
    Deferred
} from "../core/utils/deferred";
var window = getWindow();
var SORTABLE = "dxSortable";
var PLACEHOLDER_CLASS = "placeholder";
var CLONE_CLASS = "clone";
var isElementVisible = itemElement => $(itemElement).is(":visible");
var animate = (element, config) => {
    var _config$to, _config$to2;
    if (!element) {
        return
    }
    var left = (null === (_config$to = config.to) || void 0 === _config$to ? void 0 : _config$to.left) || 0;
    var top = (null === (_config$to2 = config.to) || void 0 === _config$to2 ? void 0 : _config$to2.top) || 0;
    element.style.transform = "translate(".concat(left, "px,").concat(top, "px)");
    element.style.transition = fx.off ? "" : "transform ".concat(config.duration, "ms ").concat(config.easing)
};
var stopAnimation = element => {
    if (!element) {
        return
    }
    element.style.transform = "";
    element.style.transition = ""
};

function getScrollableBoundary($scrollable) {
    var offset = $scrollable.offset();
    var style = $scrollable[0].style;
    var paddingLeft = parseFloat(style.paddingLeft) || 0;
    var paddingRight = parseFloat(style.paddingRight) || 0;
    var paddingTop = parseFloat(style.paddingTop) || 0;
    var width = $scrollable[0].clientWidth - (paddingLeft + paddingRight);
    var height = $scrollable.height();
    var left = offset.left + paddingLeft;
    var top = offset.top + paddingTop;
    return {
        left: left,
        right: left + width,
        top: top,
        bottom: top + height
    }
}
var Sortable = Draggable.inherit({
    _init: function() {
        this.callBase();
        this._sourceScrollHandler = this._handleSourceScroll.bind(this);
        this._sourceScrollableInfo = null
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            clone: true,
            filter: "> *",
            itemOrientation: "vertical",
            dropFeedbackMode: "push",
            allowDropInsideItem: false,
            allowReordering: true,
            moveItemOnDrop: false,
            onDragChange: null,
            onAdd: null,
            onRemove: null,
            onReorder: null,
            onPlaceholderPrepared: null,
            animation: {
                type: "slide",
                duration: 300,
                easing: "ease"
            },
            fromIndex: null,
            toIndex: null,
            dropInsideItem: false,
            itemPoints: null,
            fromIndexOffset: 0,
            offset: 0,
            autoUpdate: false,
            draggableElementSize: 0
        })
    },
    reset: function() {
        this.option({
            dropInsideItem: false,
            toIndex: null,
            fromIndex: null,
            itemPoints: null,
            fromIndexOffset: 0,
            draggableElementSize: 0
        });
        if (this._$placeholderElement) {
            this._$placeholderElement.remove()
        }
        this._$placeholderElement = null;
        if (!this._isIndicateMode() && this._$modifiedItem) {
            this._$modifiedItem.css("marginBottom", this._modifiedItemMargin);
            this._$modifiedItem = null
        }
    },
    _getPrevVisibleItem: function(items, index) {
        return items.slice(0, index).reverse().filter(isElementVisible)[0]
    },
    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);
        if (true === e.cancel) {
            return
        }
        var $sourceElement = this._getSourceElement();
        this._updateItemPoints();
        this._subscribeToSourceScroll(e);
        this.option("fromIndex", this._getElementIndex($sourceElement));
        this.option("fromIndexOffset", this.option("offset"))
    },
    _dragEndHandler: function() {
        this.callBase.apply(this, arguments);
        this._unsubscribeFromSourceScroll()
    },
    _subscribeToSourceScroll: function(e) {
        var $scrollable = this._getScrollable($(e.target));
        if ($scrollable) {
            this._sourceScrollableInfo = {
                element: $scrollable,
                scrollLeft: $scrollable.scrollLeft(),
                scrollTop: $scrollable.scrollTop()
            };
            eventsEngine.on($scrollable, "scroll", this._sourceScrollHandler)
        }
    },
    _unsubscribeFromSourceScroll: function() {
        if (this._sourceScrollableInfo) {
            eventsEngine.off(this._sourceScrollableInfo.element, "scroll", this._sourceScrollHandler);
            this._sourceScrollableInfo = null
        }
    },
    _handleSourceScroll: function(e) {
        var sourceScrollableInfo = this._sourceScrollableInfo;
        if (sourceScrollableInfo) {
            ["scrollLeft", "scrollTop"].forEach(scrollProp => {
                if (e.target[scrollProp] !== sourceScrollableInfo[scrollProp]) {
                    var scrollBy = e.target[scrollProp] - sourceScrollableInfo[scrollProp];
                    this._correctItemPoints(scrollBy);
                    sourceScrollableInfo[scrollProp] = e.target[scrollProp]
                }
            })
        }
    },
    _dragEnterHandler: function() {
        this.callBase.apply(this, arguments);
        if (this === this._getSourceDraggable()) {
            return
        }
        this._updateItemPoints();
        this.option("fromIndex", -1);
        if (!this._isIndicateMode()) {
            var itemPoints = this.option("itemPoints");
            var lastItemPoint = itemPoints[itemPoints.length - 1];
            if (lastItemPoint) {
                var $element = this.$element();
                var $sourceElement = this._getSourceElement();
                var isVertical = this._isVerticalOrientation();
                var sourceElementSize = isVertical ? $sourceElement.outerHeight(true) : $sourceElement.outerWidth(true);
                var scrollSize = $element.get(0)[isVertical ? "scrollHeight" : "scrollWidth"];
                var scrollPosition = $element.get(0)[isVertical ? "scrollTop" : "scrollLeft"];
                var positionProp = isVertical ? "top" : "left";
                var lastPointPosition = lastItemPoint[positionProp];
                var elementPosition = $element.offset()[positionProp];
                var freeSize = elementPosition + scrollSize - scrollPosition - lastPointPosition;
                if (freeSize < sourceElementSize) {
                    if (isVertical) {
                        var items = this._getItems();
                        var $lastItem = $(this._getPrevVisibleItem(items));
                        this._$modifiedItem = $lastItem;
                        this._modifiedItemMargin = $lastItem.get(0).style.marginBottom;
                        $lastItem.css("marginBottom", sourceElementSize - freeSize);
                        var $sortable = $lastItem.closest(".dx-sortable");
                        var sortable = $sortable.data("dxScrollable") || $sortable.data("dxScrollView");
                        sortable && sortable.update()
                    }
                }
            }
        }
    },
    dragEnter: function() {
        if (this !== this._getTargetDraggable()) {
            this.option("toIndex", -1)
        }
    },
    dragLeave: function() {
        if (this !== this._getTargetDraggable()) {
            this.option("toIndex", this.option("fromIndex"))
        }
    },
    _isInsideTargetDraggable: function(event) {
        var $targetDraggable = this._getTargetDraggable().$element();
        var $scrollable = this._getScrollable($targetDraggable);
        if ($scrollable) {
            var {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            } = getScrollableBoundary($scrollable);
            var validX = left <= event.pageX && event.pageX <= right;
            var validY = top <= event.pageY && event.pageY <= bottom;
            return validY && validX
        }
        return true
    },
    dragEnd: function(sourceEvent) {
        var $sourceElement = this._getSourceElement();
        var sourceDraggable = this._getSourceDraggable();
        var isSourceDraggable = sourceDraggable.NAME !== this.NAME;
        var toIndex = this.option("toIndex");
        var isInsideTargetDraggable = this._isInsideTargetDraggable(sourceEvent.event);
        if (null !== toIndex && toIndex >= 0 && isInsideTargetDraggable) {
            var cancelAdd;
            var cancelRemove;
            if (sourceDraggable !== this) {
                cancelAdd = this._fireAddEvent(sourceEvent);
                if (!cancelAdd) {
                    cancelRemove = this._fireRemoveEvent(sourceEvent)
                }
            }
            if (isSourceDraggable) {
                resetPosition($sourceElement)
            }
            if (this.option("moveItemOnDrop")) {
                !cancelAdd && this._moveItem($sourceElement, toIndex, cancelRemove)
            }
            if (sourceDraggable === this) {
                return this._fireReorderEvent(sourceEvent)
            }
        }
        return (new Deferred).resolve()
    },
    dragMove: function(e) {
        var itemPoints = this.option("itemPoints");
        if (!itemPoints) {
            return
        }
        var isVertical = this._isVerticalOrientation();
        var axisName = isVertical ? "top" : "left";
        var cursorPosition = isVertical ? e.pageY : e.pageX;
        var rtlEnabled = this.option("rtlEnabled");
        var itemPoint;
        for (var i = itemPoints.length - 1; i >= 0; i--) {
            var centerPosition = itemPoints[i + 1] && (itemPoints[i][axisName] + itemPoints[i + 1][axisName]) / 2;
            if ((!isVertical && rtlEnabled ? cursorPosition > centerPosition : centerPosition > cursorPosition) || void 0 === centerPosition) {
                itemPoint = itemPoints[i]
            } else {
                break
            }
        }
        if (itemPoint) {
            this._updatePlaceholderPosition(e, itemPoint);
            if (this._verticalScrollHelper.isScrolling() && this._isIndicateMode()) {
                this._movePlaceholder()
            }
        }
    },
    _isIndicateMode: function() {
        return "indicate" === this.option("dropFeedbackMode") || this.option("allowDropInsideItem")
    },
    _createPlaceholder: function() {
        var $placeholderContainer;
        if (this._isIndicateMode()) {
            $placeholderContainer = $("<div>").addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS)).insertBefore(this._getSourceDraggable()._$dragElement)
        }
        this._$placeholderElement = $placeholderContainer;
        return $placeholderContainer
    },
    _getItems: function() {
        var itemsSelector = this._getItemsSelector();
        return this._$content().find(itemsSelector).not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS)).not("." + this._addWidgetPrefix(CLONE_CLASS)).toArray()
    },
    _allowReordering: function() {
        var sourceDraggable = this._getSourceDraggable();
        var targetDraggable = this._getTargetDraggable();
        return sourceDraggable !== targetDraggable || this.option("allowReordering")
    },
    _isValidPoint: function(visibleIndex, draggableVisibleIndex, dropInsideItem) {
        var allowDropInsideItem = this.option("allowDropInsideItem");
        var allowReordering = dropInsideItem || this._allowReordering();
        if (!allowReordering && (0 !== visibleIndex || !allowDropInsideItem)) {
            return false
        }
        if (!this._isIndicateMode()) {
            return true
        }
        return -1 === draggableVisibleIndex || visibleIndex !== draggableVisibleIndex && (dropInsideItem || visibleIndex !== draggableVisibleIndex + 1)
    },
    _getItemPoints: function() {
        var result = [];
        var $item;
        var offset;
        var itemWidth;
        var rtlEnabled = this.option("rtlEnabled");
        var isVertical = this._isVerticalOrientation();
        var itemElements = this._getItems();
        var visibleItemElements = itemElements.filter(isElementVisible);
        var visibleItemCount = visibleItemElements.length;
        var $draggableItem = this._getDraggableElement();
        var draggableVisibleIndex = visibleItemElements.indexOf($draggableItem.get(0));
        if (visibleItemCount) {
            for (var i = 0; i <= visibleItemCount; i++) {
                var needCorrectLeftPosition = !isVertical && rtlEnabled ^ i === visibleItemCount;
                var needCorrectTopPosition = isVertical && i === visibleItemCount;
                if (i < visibleItemCount) {
                    $item = $(visibleItemElements[i]);
                    offset = $item.offset();
                    itemWidth = $item.outerWidth()
                }
                result.push({
                    dropInsideItem: false,
                    left: offset.left + (needCorrectLeftPosition ? itemWidth : 0),
                    top: offset.top + (needCorrectTopPosition ? result[i - 1].height : 0),
                    index: i === visibleItemCount ? itemElements.length : itemElements.indexOf($item.get(0)),
                    $item: $item,
                    width: $item.outerWidth(),
                    height: $item.outerHeight(),
                    isValid: this._isValidPoint(i, draggableVisibleIndex)
                })
            }
            if (this.option("allowDropInsideItem")) {
                var points = result;
                result = [];
                for (var _i = 0; _i < points.length; _i++) {
                    result.push(points[_i]);
                    if (points[_i + 1]) {
                        result.push(extend({}, points[_i], {
                            dropInsideItem: true,
                            top: Math.floor((points[_i].top + points[_i + 1].top) / 2),
                            left: Math.floor((points[_i].left + points[_i + 1].left) / 2),
                            isValid: this._isValidPoint(_i, draggableVisibleIndex, true)
                        }))
                    }
                }
            }
        } else {
            result.push({
                dropInsideItem: false,
                index: 0,
                isValid: true
            })
        }
        return result
    },
    _updateItemPoints: function(forceUpdate) {
        if (forceUpdate || this.option("autoUpdate") || !this.option("itemPoints")) {
            this.option("itemPoints", this._getItemPoints())
        }
    },
    _correctItemPoints: function(scrollBy) {
        var itemPoints = this.option("itemPoints");
        if (scrollBy && itemPoints && !this.option("autoUpdate")) {
            var isVertical = this._isVerticalOrientation();
            var positionPropName = isVertical ? "top" : "left";
            itemPoints.forEach(itemPoint => {
                itemPoint[positionPropName] -= scrollBy
            })
        }
    },
    _getElementIndex: function($itemElement) {
        return this._getItems().indexOf($itemElement.get(0))
    },
    _getDragTemplateArgs: function($element) {
        var args = this.callBase.apply(this, arguments);
        args.model.fromIndex = this._getElementIndex($element);
        return args
    },
    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value)
    },
    _isVerticalOrientation: function() {
        return "vertical" === this.option("itemOrientation")
    },
    _normalizeToIndex: function(toIndex, dropInsideItem) {
        var isAnotherDraggable = this._getSourceDraggable() !== this._getTargetDraggable();
        var fromIndex = this.option("fromIndex");
        if (null === toIndex) {
            return fromIndex
        }
        return Math.max(isAnotherDraggable || fromIndex >= toIndex || dropInsideItem ? toIndex : toIndex - 1, 0)
    },
    _updatePlaceholderPosition: function(e, itemPoint) {
        var sourceDraggable = this._getSourceDraggable();
        var toIndex = this._normalizeToIndex(itemPoint.index, itemPoint.dropInsideItem);
        var eventArgs = extend(this._getEventArgs(e), {
            toIndex: toIndex,
            dropInsideItem: itemPoint.dropInsideItem
        });
        itemPoint.isValid && this._getAction("onDragChange")(eventArgs);
        if (eventArgs.cancel || !itemPoint.isValid) {
            if (!itemPoint.isValid) {
                this.option({
                    dropInsideItem: false,
                    toIndex: null
                })
            }
            return
        }
        this.option({
            dropInsideItem: itemPoint.dropInsideItem,
            toIndex: itemPoint.index
        });
        this._getAction("onPlaceholderPrepared")(extend(this._getEventArgs(e), {
            placeholderElement: getPublicElement(this._$placeholderElement),
            dragElement: getPublicElement(sourceDraggable._$dragElement)
        }));
        this._updateItemPoints()
    },
    _makeWidthCorrection: function($item, width) {
        this._$scrollable = this._getScrollable($item);
        if (this._$scrollable && this._$scrollable.width() < width) {
            var scrollableWidth = this._$scrollable.width();
            var offsetLeft = $item.offset().left - this._$scrollable.offset().left;
            var offsetRight = scrollableWidth - $item.outerWidth() - offsetLeft;
            if (offsetLeft > 0) {
                width = scrollableWidth - offsetLeft
            } else if (offsetRight > 0) {
                width = scrollableWidth - offsetRight
            } else {
                width = scrollableWidth
            }
        }
        return width
    },
    _updatePlaceholderSizes: function($placeholderElement, itemElement) {
        var dropInsideItem = this.option("dropInsideItem");
        var $item = $(itemElement);
        var isVertical = this._isVerticalOrientation();
        var width = "";
        var height = "";
        $placeholderElement.toggleClass(this._addWidgetPrefix("placeholder-inside"), dropInsideItem);
        if (isVertical || dropInsideItem) {
            width = $item.outerWidth()
        }
        if (!isVertical || dropInsideItem) {
            height = $item.outerHeight()
        }
        width = this._makeWidthCorrection($item, width);
        $placeholderElement.css({
            width: width,
            height: height
        })
    },
    _moveItem: function($itemElement, index, cancelRemove) {
        var $prevTargetItemElement;
        var $itemElements = this._getItems();
        var $targetItemElement = $itemElements[index];
        var sourceDraggable = this._getSourceDraggable();
        if (cancelRemove) {
            $itemElement = $itemElement.clone();
            sourceDraggable._toggleDragSourceClass(false, $itemElement)
        }
        if (!$targetItemElement) {
            $prevTargetItemElement = $itemElements[index - 1]
        }
        this._moveItemCore($itemElement, $targetItemElement, $prevTargetItemElement)
    },
    _moveItemCore: function($targetItem, item, prevItem) {
        if (!item && !prevItem) {
            $targetItem.appendTo(this.$element())
        } else if (prevItem) {
            $targetItem.insertAfter($(prevItem))
        } else {
            $targetItem.insertBefore($(item))
        }
    },
    _getDragStartArgs: function(e, $itemElement) {
        return extend(this.callBase.apply(this, arguments), {
            fromIndex: this._getElementIndex($itemElement)
        })
    },
    _getEventArgs: function(e) {
        var sourceDraggable = this._getSourceDraggable();
        var targetDraggable = this._getTargetDraggable();
        var dropInsideItem = targetDraggable.option("dropInsideItem");
        return extend(this.callBase.apply(this, arguments), {
            fromIndex: sourceDraggable.option("fromIndex"),
            toIndex: this._normalizeToIndex(targetDraggable.option("toIndex"), dropInsideItem),
            dropInsideItem: dropInsideItem
        })
    },
    _optionChanged: function(args) {
        var name = args.name;
        switch (name) {
            case "onDragChange":
            case "onPlaceholderPrepared":
            case "onAdd":
            case "onRemove":
            case "onReorder":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "itemOrientation":
            case "allowDropInsideItem":
            case "moveItemOnDrop":
            case "dropFeedbackMode":
            case "itemPoints":
            case "animation":
            case "allowReordering":
            case "fromIndexOffset":
            case "offset":
            case "draggableElementSize":
            case "autoUpdate":
                break;
            case "fromIndex":
                [false, true].forEach(isDragSource => {
                    var fromIndex = isDragSource ? args.value : args.previousValue;
                    if (null !== fromIndex) {
                        var $fromElement = $(this._getItems()[fromIndex]);
                        this._toggleDragSourceClass(isDragSource, $fromElement)
                    }
                });
                break;
            case "dropInsideItem":
                this._optionChangedDropInsideItem(args);
                break;
            case "toIndex":
                this._optionChangedToIndex(args);
                break;
            default:
                this.callBase(args)
        }
    },
    _optionChangedDropInsideItem: function() {
        if (this._isIndicateMode() && this._$placeholderElement) {
            this._movePlaceholder()
        }
    },
    _isPositionVisible: function(position) {
        var $element = this.$element();
        var scrollContainer;
        if ("hidden" !== $element.css("overflow")) {
            scrollContainer = $element.get(0)
        } else {
            $element.parents().each((function() {
                if ("visible" !== $(this).css("overflow")) {
                    scrollContainer = this;
                    return false
                }
            }))
        }
        if (scrollContainer) {
            var clientRect = getBoundingRect(scrollContainer);
            var isVerticalOrientation = this._isVerticalOrientation();
            var start = isVerticalOrientation ? "top" : "left";
            var end = isVerticalOrientation ? "bottom" : "right";
            var pageOffset = isVerticalOrientation ? window.pageYOffset : window.pageXOffset;
            if (position[start] < clientRect[start] + pageOffset || position[start] > clientRect[end] + pageOffset) {
                return false
            }
        }
        return true
    },
    _optionChangedToIndex: function(args) {
        var toIndex = args.value;
        if (this._isIndicateMode()) {
            var showPlaceholder = null !== toIndex && toIndex >= 0;
            this._togglePlaceholder(showPlaceholder);
            if (showPlaceholder) {
                this._movePlaceholder()
            }
        } else {
            this._moveItems(args.previousValue, args.value, args.fullUpdate)
        }
    },
    update: function() {
        if (null === this.option("fromIndex") && null === this.option("toIndex")) {
            return
        }
        this._updateItemPoints(true);
        this._updateDragSourceClass();
        var toIndex = this.option("toIndex");
        this._optionChangedToIndex({
            value: toIndex,
            fullUpdate: true
        })
    },
    _updateDragSourceClass: function() {
        var fromIndex = this._getActualFromIndex();
        var $fromElement = $(this._getItems()[fromIndex]);
        if ($fromElement.length) {
            this._$sourceElement = $fromElement;
            this._toggleDragSourceClass(true, $fromElement)
        }
    },
    _makeLeftCorrection: function(left, leftMargin) {
        var $scrollable = this._$scrollable;
        if ($scrollable && this._isVerticalOrientation() && $scrollable.scrollLeft() > leftMargin) {
            left += $scrollable.scrollLeft() - leftMargin
        }
        return left
    },
    _movePlaceholder: function() {
        var $placeholderElement = this._$placeholderElement || this._createPlaceholder();
        var items = this._getItems();
        var toIndex = this.option("toIndex");
        var isVerticalOrientation = this._isVerticalOrientation();
        var rtlEnabled = this.option("rtlEnabled");
        var dropInsideItem = this.option("dropInsideItem");
        var position = null;
        var leftMargin = 0;
        var itemElement = items[toIndex];
        if (itemElement) {
            var $itemElement = $(itemElement);
            position = $itemElement.offset();
            leftMargin = parseFloat($itemElement.css("marginLeft"));
            if (!isVerticalOrientation && rtlEnabled && !dropInsideItem) {
                position.left += $itemElement.outerWidth(true)
            }
        } else {
            var prevVisibleItemElement = itemElement = this._getPrevVisibleItem(items, toIndex);
            if (prevVisibleItemElement) {
                position = $(prevVisibleItemElement).offset();
                if (isVerticalOrientation) {
                    position.top += $(prevVisibleItemElement).outerHeight(true)
                } else if (!rtlEnabled) {
                    position.left += $(prevVisibleItemElement).outerWidth(true)
                }
            }
        }
        this._updatePlaceholderSizes($placeholderElement, itemElement);
        if (position && !this._isPositionVisible(position)) {
            position = null
        }
        if (position) {
            position.left = this._makeLeftCorrection(position.left, leftMargin);
            this._move(position, $placeholderElement)
        }
        $placeholderElement.toggle(!!position)
    },
    _getPositions: function(items, elementSize, fromIndex, toIndex) {
        var positions = [];
        for (var i = 0; i < items.length; i++) {
            var position = 0;
            if (null === toIndex || null === fromIndex) {
                positions.push(position);
                continue
            }
            if (-1 === fromIndex) {
                if (i >= toIndex) {
                    position = elementSize
                }
            } else if (-1 === toIndex) {
                if (i > fromIndex) {
                    position = -elementSize
                }
            } else if (fromIndex < toIndex) {
                if (i > fromIndex && i < toIndex) {
                    position = -elementSize
                }
            } else if (fromIndex > toIndex) {
                if (i >= toIndex && i < fromIndex) {
                    position = elementSize
                }
            }
            positions.push(position)
        }
        return positions
    },
    _getDraggableElementSize: function(isVerticalOrientation) {
        var $draggableItem = this._getDraggableElement();
        var size = this.option("draggableElementSize");
        if (!size) {
            size = isVerticalOrientation ? ($draggableItem.outerHeight() + $draggableItem.outerHeight(true)) / 2 : ($draggableItem.outerWidth() + $draggableItem.outerWidth(true)) / 2;
            if (!this.option("autoUpdate")) {
                this.option("draggableElementSize", size)
            }
        }
        return size
    },
    _getActualFromIndex: function() {
        var {
            fromIndex: fromIndex,
            fromIndexOffset: fromIndexOffset,
            offset: offset
        } = this.option();
        return null == fromIndex ? null : fromIndex + fromIndexOffset - offset
    },
    _moveItems: function(prevToIndex, toIndex, fullUpdate) {
        var fromIndex = this._getActualFromIndex();
        var isVerticalOrientation = this._isVerticalOrientation();
        var positionPropName = isVerticalOrientation ? "top" : "left";
        var elementSize = this._getDraggableElementSize(isVerticalOrientation);
        var items = this._getItems();
        var prevPositions = this._getPositions(items, elementSize, fromIndex, prevToIndex);
        var positions = this._getPositions(items, elementSize, fromIndex, toIndex);
        var animationConfig = this.option("animation");
        var rtlEnabled = this.option("rtlEnabled");
        for (var i = 0; i < items.length; i++) {
            var itemElement = items[i];
            var prevPosition = prevPositions[i];
            var position = positions[i];
            if (null === toIndex || null === fromIndex) {
                stopAnimation(itemElement)
            } else if (prevPosition !== position || fullUpdate && position) {
                animate(itemElement, extend({}, animationConfig, {
                    to: {
                        [positionPropName]: !isVerticalOrientation && rtlEnabled ? -position : position
                    }
                }))
            }
        }
    },
    _toggleDragSourceClass: function(value, $element) {
        var $sourceElement = $element || this._$sourceElement;
        this.callBase.apply(this, arguments);
        if (!this._isIndicateMode()) {
            $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix("source-hidden"), value)
        }
    },
    _dispose: function() {
        this.reset();
        this.callBase()
    },
    _fireAddEvent: function(sourceEvent) {
        var args = this._getEventArgs(sourceEvent);
        this._getAction("onAdd")(args);
        return args.cancel
    },
    _fireRemoveEvent: function(sourceEvent) {
        var sourceDraggable = this._getSourceDraggable();
        var args = this._getEventArgs(sourceEvent);
        sourceDraggable._getAction("onRemove")(args);
        return args.cancel
    },
    _fireReorderEvent: function(sourceEvent) {
        var args = this._getEventArgs(sourceEvent);
        this._getAction("onReorder")(args);
        return args.promise || (new Deferred).resolve()
    }
});
registerComponent(SORTABLE, Sortable);
export default Sortable;
