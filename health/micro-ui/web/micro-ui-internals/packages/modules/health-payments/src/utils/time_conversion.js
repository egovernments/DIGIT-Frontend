/**
 * Convert an epoch to a Date object using the local timezone
 * Works both in browser and Node.js (AWS, etc.)
 */
const toLocalDate = (epoch) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Force the epoch to interpret in the detected local timezone
  return new Date(
    new Date(epoch).toLocaleString("en-US", { timeZone })
  );
};

/**
 * Helper: Create a new Date using local time (no UTC shift)
 */
const setLocalTime = (baseDate, hours, minutes, seconds = 0) => {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    seconds,
    0
  );
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
