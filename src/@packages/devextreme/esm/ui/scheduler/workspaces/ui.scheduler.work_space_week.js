/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.work_space_week.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import dateUtils from "../../../core/utils/date";
import dateLocalization from "../../../localization/date";
import SchedulerWorkSpaceVertical from "./ui.scheduler.work_space_vertical";
import {
    getIntervalDuration
} from "./utils/week";
var WEEK_CLASS = "dx-scheduler-work-space-week";
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
    _getElementClass() {
        return WEEK_CLASS
    }
    _getRowCount() {
        return this._getCellCountInDay()
    }
    _getCellCount() {
        return 7 * this.option("intervalCount")
    }
    _getDateByIndex(headerIndex) {
        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate
    }
    _getStartViewDate() {
        return dateUtils.getFirstWeekDate(this.option("startDate"), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex())
    }
    _getIntervalDuration() {
        return getIntervalDuration(this.option("intervalCount"))
    }
    getPositionShift(timeShift, isAllDay) {
        if (!isAllDay && this.invoke("isAdaptive") && 0 === this.invoke("getMaxAppointmentCountPerCellByType")) {
            return {
                top: 0,
                left: 0,
                cellPosition: 0
            }
        }
        return super.getPositionShift(timeShift, isAllDay)
    }
    _isApplyCompactAppointmentOffset() {
        if (this.invoke("isAdaptive") && 0 === this.invoke("getMaxAppointmentCountPerCellByType")) {
            return false
        }
        return super._isApplyCompactAppointmentOffset()
    }
}
registerComponent("dxSchedulerWorkSpaceWeek", SchedulerWorkSpaceWeek);
export default SchedulerWorkSpaceWeek;
