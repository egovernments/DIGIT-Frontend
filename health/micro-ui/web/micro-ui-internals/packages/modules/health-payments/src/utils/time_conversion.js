/**
 * Helper: Create a new Date using local time (no UTC shift)
 */
const setLocalTime = (baseDate, hours, minutes) => {
    return new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hours,
        minutes,
        0,
        0
    );
};

/**
 * enrolmentTimeWithSession
 * 
 * @param {"single" | "multi"} sessionType - Type of session
 * @param {number} enrolmentEpoch - Enrolment time in epoch milliseconds
 * @returns {number} Epoch (ms) representing effective enrolment time
 */
export const enrolmentTimeWithSession = (sessionType, enrolmentEpoch) => {
    // Convert epoch → Date (local)
    const enrolmentTime = new Date(enrolmentEpoch);

    const start9AM = setLocalTime(enrolmentTime, 9, 0);
    const noon = setLocalTime(enrolmentTime, 12, 0);
    const nextDay = new Date(enrolmentTime);
    nextDay.setDate(nextDay.getDate() + 1);

    if (sessionType === 0) {
        // Single session: 9AM - 6PM
        if (enrolmentTime < start9AM) {
            // before 9AM → 12:10 AM same day
            return setLocalTime(enrolmentTime, 0, 10).getTime();
        } else {
            // after 9AM → 12:10 AM next day
            return setLocalTime(nextDay, 0, 10).getTime();
        }
    }

    if (sessionType === 2) {
        // Multi session
        // Session 1: 9AM–12PM
        // Session 2: 12:01PM–6PM
        if (enrolmentTime < noon) {
            // Session 1
            if (enrolmentTime < start9AM) {
                // before 9AM → 12:10 AM same day
                return setLocalTime(enrolmentTime, 0, 10).getTime();
            } else {
                // after 9AM → 11:55 AM same day
                return setLocalTime(enrolmentTime, 11, 55).getTime();
            }
        } else {
            // Session 2
            // before 12PM → 11:55 AM same day
            // after 12PM → 12:10 AM next day
            if (enrolmentTime < noon) {
                return setLocalTime(enrolmentTime, 11, 55).getTime();
            } else {
                return setLocalTime(nextDay, 0, 10).getTime();
            }
        }
    }

    return null;
};



export const disableTimeWithSession = (sessionType, disableEpoch) => {
    const disableTime = new Date(disableEpoch); // local date from epoch

    const start9AM = setLocalTime(disableTime, 9, 0);
    const noon = setLocalTime(disableTime, 12, 0);
    const nextDay = new Date(disableTime);
    nextDay.setDate(nextDay.getDate() + 1);

    if (sessionType === 0) {
        // Single session: 9AM–6PM
        if (disableTime < start9AM) {
            // Before 9AM → 12:10 AM same day
            return setLocalTime(disableTime, 0, 10).getTime();
        } else {
            // After 9AM → 12:10 AM next day
            return setLocalTime(nextDay, 0, 10).getTime();
        }
    }

    if (sessionType === 2) {
        // Multi-session
        if (disableTime < noon) {
            // Session 1
            if (disableTime < start9AM) {
                // Before 9AM → 12:10 AM same day
                return setLocalTime(disableTime, 0, 10).getTime();
            } else {
                // After 9AM → 11:55 AM same day
                return setLocalTime(disableTime, 11, 55).getTime();
            }
        } else {
            // Session 2
            if (disableTime < noon) {
                // before 12 (edge)
                return setLocalTime(disableTime, 11, 55).getTime();
            } else {
                // After 12PM → 12:10 AM next day
                return setLocalTime(nextDay, 0, 10).getTime();
            }
        }
    }

    return null;
};

