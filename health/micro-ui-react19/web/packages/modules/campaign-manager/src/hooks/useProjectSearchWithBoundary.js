import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const useProjectSearchWithBoundary = async ({ name, tenantId, boundaries, referenceID }) => {
  const requests = boundaries.map(({ code }) => {
    const url = getProjectServiceUrl();
    return Digit.CustomService.getResponse({
      url: `${url}/v1/_search`,
      params: {
        tenantId: tenantId,
        limit: 10,
        offset: 0,
      },
      body: {
        Projects: [
          {
            name: name,
            tenantId: tenantId,
            referenceID: referenceID,
            address: {
              boundary: code,
            },
          },
        ],
      },
    }).then((res) => {
      return res?.Project?.[0];
    });
  });
  const newData = await Promise.all(requests);
  return newData;
};

export default useProjectSearchWithBoundary;
