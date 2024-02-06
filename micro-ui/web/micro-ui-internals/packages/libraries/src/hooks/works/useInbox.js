import useInbox from "../useInbox";


const useWorksInbox = ({ tenantId, _filters, config }) => {
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
    return useInbox({
        tenantId, filters, config: {
            select: (data) => {
                const returnedObj= {
                    statuses: data.statusMap,
                    table: data?.items.map(application => {
                        const obj= {
                        estimateNumber: application?.ProcessInstance?.businessId,
                        department: application?.businessObject?.additionalDetails?.formData?.department?.code,
                        fund: application?.businessObject?.additionalDetails?.formData?.fund?.code,
                        function: application?.businessObject?.additionalDetails?.formData?.function?.code,
                        budgetHead: application?.businessObject?.additionalDetails?.formData?.budgetHead?.code,
                        createdBy: application?.businessObject?.additionalDetails?.createdBy,
                        status: application?.ProcessInstance?.state?.applicationStatus,
                        owner: application?.businessObject?.additionalDetails?.owner,
                        totalAmount:999,
                        //total amount is static for now(not getting response from inbox api so all the fields are currently showing from user input form only)
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

export default useWorksInbox;