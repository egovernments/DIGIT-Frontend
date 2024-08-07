/**
 * Format a date.
 *
 * Formats a JavaScript Date object into a human-readable string.
 *
 * @param {Date} date - The date to format.
 * @param {string} format - The format string (e.g., 'MM/DD/YYYY').
 * @returns {string} - The formatted date string.
 *
 * @example
 * const formattedDate = formatDate(new Date(), 'MM/DD/YYYY');
 */
const formatDate = (date, format) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const DateUtils = { formatDate };
export default DateUtils;
