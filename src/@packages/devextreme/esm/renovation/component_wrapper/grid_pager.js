/**
 * DevExtreme (esm/renovation/component_wrapper/grid_pager.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Component from "./component";
export class GridPagerWrapper extends Component {
    _optionChanged(args) {
        switch (args.name) {
            case "pageIndex":
                var pageIndexChanged = this.option("pageIndexChanged");
                if (pageIndexChanged) {
                    pageIndexChanged(args.value)
                }
                break;
            case "pageSize":
                var pageSizeChanged = this.option("pageSizeChanged");
                if (pageSizeChanged) {
                    pageSizeChanged(args.value)
                }
        }
        super._optionChanged(args)
    }
}
