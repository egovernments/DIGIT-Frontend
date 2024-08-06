import { Request } from "./Request";

export const genericService= ({ url, params, body,type="POST", options={plainAccessRequest:{},auth:true,useCache:true,userService:true,setTimeParam:true,userDownload:false}}) =>  Request({
      url: url,
      data: body,
      method: type,
      params: params,
      auth: options?.auth,
      useCache:options?.useCache,
      userService:options?.userService,
      plainAccessRequest: options?.plainAccessRequest,
      userDownload:options?.userDownload,
      setTimeParam:options?.setTimeParam
    })