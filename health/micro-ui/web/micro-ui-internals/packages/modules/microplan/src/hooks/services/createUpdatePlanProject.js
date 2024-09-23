
const requestBodyGenerator = () => {


}


const createUpdatePlanProject = async (state) => {
  //state will have{totalFormData,contextData,config,...additionalData}
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

  return {}
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
};

export default createUpdatePlanProject;
