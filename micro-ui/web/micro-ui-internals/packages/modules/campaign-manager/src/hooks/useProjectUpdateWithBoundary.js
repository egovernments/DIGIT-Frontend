import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const useProjectUpdateWithBoundary = async ({ formData }) => {
  const url = getProjectServiceUrl();
  const requests = formData.map((item) => {
    return Digit.CustomService.getResponse({
      url: `${url}/v1/_update`,
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
