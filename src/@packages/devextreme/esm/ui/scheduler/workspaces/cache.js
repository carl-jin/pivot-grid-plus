/**
 * DevExtreme (esm/ui/scheduler/workspaces/cache.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../../core/utils/type";
export class Cache {
    constructor() {
        this._init()
    }
    get size() {
        return this._cache.size
    }
    _init() {
        this._cache = new Map
    }
    clear() {
        this._init()
    }
    get(name, callback) {
        if (!this._cache.has(name) && callback) {
            this.set(name, callback())
        }
        return this._cache.get(name)
    }
    set(name, value) {
        isDefined(value) && this._cache.set(name, value)
    }
}
export var cache = new Cache;
