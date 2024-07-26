// /* Inbox Search Composer*/

// export const transformEstimateData = (data) => {
//   return {
//     Mdms: {
//       tenantId: "mz",
//       schemaCode: "digitAssignment.estimate",
//       uniqueIdentifier: null,
//       data: {
//         proposalDate: 21,
//         status: data.status.name,
//         wfStatus: data.wfStatus.name,
//         name: data.name,
//         description: data.description,
//         executingDepartment: data.executingDepartment.name,
//         address: data.address[0],
//         estimateDetails: data.estimateDetails,
//         // estimateDetails: null,
//       },
//       isActive: true,
//     },
//     RequestInfo: {
//       apiId: "asset-services",
//       ver: null,
//       ts: null,
//       action: null,
//       did: null,
//       key: null,
//       msgId: "search with from and to values",
//       authToken: "68d5e60e-abad-4d7e-aacb-f6d8f9237a20",
//       correlationId: null,
//       userInfo: {
//         id: "1",
//         userName: null,
//         name: null,
//         type: null,
//         mobileNumber: null,
//         emailId: null,
//         roles: null,
//         uuid: "db842ca9-25c5-4419-a72f-459443d38feb",
//       },
//     },
//   };
// };

/* Inbox Search Composer*/

export const transformEstimateData = (data) => {
  return {
    Mdms: {
      tenantId: "mz",
      schemaCode: "digitAssignment.estimate",
      uniqueIdentifier: null,
      data: {
        proposalDate: 1721215066793,
        status: "INWORKFLOW",
        wfStatus: "PENDINGFORVERIFICATION",
        name: "tsk3",
        description: "testing",
        executingDepartment: "WRK",
        address: {
          tenantId: "od.testing",
          latitude: 20.5,
          longitude: 35.2,
          city: "od.testing",
        },
        estimateDetails: [
          {
            sorId: "SOR_000364",
            category: "SOR",
            name:
              "Honey Comb brick masonry using 25cm x 12cm x 8cm KB brick having crushing strength not less than 75 Kg / cm2 in cement mortar (1:4) and plastered with 16mm thick CM(1:6) including white washing two coats etc. complete.",
            description: "asd",
            unitRate: 1113.86,
            noOfunit: 100,
            uom: "SQM",
            length: 10,
            width: 10,
            amountDetail: [
              {
                type: "EstimatedAmount",
                amount: 111386,
                isActive: true,
              },
            ],
            isActive: true,
          },
        ],
        // estimateDetails: null,
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
