export const transformCreateEstimateData = (data)=>{
   const tenantId  = Digit.ULBService.getCurrentTenantId();
   const proposalDate = new Date(data.proposalDate).getTime()

      return {
         Mdms:{
               tenantId:tenantId,
                schemaCode: "digitAssignment.estimate",
                uniqueIdentifier: null,
                data:{
                proposalDate:proposalDate,
                status:data.status,
                wfStatus:data.wfStatus,
                name:data.name,
                description:data.description,
                executingDepartment:data.executingDepartment.code,
                address:{
                    "tenantId":tenantId,
                    "latitude": parseFloat(data.latitude),
                    "longitude": parseFloat(data.longitude),
                    "city": data.city || "od.testing"
                },
                estimateDetails:(data.estimateDetails || []).map((detail)=> ({
                    sorId:detail.sorId || "NA",
                    category:detail.category.code || "NA",
                    name:detail.name || "NA",
                    description:detail.description || "NA",
                    unitRate:parseFloat(detail.unitRate) || 0,
                    noOfUnits:parseInt(detail.noOfUnits) || 0,
                    uom:detail.uom || "NA",
                    length:parseFloat(detail.length),
                    width:parseFloat(detail.width),
                    amountDetail:[
                        {
                            type: "EstimatedAmount",
                            amount: (parseFloat(detail.unitRate) * parseInt(detail.noOfUnits)) || 0,
                            isActive: true
                        }
                    ],
                    isActive:detail.isActive || true,
                    })),

                },
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




