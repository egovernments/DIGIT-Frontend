
export const cycleDataRemap=(data)=> {
    if (!data) return null;
    const uniqueCycleObjects = Object.values(
      data?.reduce((acc, obj) => {
        acc[obj?.cycleNumber] = acc[obj?.cycleNumber] || obj;
        return acc;
      }, {})
    );
    return uniqueCycleObjects.map((i, n) => {
      return {
        key: i.cycleNumber,
        fromDate: i?.startDate ? Digit.DateUtils.ConvertEpochToDate(i?.startDate)?.split("/")?.reverse()?.join("-") : null,
        toDate: i?.endDate ? Digit.DateUtils.ConvertEpochToDate(i?.endDate)?.split("/")?.reverse()?.join("-") : null,
      };
    });
  }
  