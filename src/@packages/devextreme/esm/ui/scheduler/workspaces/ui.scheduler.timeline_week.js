/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.timeline_week.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import SchedulerTimeline from "./ui.scheduler.timeline";
import {
    getBoundingRect
} from "../../../core/utils/position";
import {
    getIntervalDuration
} from "./utils/week";
var TIMELINE_CLASS = "dx-scheduler-timeline-week";
export default class SchedulerTimelineWeek extends SchedulerTimeline {
    _getElementClass() {
        return TIMELINE_CLASS
    }
    _getCellCount() {
        return super._getCellCount() * this._getWeekDuration()
    }
    _getHeaderPanelCellWidth($headerRow) {
        return getBoundingRect($headerRow.children().first().get(0)).width
    }
    _getWeekDuration() {
        return 7
    }
    _needRenderWeekHeader() {
        return true
    }
    _incrementDate(date) {
        date.setDate(date.getDate() + 1)
    }
    _getIntervalDuration() {
        return getIntervalDuration(this.option("intervalCount"))
    }
}
registerComponent("dxSchedulerTimelineWeek", SchedulerTimelineWeek);
