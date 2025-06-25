import { Request } from "../atoms/Utils/Request";

export const CustomService = {
  getResponse: ({ url, params, body, plainAccessRequest,useCache=true,userService=true,setTimeParam=true,userDownload=false,auth=true, headers={}, method="POST"}) =>  Request({
      url: url,
      data: body,
      useCache,
      userService,
      method: method,
      auth:auth,
      params: params,
      headers: headers,
      plainAccessRequest: plainAccessRequest,
      userDownload:userDownload,
      setTimeParam
    })
};


