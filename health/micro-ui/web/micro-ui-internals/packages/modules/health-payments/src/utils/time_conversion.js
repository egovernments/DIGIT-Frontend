import { getPeriodAggregateObject } from "../services/payment_setup/aggregateService";

/**
 * Convert an epoch to a Date object using the local timezone
 * Works both in browser and Node.js (AWS, etc.)
 */
const toLocalDate = (epoch) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Force the epoch to interpret in the detected local timezone
  return new Date(new Date(epoch).toLocaleString("en-US", { timeZone }));
};

/**
 * Helper: Create a new Date using local time (no UTC shift)
 */
const setLocalTime = (baseDate, hours, minutes, seconds = 0) => {
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes, seconds, 0);
};

/**
 * enrolmentTimeWithSession
 * Always works with the current local timezone
 */
export const enrolmentTimeWithSession = (sessionType, enrolmentEpoch) => {
  // Convert epoch to local date respecting timezone
  const enrolmentTime = toLocalDate(enrolmentEpoch);

  const start9AM = setLocalTime(enrolmentTime, 9, 0);
  const noon = setLocalTime(enrolmentTime, 12, 0);
  const nextDay = new Date(enrolmentTime);
  nextDay.setDate(nextDay.getDate() + 1);

  let effectiveDate;

  if (sessionType === 0) {
    // Single session: 9AM - 6PM
    if (enrolmentTime < start9AM) {
      // before 9AM → 12:10 AM same day
      effectiveDate = setLocalTime(enrolmentTime, 0, 10, 10);
    } else {
      // after 9AM → 12:10 AM next day
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  } else if (sessionType === 2) {
    // Multi session: 9AM–12PM, 12:01PM–6PM
    if (enrolmentTime < noon) {
      if (enrolmentTime < start9AM) {
        effectiveDate = setLocalTime(enrolmentTime, 0, 10, 10);
      } else {
        effectiveDate = setLocalTime(enrolmentTime, 11, 55, 0);
      }
    } else {
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  }

  return effectiveDate.getTime();
};

/**
 * disableTimeWithSession
 * Always works with the current local timezone
 */
export const disableTimeWithSession = (sessionType, disableEpoch) => {
  const disableTime = toLocalDate(disableEpoch);

  const start9AM = setLocalTime(disableTime, 9, 0);
  const noon = setLocalTime(disableTime, 12, 0);
  const nextDay = new Date(disableTime);
  nextDay.setDate(nextDay.getDate() + 1);

  let effectiveDate;

  if (sessionType === 0) {
    if (disableTime < start9AM) {
      effectiveDate = setLocalTime(disableTime, 0, 10, 10);
    } else {
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  } else if (sessionType === 2) {
    if (disableTime < noon) {
      if (disableTime < start9AM) {
        effectiveDate = setLocalTime(disableTime, 0, 10, 10);
      } else {
        effectiveDate = setLocalTime(disableTime, 11, 55, 0);
      }
    } else {
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  }

  return effectiveDate.getTime();
};

export const findAllOverlappingPeriods = (startDate, endDate) => {
  const periods = Digit.SessionStorage.get("projectPeriods");

  if (!Array.isArray(periods) || !startDate || !endDate) return [];

  const rdata = periods.filter((period) => {
    const periodStart = period.periodStartDate;
    const periodEnd = period.periodEndDate;

    // Overlap logic: true if ranges intersect at all
    return !(endDate < periodStart || startDate > periodEnd);
  });

  return rdata;
};

export const getValidPeriods = (t, periods, addingBool) => {
  if (!Array.isArray(periods) || periods.length === 0) return [];

  const now = Date.now();

  // Remove future periods (we don't want to show them)
  const validPeriods = periods.filter((p) => p.periodStartDate <= now);

  if (validPeriods.length === 0) return [];

  // Sort ascending
  validPeriods.sort((a, b) => a.periodStartDate - b.periodStartDate);

  // Find current period
  const current = validPeriods.find((p) => now >= p.periodStartDate && now <= p.periodEndDate);

  // -----------------------------------------------------
  // CASE 1: If we are INSIDE any period → show only previous + current
  // -----------------------------------------------------

  if (current) {
    const currentIndex = validPeriods.findIndex((p) => p.id === current.id);

    // Return ALL periods from start → current (inclusive)
    const result = validPeriods.slice(0, currentIndex + 1);

    return result;
  }

  // -----------------------------------------------------
  // CASE 2: If NO current period → we are AFTER the last period
  //         Show ALL past periods + AGGREGATE
  // -----------------------------------------------------

  const lastPeriod = validPeriods[validPeriods.length - 1];

  // Only show AGGREGATE if current time passed last periodEndDate
  if (addingBool) {
    if (periods.length !== 1) {
      // INFO:: if the periods length is one, then do not add any aggregate options
      if (now > lastPeriod.periodEndDate) {
        const result = [...validPeriods];

        const aggregate = getPeriodAggregateObject(t, "AGGREGATE");

        // You said aggregate based on last period date
        aggregate.periodStartDate = lastPeriod.periodEndDate + 1;
        aggregate.periodEndDate = lastPeriod.periodEndDate + 1;

        result.push(aggregate);

        return result;
      }
    }
  }
  // If somehow we reach here (should not), return past periods
  return validPeriods;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const renderProjectPeriod = (t, selectedProject, period) => {
  if (!selectedProject?.name) return t(selectedProject?.name || "");
  if (!period?.periodStartDate || !period?.periodEndDate) return [t(selectedProject.name)];

  const start = formatDate(period.periodStartDate);
  const end = formatDate(period.periodEndDate);

  if (period?.id === "AGGREGATE") {
    return [`${t(selectedProject.name)}`, " "];
  }

  return [`${t(selectedProject.name)}`, start && end ? `(${start} - ${end})` : ""];
};
