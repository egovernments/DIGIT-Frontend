export const handleCreateValidate = (formData) => {
  const key = Object.keys(formData)?.[0];

  if (formData?.CycleSelection === null) {
    return { label: "HCM_CYCLE_SELECTION_MISSING" };
  }
  if (key === "DateSelection") {
    const { startDate, endDate } = formData.DateSelection || {};
    if (!startDate || !endDate) {
      return { label: "HCM_CAMPAIGN_DATE_MISSING" };
    }
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (end === start) {
      return { label: "HCM_CAMPAIGN_END_DATE_EQUAL_START_DATE" };
    }
    if (end < start) {
      return { label: "HCM_CAMPAIGN_END_DATE_BEFORE_START_DATE" };
    }
    return true;
  }
  return true;
};
