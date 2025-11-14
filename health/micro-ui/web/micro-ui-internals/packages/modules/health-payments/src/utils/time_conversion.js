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

/**
 * Returns all period objects that overlap with the given date range.
 *
 * @param {Array} periods - List of period objects with `periodStartDate` and `periodEndDate` (epoch ms)
 * @param {number} startDate - Start date in epoch milliseconds
 * @param {number} endDate - End date in epoch milliseconds
 * @returns {Array} - List of overlapping period objects
 */
// function findAllOverlappingPeriods(periods, startDate, endDate) {
//   if (!Array.isArray(periods) || !startDate || !endDate) return [];

//   return periods.filter((period) => {
//     const periodStart = period.periodStartDate;
//     const periodEnd = period.periodEndDate;

//     // Overlap logic: true if ranges intersect at all
//     return !(endDate < periodStart || startDate > periodEnd);
//   });
// }

export const findAllOverlappingPeriods = (startDate, endDate) => {
  const periods = Digit.SessionStorage.get("projectPeriods");

  if (!Array.isArray(periods) || !startDate || !endDate) return [];

  return periods.filter((period) => {
    const periodStart = period.periodStartDate;
    const periodEnd = period.periodEndDate;

    // Overlap logic: true if ranges intersect at all
    return !(endDate < periodStart || startDate > periodEnd);
  });
};

export const getValidPeriods = (periods) => {
  if (!Array.isArray(periods) || periods.length === 0) return [];

  const now = Date.now();

  // Remove future periods
  const validPeriods = periods.filter((p) => p.periodStartDate <= now);

  if (validPeriods.length === 0) return [];

  // Sort by start date (ascending)
  validPeriods.sort((a, b) => a.periodStartDate - b.periodStartDate);

  // Find current period (where now is between start and end)
  const current = validPeriods.find((p) => now >= p.periodStartDate && now <= p.periodEndDate);

  // Find previous period (the one before the current one)
  let previous = null;
  if (current) {
    const index = validPeriods.findIndex((p) => p.id === current.id);
    if (index > 0) previous = validPeriods[index - 1];
  } else {
    // If no current, take the last past period as previous
    previous = validPeriods[validPeriods.length - 1];
  }

  // Return filtered list (previous + current if exists)
  const result = [];
  if (previous) result.push(previous);
  if (current) result.push(current);

  return result;
};
