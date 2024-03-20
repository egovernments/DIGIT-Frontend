import { useQuery } from "react-query";
import { WorksService } from "../../services/elements/Works";
import { UserService } from "../../services/elements/User";
 
const useSearchApprovedEstimates = ({ tenantId, filters, config = {} }) =>
    useQuery(["WORKS_ESTIMATE_SEARCH", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e])],
        async () => await WorksService.approvedEstimateSearch({ tenantId, filters: { ...filters, estimateStatus: "APPROVED" } }),
        {
            ...config,
            select: (data) => {
                const subEstimates = []
                
                data?.estimates?.map(estimate=>{
                    
                    const subEstimatesOfThisEstimate = estimate?.estimateDetails
                    //cannot delete this here because when you come to the previous page it'll cause issues
                    //delete estimate.estimateDetails
                    const resultant = subEstimatesOfThisEstimate?.map(subEst=>{
                        return {...subEst,...estimate}
                    })
                    subEstimates.push(...resultant)
                })
                return subEstimates
            }
        })

export default useSearchApprovedEstimates; 