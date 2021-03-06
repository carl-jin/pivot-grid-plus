/**
 * DevExtreme (esm/ui/diagram/diagram.bar.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getDiagram
} from "./diagram.importer";
class DiagramBar {
    constructor(owner) {
        var {
            EventDispatcher: EventDispatcher
        } = getDiagram();
        this.onChanged = new EventDispatcher;
        this._owner = owner
    }
    raiseBarCommandExecuted(key, parameter) {
        this.onChanged.raise("notifyBarCommandExecuted", parseInt(key), parameter)
    }
    getCommandKeys() {
        throw "Not Implemented"
    }
    setItemValue(key, value) {}
    setItemEnabled(key, enabled) {}
    setItemVisible(key, enabled) {}
    setEnabled(enabled) {}
    setItemSubItems(key, items) {}
    isVisible() {
        return true
    }
    _getKeys(items) {
        var keys = items.reduce((commands, item) => {
            if (void 0 !== item.command) {
                commands.push(item.command)
            }
            if (item.items) {
                commands = commands.concat(this._getKeys(item.items))
            }
            return commands
        }, []);
        return keys
    }
}
export default DiagramBar;
