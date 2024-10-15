import { UploadFileComposer } from "@egovernments/digit-ui-components";
import formatTimestamp from "../../utils/formatTimeStamp";

//returns [[FileId,auditDetails]]
const SearchFileIds = async (body) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/data/_search",
      useCache: false,
      method: "POST",
      userService: false,
      body:body,
    });
    // debugger;
    if (response?.ResourceDetails?.length === 0) {
      throw new Error("File not found for given microplan");
    }
    let fileIds = []
    let uuids = new Set(); //for making request to search user
    for (const ob of response?.ResourceDetails) {
      fileIds.push(ob?.processedFilestoreId);
      uuids.add(ob?.auditDetails?.lastModifiedBy);
    }

    uuids = [...uuids];
    // console.log("ji", response?.ResourceDetails);
    console.log("ji1", uuids);

    // debugger;

    const response1 = await Digit.CustomService.getResponse({
      url: "/user/_search",
      useCache: false,
      method: "POST",
      userService: false,
      body: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        pageSize: "100",
        uuid: uuids
      },
    });

    // debugger;
    if (response1?.user?.length === 0) {
      throw new Error("No users found with the given uuid");
    }
    let uuidName={};
    for (const ob of response1?.user){
      uuidName[ob.uuid]=ob.userName;
    }
    // let userNames = {}
    console.log("res1", response);
    console.log("res2", response1);
    response?.ResourceDetails.forEach((ob) => {
      ob["username"] = uuidName[ob?.auditDetails?.lastModifiedBy];  // Set the username
      ob.auditDetails.lastmodtime = formatTimestamp(ob?.auditDetails?.lastModifiedTime);  // Format and set the last modified time
    });

    console.log("response process1",response)

    let res = {...response}

    // console.log("res", res);
    return res
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default SearchFileIds;
