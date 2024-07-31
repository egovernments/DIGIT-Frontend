export const transformCreateContractData = (data)=>{
    return {
        Estimate: {
            tenantId: "mz",
            schemaCode: "digitAssignment.estimate",
            uniqueIdentifier: null,
            data: {
				proposalDate: 1721215066793,
				status: "INWORKFLOW",
				wfStatus: "PENDINGFORVERIFICATION",
				name: "test",
				description: "testing",
				executingDepartment: "WRK",
				address: {
						"tenantId": "od.testing",
						"latitude": 20.5,
						"longitude": 35.2,
						"city": "od.testing"
				},
				estimateDetails: [
						{
								"sorId": "SOR_000364",
								"category": "SOR",
								"name": "Honey Comb brick masonry using 25cm x 12cm x 8cm KB brick having crushing strength not less than 75 Kg / cm2 in cement mortar (1:4) and plastered with 16mm thick CM(1:6) including white washing two coats etc. complete.",
								"description": "asd",
								"unitRate": 1113.86,
								"noOfunit": 100,
								"uom": "SQM",
								"length": 10,
								"width": 10,
								"amountDetail": [
										{
												"type": "EstimatedAmount",
												"amount": 111386,
												"isActive": true
										}
								],
								"isActive": true
						}
				]
			},
          isActive: true,
          isSystemUser: null,
          userDetails: {
              "username": "8821243212",
              "tenantId": "pg.citya",
              "roles": [
                  {
                      "code": "SANITATION_WORKER",
                      "tenantId": "pg.citya"
                  }
              ],
              "type": "CITIZEN"
          },
      },
    }

}