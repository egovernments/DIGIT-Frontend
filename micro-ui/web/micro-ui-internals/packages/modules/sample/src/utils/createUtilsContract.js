// createUtilsContract.js

export const transformCreateContract = (data) => {
    return {
        Mdms: {
          tenantId: "mz",
          schemaCode: "digitAssignment.estimate",
          uniqueIdentifier: null,
        //   data: {
        //     proposalDate: data.proposalDate,
        //     status: data.status,
        //     wfStatus: data.wfStatus,
        //     name: data.name,
        //     description: data.description,
        //     executingDepartment: data.executingDepartment,
        //     address: data.address[0],
        //     // address: JSON.parse(data.address),
        //     estimateDetails: [data.estimateDetails],
        //   },
        //   isActive: data.isActive,
          data: {
            name: data.Name,
            executingAuthority: data.executingAuthority,
            contractType: data.contractType,
            totalContractedAmount: data.totalContractedAmount,
            completionPeriod: data.completionPeriod,
            lineItems: data.NewDetails,
            documents: data.documents,
            //additionalDetails: data.additionalDetails,
            additionalDetails: {
                officerInChargeName: {
                  code: data.additionalDetails[0].officerInChargeName.code,
                  name: data.additionalDetails[0].officerInChargeName.name,
                },
                officerInChargeDesgn: data.additionalDetails[0].officerInChargeDesgn,
                totalEstimatedAmount: data.additionalDetails[0].totalEstimatedAmount,
              },
          },
          isActive: true,
        

        },
        RequestInfo: {
          apiId: "asset-services",
          ver: null,
          ts: null,
          action: null,
          did: null,
          key: null,
          msgId: "search with from and to values",
          authToken: "68d5e60e-abad-4d7e-aacb-f6d8f9237a20",
          correlationId: null,
          userInfo: {
            id: "1",
            userName: null,
            name: null,
            type: null,
            mobileNumber: null,
            emailId: null,
            roles: null,
            uuid: "db842ca9-25c5-4419-a72f-459443d38feb",
          },
        },
      };
  };
  