const useProjectUpdateWithBoundary = async ({ formData }) => {
  const requests = formData.map((item) => {
    return Digit.CustomService.getResponse({
      url: "/health-project/v1/_update", // todo should be picked up from globalconfig
      body: {
        Projects: [item],
        isCascadingProjectDateUpdate: true,
      },
    }).then((res) => {
      return res;
    });
  });
  const newData = await Promise.all(requests);
  return newData;
};

export default useProjectUpdateWithBoundary;
