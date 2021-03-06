/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.timeline_day.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import SchedulerTimeline from "./ui.scheduler.timeline";
var TIMELINE_CLASS = "dx-scheduler-timeline-day";
class SchedulerTimelineDay extends SchedulerTimeline {
    _getElementClass() {
        return TIMELINE_CLASS
    }
    _setFirstViewDate() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate)
    }
    _needRenderWeekHeader() {
        return this._isWorkSpaceWithCount()
    }
}
registerComponent("dxSchedulerTimelineDay", SchedulerTimelineDay);
export default SchedulerTimelineDay;
