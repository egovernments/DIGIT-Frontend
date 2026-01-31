export const defaultSelect = (data) => {
  if (data?.responseData) {
    if (data?.responseData?.data) {
      data.responseData.data = data?.responseData?.data?.filter((col) => col) || [];
      data.responseData.data?.forEach((row) => {
        if (row?.plots) {
          row.plots = row?.plots.filter((col) => col) || [];
        }
      });
    }
  }
  return data;
};
