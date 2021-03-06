/**
 * DevExtreme (esm/ui/html_editor/modules/base.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
import EmptyModule from "./empty";
var BaseModule = EmptyModule;
if (Quill) {
    var BaseQuillModule = Quill.import("core/module");
    BaseModule = class extends BaseQuillModule {
        constructor(quill, options) {
            super(quill, options);
            this.editorInstance = options.editorInstance
        }
        saveValueChangeEvent(event) {
            this.editorInstance._saveValueChangeEvent(event)
        }
        addCleanCallback(callback) {
            this.editorInstance.addCleanCallback(callback)
        }
    }
}
export default BaseModule;
