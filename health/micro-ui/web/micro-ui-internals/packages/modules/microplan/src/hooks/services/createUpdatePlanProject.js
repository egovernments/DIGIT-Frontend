
const requestBodyGenerator = () => {


}



const createUpdatePlanProject = async (req) => {
  try {
    const {totalFormData,state,setShowToast,setCurrentKey,setCurrentStep,config,campaignObject,planObject} = req;
    const {microplanId,campaignId} = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    
    //now basically we need to decide from which screen this hook was triggered and take action accordingly
    
    const triggeredFrom = config.name;
    debugger
    switch (triggeredFrom) {
      case "CAMPAIGN_DETAILS":
        setCurrentKey(prev=>prev+1);
        setCurrentStep(prev=>prev+1);
        return {
          triggeredFrom
        };
      
      case "MICROPLAN_DETAILS":
        // validate campaign and microplan name feasible or not -> search campaign + search plan
        // check whether camapaignObject / planobject are defined -> call update otherwise call create and update urlParams
        //here just check if microplanId and campaignId is already there then don't do anything (details will be freezed so only create will be required no update) 
      
      default:
        setShowToast({ key: "error", label: "ERROR_UNHANDLED_NEXT_OPERATION" })
        return {
          triggeredFrom
        }
    }
    debugger


    //req will have{totalFormData,contextData,config,...additionalData}
    //config will have information about from which part of the UI this API call was triggered and what all to update/create(based on key we can decide)
    // we'll have a function that translates totalFormData to plan object
    // we'll have a function that translates totalFormData to campaign object
    // this hook only should decide what all to create/invalidate/update
    // here only we should generate req bodies
    // validate campaign name
    // validate microplan name
    // create/update draft campaign
    // create/update draft microplan

    
  
  
  
  
  
    //if trigger from "MICROPLAN_DETAILS" -> update/create 
  
    return {
      toastObject : { key: "error", label: "ERROR_BOUNDARY_SELECTION" }
    }
    // try {
    //   const response = await Digit.CustomService.getResponse({
    //     url: "/project-factory/v1/project-type/create",
    //     body: {
    //       CampaignDetails: req,
    //     },
    //   });
    //   return response;
    // } catch (error) {
    //   if (!error?.response?.data?.Errors[0].description) {
    //     throw new Error(error?.response?.data?.Errors[0].code);
    //   } else {
    //     throw new Error(error?.response?.data?.Errors[0].description);
    //   }
    // }
  } catch (error) {
      debugger
      console.error(error)
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error(error);
  }
 
};

export default createUpdatePlanProject;
