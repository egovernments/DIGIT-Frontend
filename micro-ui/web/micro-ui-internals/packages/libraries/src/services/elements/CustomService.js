import { Request } from "../atoms/Utils/Request";

export const CustomService = {
  getResponse: ({ url, params, body, plainAccessRequest,useCache=true,userService=true,setTimeParam=true,userDownload=false,auth=true, headers={}}) =>  Request({
      url: url,
      data: body,
      useCache,
      userService,
      method: "POST",
      auth:auth,
      params: params,
      headers: headers,
      plainAccessRequest: plainAccessRequest,
      userDownload:userDownload,
      setTimeParam
    })
};


