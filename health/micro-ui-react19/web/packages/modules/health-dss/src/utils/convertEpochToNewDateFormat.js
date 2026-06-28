export const convertEpochToNewDateFormat = (value) => {
  if (!value) return "";

  let date;

  if (!isNaN(value)) {
    date = new Date(Number(value));
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return "";

  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};
