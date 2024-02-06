import { convertDateToEpoch } from "../../../../libraries/src/utils/pt";

//form data input name (with cropped prefix) mapping with file category Name

//This handler will trim all the doc keys to 'documentType' Keys -- check above object
const transformDefaultDocObject = (documentDefaultValue) => {
  if(!documentDefaultValue) {
    return false;
  }

  let trimmedObjectKeys = {};
  for(let key of Object.keys(documentDefaultValue)) {

    //only for one project -- MUKTA specific
    //for more than one project, remove associated prefix, 'withSubProject_project_doc_'
    if(key.includes("noSubProject_doc_")) {
      let croppedKey = key.replace("noSubProject_doc_","");
      trimmedObjectKeys[croppedKey] = documentDefaultValue[key];
    }
  }

  return trimmedObjectKeys;
}

//This handler will return the payload for doc according to API spec. 
//This object will be later pushed to an array
const createDocObject = (document, docType, otherDocFileName="Others", isActive, tenantId, docConfigData) =>{
 
  let documentType = docConfigData?.works?.DocumentConfig?.[0]?.documents;

  //handle empty Category Name in File Type
  if((otherDocFileName.trim()).length === 0) {
    otherDocFileName = "";
  }

  let payload_modal = {};
  payload_modal.documentType = documentType?.filter(doc=>doc?.name === docType)?.[0]?.code;
  payload_modal.fileStoreId = document?.[1]?.['fileStoreId']?.['fileStoreId'];
  payload_modal.documentUid = document?.[1]?.['fileStoreId']?.['fileStoreId'];
  payload_modal.status = isActive;
  payload_modal.id = document?.[1]?.['file']?.['id'];
  payload_modal.key = docType;
  payload_modal.additionalDetails = {
    fileName : document?.[1]?.['file']?.['name'] || document?.[0] ? document?.[1]?.['file']?.['name'] || document?.[0] :  documentType?.filter(doc=>doc?.name === docType)?.[0]?.code,
    otherCategoryName : otherDocFileName
  }
  payload_modal.tenantId = tenantId;
  return payload_modal;
}

//getting latitude & logitude from text Input
const getLatLongfromString = (geolocation, type="LAT") => { 
  let latlong = geolocation?.split(",");
  if(type === "LAT")
  return parseFloat(latlong?.[0]?.trim()) == NaN ? null : parseFloat(latlong?.[0]?.trim());
  else if(type === "LONG")
  return parseFloat(latlong?.[1]?.trim()) == NaN ? null : parseFloat(latlong?.[1]?.trim());
}

const createDocumentsPayload = (documents, otherDocFileName, configs, tenantId, docConfigData) => {
  
  let documents_payload_list = [];
  let documentDefaultValue = transformDefaultDocObject(configs?.defaultValues?.noSubProject_docs);

  // compare with existing docs
  // if existing docs exists
  if(documentDefaultValue) {
    for(let defaultDocKey of Object.keys(documentDefaultValue)) {
      let isExist = false;
      for(let uploadedDocObject of documents_payload_list) {
         //comparing same file types from default and new uplaoded files
        if(defaultDocKey === uploadedDocObject?.key && defaultDocKey !== "others_name") {

          //new file being uploaded, if ID is undefined ( Update Case )
          if(!uploadedDocObject?.id) {
            //if old file exists, make default value file as inactive
            let payload_modal = createDocObject(documentDefaultValue[defaultDocKey][0], defaultDocKey, otherDocFileName, "INACTIVE", tenantId, docConfigData); 
            payload_modal.documentType = "INACTIVE"
            documents_payload_list.push(payload_modal);
          }
          isExist = true;
        }
      }
      //if previous file does not exist in new formData ( Delete Case ), mark it as InActive
      if(!isExist && defaultDocKey !== "others_name") {
        let payload_modal = createDocObject(documentDefaultValue[defaultDocKey][0], defaultDocKey, otherDocFileName, "INACTIVE", tenantId); 
        payload_modal.documentType = "INACTIVE"
        documents_payload_list.push(payload_modal);
      }
    }
  }

  //new uploaded docs
  for(let docType of Object.keys(documents)) {
    for(let document of documents[docType]) {
      if(_.isArray(document)) {
      let payload_modal = createDocObject(document, docType, otherDocFileName, "ACTIVE", tenantId, docConfigData); 
      documents_payload_list.push(payload_modal);
      }
    }
  }

  return documents_payload_list;
}

function createProjectList(data, selectedProjectType, parentProjectID, tenantId, docConfigData, modifyParams, configs) {
    
    let projects_payload = [];
    let project_details;
    let basic_details = data?.basicDetails;
    let total_projects = 1;
    if(selectedProjectType?.code === "COMMON_NO") {
      project_details = data?.noSubProject;
      total_projects = 1;
    }else if(selectedProjectType?.code === "COMMON_YES") {
      if(parentProjectID) {
        total_projects = data?.withSubProject?.subProjects.length - 1; //array has data from 1st index
      }else{
        project_details = data?.withSubProject;
      }
    }
    //iterate till all sub-projects. For noSubProject Case, this will iterate only once
    for(let index=1; index<=total_projects; index++) {
        // In case of Sub Projects having Parent ID, project_details will be each sub-project
        if(parentProjectID) {
          project_details = data?.withSubProject?.subProjects[index];
        }
        let payload =   {
          "tenantId": tenantId,
          "id" : modifyParams?.modify_projectID,
          "projectNumber" : modifyParams?.modify_projectNumber,
          "name": parentProjectID ? project_details?.projectName : basic_details?.projectName,
          "projectType": project_details?.typeOfProject?.code, 
          "projectSubType": project_details?.subTypeOfProject?.code || "" , 
          "department": project_details?.owningDepartment?.code || "",
          "description":  parentProjectID ? project_details?.projectDesc : basic_details?.projectDesc,
          "referenceID": project_details?.letterRefNoOrReqNo,
          "documents": createDocumentsPayload(
            project_details?.docs,
            project_details?.docs?.noSubProject_doc_others_name,
            configs,
            tenantId,
            docConfigData
            ),
          "natureOfWork" : project_details?.natureOfWork?.code,
          "address": {
            "id" : modifyParams?.modify_addressID,
            "tenantId": tenantId,
            // "doorNo": "1", //Not being captured on UI
            "latitude": (project_details?.geoLocation?.latitude ? project_details?.geoLocation?.latitude : getLatLongfromString(project_details?.geoLocation,"LAT")) || null, 
            "longitude": (project_details?.geoLocation?.longitude ? project_details?.geoLocation?.longitude : getLatLongfromString(project_details?.geoLocation,"LONG")) || null,
            // "locationAccuracy": 10000, //Not being captured on UI
            // "type": "Home", //Not being captured on UI
            // "addressLine1": project_details?.geoLocation,
            // "addressLine2": "Address Line 2", //Not being captured on UI
            // "landmark": "Area1", //Not being captured on UI
            "city": project_details?.ulb?.code,
            // "pincode": "999999", //Not being captured on UI
            // "buildingName": "Test_Building", //Not being captured on UI
            // "street": "Test_Street", //Not being captured on UI
            "boundary": project_details?.ward?.code, //ward code
            "boundaryType" : "Ward"
          },
          "startDate": convertDateToEpoch(project_details?.startDate), 
          "endDate": convertDateToEpoch(project_details?.endDate), 
          "isTaskEnabled": false, //Not being captured on UI //For Health Team Project
          "parent": parentProjectID || "", // In case of Single project, Parent ID is empty.
          "additionalDetails": { //These are financial details. Adding them here as they will be integrated with a different service.
            // "budgetHead" : project_details?.budgetHead?.code,
            "estimatedCostInRs" : project_details?.estimatedCostInRs,
            // "function" : project_details?.function?.code,
            // "fund" : project_details?.fund?.code,
            // "scheme" :  project_details?.scheme?.code,
            // "subScheme" :  project_details?.subScheme?.code,  
            "dateOfProposal" : convertDateToEpoch(basic_details?.dateOfProposal),
            "recommendedModeOfEntrustment" : project_details?.recommendedModeOfEntrustment?.code,
            "locality" : project_details?.locality?.code || project_details?.locality?.[0]?.code,
            "creator": Digit.UserService.getUser()?.info?.name,
            "targetDemography" : project_details?.targetDemography?.code,
          },
          "rowVersion": 0
      }
      projects_payload.push(payload);
    }
    return projects_payload;
}

const CreateProjectUtils = {
    payload : {
        create : (data, selectedProjectType, parentProjectID, tenantId, docConfigData, modifyParams, configs) => {
            return {
                Projects : createProjectList(data, selectedProjectType, parentProjectID, tenantId, docConfigData, modifyParams, configs), //if there is a Parent Project, then create list of sub-projects array, or only create one object for Parent Project.
                apiOperation : "CREATE"
            }
        },
        transform : (data) => {
          let transformedPayload = {
            basicDetails : {},
            noSubProject : {},
            withSubProject : {}
          };
          for(let key of Object.keys(data)) {
            if(key.includes("basicDetails_")) {
              let croppedKey = key.replace("basicDetails_","");
              transformedPayload.basicDetails[croppedKey] = data[key];
            }
            if(key.includes("noSubProject_")) {
              let croppedKey = key.replace("noSubProject_","");
              transformedPayload.noSubProject[croppedKey] = data[key];
            }
            if(key.includes("withSubProject_project_")) {
              let croppedKey = key.replace("withSubProject_project_","");
              transformedPayload.withSubProject[croppedKey] = data[key];
            }
          }
          return transformedPayload;
        }
    }
}

export default CreateProjectUtils;