/**
 * DevExtreme (esm/ui/html_editor/themes/base.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
var BaseTheme;
if (Quill) {
    var Theme = Quill.import("core/theme");
    BaseTheme = class extends Theme {
        constructor(quill, options) {
            super(quill, options);
            this.quill.root.classList.add("dx-htmleditor-content");
            this.quill.root.setAttribute("role", "textbox")
        }
    }
} else {
    BaseTheme = {}
}
export default BaseTheme;
