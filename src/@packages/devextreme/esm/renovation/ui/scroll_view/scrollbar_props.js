/**
 * DevExtreme (esm/renovation/ui/scroll_view/scrollbar_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import noop from "../../utils/noop";
import {
    TopPocketState
} from "./common/consts";
export var ScrollbarProps = {
    activeStateEnabled: false,
    containerSize: 0,
    contentSize: 0,
    topPocketSize: 0,
    bottomPocketSize: 0,
    scrollableOffset: 0,
    isScrollableHovered: false,
    forceVisibility: false,
    forceUpdateScrollbarLocation: false,
    scrollLocation: 0,
    onAnimatorCancel: noop,
    onPullDown: noop,
    onReachBottom: noop,
    onRelease: noop,
    defaultPocketState: TopPocketState.STATE_RELEASED
};
