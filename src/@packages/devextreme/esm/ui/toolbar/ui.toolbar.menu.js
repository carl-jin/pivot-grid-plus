/**
 * DevExtreme (esm/ui/toolbar/ui.toolbar.menu.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import registerComponent from "../../core/component_registrator";
import {
    each
} from "../../core/utils/iterator";
import {
    ListBase
} from "../list/ui.list.base";
var TOOLBAR_MENU_ACTION_CLASS = "dx-toolbar-menu-action";
var TOOLBAR_HIDDEN_BUTTON_CLASS = "dx-toolbar-hidden-button";
var TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS = "dx-toolbar-hidden-button-group";
var TOOLBAR_MENU_SECTION_CLASS = "dx-toolbar-menu-section";
var TOOLBAR_MENU_LAST_SECTION_CLASS = "dx-toolbar-menu-last-section";
var ToolbarMenu = ListBase.inherit({
    _activeStateUnit: "." + TOOLBAR_MENU_ACTION_CLASS,
    _initMarkup: function() {
        this._renderSections();
        this.callBase()
    },
    _getSections: function() {
        return this._itemContainer().children()
    },
    _itemElements: function() {
        return this._getSections().children(this._itemSelector())
    },
    _renderSections: function() {
        var that = this;
        var $container = this._itemContainer();
        each(["before", "center", "after", "menu"], (function() {
            var sectionName = "_$" + this + "Section";
            var $section = that[sectionName];
            if (!$section) {
                that[sectionName] = $section = $("<div>").addClass(TOOLBAR_MENU_SECTION_CLASS)
            }
            $section.appendTo($container)
        }))
    },
    _renderItems: function() {
        this.callBase.apply(this, arguments);
        this._updateSections()
    },
    _updateSections: function() {
        var $sections = this.$element().find("." + TOOLBAR_MENU_SECTION_CLASS);
        $sections.removeClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
        $sections.not(":empty").eq(-1).addClass(TOOLBAR_MENU_LAST_SECTION_CLASS)
    },
    _renderItem: function(index, item, itemContainer, $after) {
        var location = item.location || "menu";
        var $container = this["_$" + location + "Section"];
        var itemElement = this.callBase(index, item, $container, $after);
        if (this._getItemTemplateName({
                itemData: item
            })) {
            itemElement.addClass("dx-toolbar-menu-custom")
        }
        if ("menu" === location || "dxButton" === item.widget || "dxButtonGroup" === item.widget || item.isAction) {
            itemElement.addClass(TOOLBAR_MENU_ACTION_CLASS)
        }
        if ("dxButton" === item.widget) {
            itemElement.addClass(TOOLBAR_HIDDEN_BUTTON_CLASS)
        }
        if ("dxButtonGroup" === item.widget) {
            itemElement.addClass(TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS)
        }
        itemElement.addClass(item.cssClass);
        return itemElement
    },
    _getItemTemplateName: function(args) {
        var template = this.callBase(args);
        var data = args.itemData;
        var menuTemplate = data && data.menuItemTemplate;
        return menuTemplate || template
    },
    _itemClickHandler: function(e, args, config) {
        if ($(e.target).closest("." + TOOLBAR_MENU_ACTION_CLASS).length) {
            this.callBase(e, args, config)
        }
    },
    _clean: function() {
        this._getSections().empty();
        this.callBase()
    }
});
registerComponent("dxToolbarMenu", ToolbarMenu);
export default ToolbarMenu;
