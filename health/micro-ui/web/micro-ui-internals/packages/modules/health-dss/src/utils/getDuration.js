export const getDuration = (startDate, endDate) => {
  let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
  if (noOfDays >= 90) {
    console.log("inside month")
    return "month";
  }
  if (noOfDays < 90 && noOfDays >= 14) {
    console.log("inside week")
    return "week";
  }
  if (noOfDays < 14) {
    console.log("inside day")
    return "day";
  }
};