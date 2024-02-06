import { ConvertEpochToDate } from "../../../../libraries/src/services/atoms/Utils/Date";

//This handler creates a FormData for Docs defaultValues
//This will add 'id' for all the docs, as they are coming from response
//These Ids will be used when user will modify or delete a doc of certain criteria
export const handleModifyProjectFiles = (uploadedDocs, docConfigData) => {
  
  //form data inout name mapping with file category Name
  let fileKeyMappings = [];
  let docMDMS = docConfigData?.works?.DocumentConfig?.[0]?.documents;
  docMDMS?.forEach((doc)=>{
    fileKeyMappings?.push({
      key : doc?.name,
      value : doc?.code
    })
  });

  let documentObject = {};

  // //keep only active docs -- at a time there would be only fileKeyMappings.length no of files
  // uploadedDocs = uploadedDocs?.filter(uploadedDoc=>uploadedDocs?.status!=="INACTIVE");

  fileKeyMappings?.map((fileKeyMapping)=>{
    let currentDoc = uploadedDocs?.filter((doc)=>doc?.documentType === fileKeyMapping?.value)[0];

    if(currentDoc?.fileStore || currentDoc?.fileStoreId) {
      if(fileKeyMapping?.value === "OTHERS") {
        documentObject["noSubProject_doc_others_name"] = currentDoc?.additionalDetails?.otherCategoryName;
      }
      documentObject[fileKeyMapping?.key] = [
        [currentDoc?.additionalDetails?.fileName, {file : { name : currentDoc?.additionalDetails?.fileName, id : currentDoc?.id}, fileStoreId : { fileStoreId : currentDoc?.fileStoreId || currentDoc?.fileStore}}]
      ] 
    }
  });
  return documentObject;
}

// export const updateDefaultValues = ({configs, isModify, sessionFormData, setSessionFormData, findCurrentDate, ULBOptions, project, headerLocale, docConfigData}) => {
//   if(!isModify) {
//       //clear defaultValues from 'config' ( this case can come when user navigates from Create Screen to Modify Screen )
//       let validDefaultValues = ["basicDetails_dateOfProposal", "noSubProject_ulb"];
//       configs.defaultValues = Object.keys(configs?.defaultValues)
//                             .filter(key=> validDefaultValues.includes(key))
//                             .reduce((obj, key) => Object.assign(obj, {
//                               [key] : configs.defaultValues[key]
//                             }), {});
//     }

//     //update default Values
//     //Only update the default values when date of proposal or ULB is not present in Session form Data.
//     //If we update evertytime, we would overwrite the Session data, on every refresh
//     if(!sessionFormData?.basicDetails_dateOfProposal || !sessionFormData.noSubProject_ulb) {
//       if(isModify) {
//         //this field is only for Modify flow
//         configs.defaultValues.basicDetails_projectID = project?.projectNumber ? project?.projectNumber  : "";
//       }else{
//         project = {};
//       }
//       configs.defaultValues.basicDetails_dateOfProposal = project?.additionalDetails?.dateOfProposal ? ConvertEpochToDate(project?.additionalDetails?.dateOfProposal, "yyyy-mm-dd")  : findCurrentDate(); //TODO:
//       configs.defaultValues.noSubProject_ulb = ULBOptions[0];
//       configs.defaultValues.basicDetails_projectName = project?.name ? project?.name  : "";
//       configs.defaultValues.basicDetails_projectDesc = project?.description ? project?.description  : "";
//       configs.defaultValues.noSubProject_letterRefNoOrReqNo = project?.referenceID ? project?.referenceID  : "";
//       configs.defaultValues.noSubProject_typeOfProject = project?.projectType ? { code : project?.projectType, name : `COMMON_MASTERS_${Digit.Utils.locale.getTransformedLocale(project?.projectType)}`, projectSubType : []}  : "";
//       configs.defaultValues.noSubProject_targetDemography = project?.additionalDetails?.targetDemography ? { code : project?.additionalDetails?.targetDemography, name : `COMMON_MASTERS_${Digit.Utils.locale.getTransformedLocale(project?.additionalDetails?.targetDemography)}`}  : "";
//       configs.defaultValues.noSubProject_estimatedCostInRs = project?.additionalDetails?.estimatedCostInRs ? project?.additionalDetails?.estimatedCostInRs  : "";
//       configs.defaultValues.noSubProject_geoLocation = ( project?.address?.latitude && project?.address?.longitude ) ? `${project?.address?.latitude}, ${project?.address?.longitude}`  : ""; 
//       configs.defaultValues.noSubProject_ward = project?.address?.boundary ?  { code : project?.address?.boundary, name : project?.address?.boundary, i18nKey: `${headerLocale}_ADMIN_${project?.address?.boundary}`}  : "";
//       configs.defaultValues.noSubProject_locality = project?.additionalDetails?.locality ? { code : project?.additionalDetails?.locality , name : project?.additionalDetails?.locality, i18nKey: `${headerLocale}_ADMIN_${project?.additionalDetails?.locality}`}  : "";
//       // configs.defaultValues.noSubProject_fund = project?.additionalDetails?.fund ? { code : project?.additionalDetails?.fund, name : `COMMON_MASTERS_FUND_${Digit.Utils.locale.getTransformedLocale(project?.additionalDetails?.fund)}`}  : "";
//       configs.defaultValues.noSubProject_docs = project?.documents ? handleModifyProjectFiles(project?.documents, docConfigData) : "";
   
//       setSessionFormData({...configs?.defaultValues});
//     }
// }