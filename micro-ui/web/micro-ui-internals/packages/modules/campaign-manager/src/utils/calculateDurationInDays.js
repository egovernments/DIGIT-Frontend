/**
 * Calculates the number of days between two epoch timestamps.
 * @param {number} startEpoch - The start date in epoch milliseconds.
 * @param {number} endEpoch - The end date in epoch milliseconds.
 * @returns {number|string} Duration in days as a number, or "Invalid range" for edge cases.
 */
export const calculateDurationInDays = (startEpoch, endEpoch) => {
  if (!startEpoch || !endEpoch) return "NA";

  const start = new Date(startEpoch);
  const end = new Date(endEpoch);

  const diffTime = end - start;

  if (diffTime < 0) return "Invalid range";

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
