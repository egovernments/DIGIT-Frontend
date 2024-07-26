export const transformCreateEstimateData = (data)=>{
  return {
    Mdms: {
      tenantId: "mz",
      schemaCode: "digitAssignment.estimate",
      uniqueIdentifier: null,
      data: {
        proposalDate: data.proposalDate,
        status: data.status,
        wfStatus: data.wfStatus,
        name: data.name,
        description: data.description,
        executingDepartment: data.executingDepartment,
        address: {
          "tenantId": "od.testing",
          "latitude": data.latitude,
          "longitude": data.longitude,
          "city": data.city || "od.testing"
        },
        estimateDetails: data.estimateDetails.map((detail) => ({
          sorId: detail.sorId || "SOR_000364",
          category: detail.category || "SOR",
          name: detail.name || "Honey Comb brick masonry using 25cm x 12cm x 8cm KB brick having crushing strength not less than 75 Kg / cm2 in cement mortar (1:4) and plastered with 16mm thick CM(1:6) including white washing two coats etc. complete.",
          description: detail.description || "asd",
          unitRate: detail.unitRate,
          noOfUnit: detail.noOfUnit,
          uom: detail.uom,
          length: detail.length,
          width: detail.width,
          amountDetail: [
            {
              type: "EstimatedAmount",
              amount: data.unitRate * data.noOfUnit || 0,
              isActive: true,
            },
          ],
          isActive: detail.isActive || true,
        })),
      },
      isActive: true,
    },
    "RequestInfo": {
      "apiId": "asset-services",
      "ver": null,
      "ts": null,
      "action": null,
      "did": null,
      "key": null,
      "msgId": "search with from and to values",
      "authToken": "68d5e60e-abad-4d7e-aacb-f6d8f9237a20",
      "correlationId": null,
      "userInfo": {
        "id": "1",
        "userName": null,
        "name": null,
        "type": null,
        "mobileNumber": null,
        "emailId": null,
        "roles": null,
        "uuid": "db842ca9-25c5-4419-a72f-459443d38feb"
      }
    }
  }
}