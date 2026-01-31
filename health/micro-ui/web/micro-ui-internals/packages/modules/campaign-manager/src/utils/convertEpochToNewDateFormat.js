export const convertEpochToNewDateFormat = (value) => {
  if (!value) return "";

  let date;

  // If it's a number or numeric string, treat it as epoch
  if (!isNaN(value)) {
    date = new Date(Number(value));
  } else {
    // Otherwise, try to parse it as a standard date string (e.g., "2025-06-28")
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return ""; // Invalid date check

  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options); // "dd MMMM yyyy"
};
