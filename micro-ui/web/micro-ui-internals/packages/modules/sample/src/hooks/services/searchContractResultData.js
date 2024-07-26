export const searchContractResultData = async ({ t, contractIdentifier, tenantId }) => {
    const response = await Digit.CustomService.getResponse({
      url: "/mdms-v2/v2/_search",
      body: {
        apiOperation: "SEARCH",
        MdmsCriteria: {
          tenantId: "mz",
          filters: {
            name: contractIdentifier,
          },
        },
        //   auth: "dfcca143-b5a6-4726-b5cd-c2c949cb0f2b",
      },
    });
    //debugger;
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
          value: response?.mdms?.[0]?.data?.name || "NA",
        },
        {
            key: "Contract Type",
            value: response?.mdms?.[0]?.data?.contractType || "NA",
        },
        {
            key: "EstimateId",
            value: response?.mdms?.[0]?.data?.lineItems?.[0]?.estimateId || "NA",
        },

        //   {
        //     key: "Status",
        //     value: response?.Individual?.[0]?.identifiers?.[0].individualId || "NA",
        //   },
        //   {
        //     key: "Workflow Status",
        //     value: response?.Individual?.[0]?.identifiers?.[0].individualId || "NA",
        //   },
        //   {
        //     key: "City",
        //     value: response?.Individual?.[0]?.identifiers?.[0].individualId || "NA",
        //   },
        //   {
        //     key: "Status",
        //     value: response?.Individual?.[0]?.identifiers?.[0].individualId || "NA",
        //   },
        //   {
        //     key : "Adress",
        //     value : response?.Individual?.[0]
        // }
      ],
    };
    //         ],
    //       },
    //     ],
    //   };
  };