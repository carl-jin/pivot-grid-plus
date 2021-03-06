/**
 * DevExtreme (esm/ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month_line.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import HorizontalAppointmentsStrategy from "./ui.scheduler.appointments.strategy.horizontal";
import dateUtils from "../../../core/utils/date";
import query from "../../../data/query";
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var MILLISECONDS_IN_MINUTE = 6e4;
var ZERO_APPOINTMENT_DURATION_IN_DAYS = 1;
class HorizontalMonthLineRenderingStrategy extends HorizontalAppointmentsStrategy {
    calculateAppointmentWidth(appointment, position) {
        var startDate = dateUtils.trimTime(position.info.appointment.startDate);
        var endDate = this.normalizeEndDateByViewEnd(appointment, position.info.appointment.endDate);
        var cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
        var duration = Math.ceil(this._getDurationInDays(startDate, endDate));
        var width = this.cropAppointmentWidth(duration * cellWidth, cellWidth);
        if (this.instance.isVirtualScrolling()) {
            var workSpace = this.instance.getWorkSpace();
            var skippedDays = workSpace.viewDataProvider.getSkippedDaysCount(position.groupIndex, startDate, endDate, duration);
            width -= skippedDays * cellWidth
        }
        return width
    }
    _getDurationInDays(startDate, endDate) {
        var adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
        return adjustedDuration / dateUtils.dateToMilliseconds("day") || ZERO_APPOINTMENT_DURATION_IN_DAYS
    }
    getDeltaTime(args, initialSize) {
        return HOURS_IN_DAY * MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * this._getDeltaWidth(args, initialSize)
    }
    isAllDay() {
        return false
    }
    createTaskPositionMap(items, skipSorting) {
        if (!skipSorting) {
            this.instance.getAppointmentsInstance()._sortAppointmentsByStartDate(items)
        }
        return super.createTaskPositionMap(items)
    }
    _getSortedPositions(map, skipSorting) {
        var result = super._getSortedPositions(map);
        if (!skipSorting) {
            result = query(result).sortBy("top").thenBy("left").thenBy("cellPosition").thenBy("i").toArray()
        }
        return result
    }
    needCorrectAppointmentDates() {
        return false
    }
}
export default HorizontalMonthLineRenderingStrategy;
