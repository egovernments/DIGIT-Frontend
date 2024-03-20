import useInbox from "../useInbox";


const useKickoffInbox = ({ tenantId, _filters, config }) => {
    const { estimateNumber,
        department,
        typeOfWork,
        fund,
        budgetHead,
        fromProposalDate,
        toProposalDate,
        sortOrder,
        limit,
        offset,
        ...rest } = _filters

    const filters = {
        tenantId,
        processSearchCriteria: {
            tenantId,
            businessService: [
                "estimate-approval"
            ],
            moduleName: "estimate-service",
        },
        moduleSearchCriteria: {
            department,
            typeOfWork,
            fund,
            function: rest.function,
            budgetHead,
            estimateId: estimateNumber,
            fromProposalDate,
            toProposalDate,
            sortOrder
        },
        limit,
        offset
    }
    return useInbox({ tenantId, filters, config:{
        select: (data) => {
            const returnedObj = {
                statuses: data.statusMap,
                table: data?.items.map(application => {
                    const obj = {
                        workOrderId:"1136/TO/DB/FLOOD/10-11",
                        woIssuedDate:"08/09/2010",
                        woAcceptedDate:"08/09/2010",
                        nameOfWork:"Providing CC Drain in Birla Gaddah(akshaynagar colony) in 27th ward",
                        agencyName:"S.K. Om Birla",
                        status:"complete"
                        //sending dummy data(here for now I'm calling estimates inbox just to test the inbox table, for every item in estimate inbox respnse I'm showing the same dummy data)
                    }

                    return obj;
                }),
                totalCount: data.totalCount,
                nearingSlaCount: data?.nearingSlaCount
            }
            return returnedObj
        },
        ...config
    }
 })
}

export default useKickoffInbox;