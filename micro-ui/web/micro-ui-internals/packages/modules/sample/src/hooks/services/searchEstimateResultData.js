export const searchEstimateResultData = async ({ t, estimateIdentifier, tenantId }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/mdms-v2/v2/_search",
    body: {
      MdmsCriteria: {
        tenantId: "mz",
        filters: {
          name: estimateIdentifier,
        },
      },
      //   apiOperation: "SEARCH",
      //   auth: "dfcca143-b5a6-4726-b5cd-c2c949cb0f2b",
    },
    method: "SEARCH",
  });

  //   debugger;
  console.log("response", response);
  return {
    details: [
      //   {
      //     sections: [
      //       {
      //         type: "DATA",
      //         values: [
      {
        key: "Name",
        value: response?.mdms[0]?.data?.name || "NA",
      },
      {
        key: "Status",
        value: response?.mdms[0]?.data?.status || "NA",
      },
      {
        key: "Workflow Status",
        value: response?.mdms[0]?.data?.wfStatus || "NA",
      },
      {
        key: "City",
        value: response?.mdms[0]?.data?.address?.city || "NA",
      },
      {
        key: "Description",
        value: response?.mdms[0]?.data?.description || "NA",
      },
      {
        key: "Estimate Name",
        value: response?.mdms[0]?.data?.estimateDetails[0]?.name || "NA",
      },
      {
        key: "Number of Unit",
        value: response?.mdms[0]?.data?.estimateDetails[0]?.noOfunit || "NA",
      },
      {
        key: "Unit rate",
        value: response?.mdms[0]?.data?.estimateDetails[0]?.unitRate || "NA",
      },
    ],
  };
  //         ],
  //       },
  //     ],
  //   };
};
