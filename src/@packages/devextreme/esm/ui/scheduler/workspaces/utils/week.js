/**
 * DevExtreme (esm/ui/scheduler/workspaces/utils/week.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import dateUtils from "../../../../core/utils/date";
export var getIntervalDuration = intervalCount => 7 * dateUtils.dateToMilliseconds("day") * intervalCount;
