import Axios from "axios";
import Urls from "./urls";
export const UploadServices = {
  Filestorage: async (module, filedata, tenantId) => {
    const formData = new FormData();

    formData.append("file", filedata, filedata.name);
    formData.append("tenantId", tenantId);
    formData.append("module", module);
    let tenantInfo=window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")?`?tenantId=${tenantId}`:"";
    var config = {
      method: "post",
      url:`${Urls.FileStore}${tenantInfo}`,   
      data: formData,
      headers: { "auth-token": Digit.UserService.getUser() ? Digit.UserService.getUser()?.access_token : null},
    };

    return Axios(config);
  },

  MultipleFilesStorage: async (module, filesData, tenantId) => {
    const formData = new FormData();
    const filesArray = Array.from(filesData)
    filesArray?.forEach((fileData, index) => fileData ? formData.append("file", fileData, fileData.name) : null);
    formData.append("tenantId", tenantId);
    formData.append("module", module);
    let tenantInfo=window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")?`?tenantId=${tenantId}`:"";
    var config = {
      method: "post",
      url:`${Urls.FileStore}${tenantInfo}`, 
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data',"auth-token": Digit.UserService.getUser().access_token },
    };

    return Axios(config);
  },

  Filefetch: async (filesArray, tenantId) => {
    let tenantInfo=window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")?`?tenantId=${tenantId}`:"";
    var config = {
      method: "get",
      url:`${Urls.FileFetch}${tenantInfo}`,
      params: {
        tenantId: tenantId,
        fileStoreIds: filesArray?.join(","),
      },
    };
    console.log("=== UploadServices.Filefetch REQUEST ===");
    console.log("Request URL:", `${Urls.FileFetch}${tenantInfo}`);
    console.log("Request params:", config.params);
    console.log("Full request config:", config);

    const res = await Axios(config);

    console.log("=== UploadServices.Filefetch RESPONSE ===");
    console.log("Response status:", res.status);
    console.log("Response data:", res.data);
    console.log("First URL in response:", res.data?.fileStoreIds?.[0]?.url);
    console.log("Has X-Amz in first URL?", res.data?.fileStoreIds?.[0]?.url?.includes("X-Amz-"));
    console.log("=== END UploadServices.Filefetch ===");

    return res;
  },
};
