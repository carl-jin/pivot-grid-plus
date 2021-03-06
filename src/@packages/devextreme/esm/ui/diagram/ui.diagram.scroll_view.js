/**
 * DevExtreme (esm/ui/diagram/ui.diagram.scroll_view.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import ScrollView from "../scroll_view";
import {
    getDiagram
} from "./diagram.importer";
class DiagramScrollView extends Widget {
    _init() {
        super._init();
        var {
            EventDispatcher: EventDispatcher
        } = getDiagram();
        this.onScroll = new EventDispatcher;
        this._createOnCreateDiagramAction()
    }
    _initMarkup() {
        super._initMarkup();
        var $scrollViewWrapper = $("<div>").appendTo(this.$element());
        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView, {
            direction: "both",
            bounceEnabled: false,
            onScroll: _ref => {
                var {
                    scrollOffset: scrollOffset
                } = _ref;
                this._raiseOnScroll(scrollOffset.left, scrollOffset.top)
            }
        });
        this._onCreateDiagramAction({
            $parent: $(this._scrollView.content()),
            scrollView: this
        })
    }
    setScroll(left, top) {
        this._scrollView.scrollTo({
            left: left,
            top: top
        });
        this._raiseOnScrollWithoutPoint()
    }
    offsetScroll(left, top) {
        this._scrollView.scrollBy({
            left: left,
            top: top
        });
        this._raiseOnScrollWithoutPoint()
    }
    getSize() {
        var {
            Size: Size
        } = getDiagram();
        var $element = this._scrollView.$element();
        return new Size(Math.floor($element.width()), Math.floor($element.height()))
    }
    getScrollContainer() {
        return this._scrollView.$element()[0]
    }
    getScrollBarWidth() {
        return 0
    }
    detachEvents() {}
    _raiseOnScroll(left, top) {
        var {
            Point: Point
        } = getDiagram();
        this.onScroll.raise("notifyScrollChanged", () => new Point(left, top))
    }
    _raiseOnScrollWithoutPoint() {
        var {
            Point: Point
        } = getDiagram();
        this.onScroll.raise("notifyScrollChanged", () => new Point(this._scrollView.scrollLeft(), this._scrollView.scrollTop()))
    }
    _createOnCreateDiagramAction() {
        this._onCreateDiagramAction = this._createActionByOption("onCreateDiagram")
    }
    _optionChanged(args) {
        switch (args.name) {
            case "onCreateDiagram":
                this._createOnCreateDiagramAction();
                break;
            default:
                super._optionChanged(args)
        }
    }
}
export default DiagramScrollView;
