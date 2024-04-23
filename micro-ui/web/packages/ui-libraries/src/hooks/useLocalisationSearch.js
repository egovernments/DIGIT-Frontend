import { useQuery } from "react-query";
import { StoreService } from "../services/molecules/Store/service";
import { LocalizationService } from "../services/elements/Localization/service";
import axios from "axios"



export const useLocalisationSearch = ({ stateCode, moduleCode, locale,config }) => {
  
  return useQuery(["store", stateCode, moduleCode, locale], () => axios({
    method: 'post',
    url: `/localization/messages/v1/_search?locale=${locale}&tenantId=mz&module=rainmaker-common`,
    headers: {
      "Content-Type":"application/json"
    }, 
    data: {
      "RequestInfo": {
        "apiId" : "emp",
        "ver" : "1.0",
        "ts" : "10-03-2017 00:00:00",
        "action" : "create",
        "did" : "1",
        "key" : "abcdkey",
        "msgId" : "20170310130900",
        "requesterId" : "rajesh",
        "authToken" : "f839e7e8-c728-43f6-8b61-0e912033e940",
        "userInfo" : {
          "id" : 1
        }
    }
 }
  }),
  {cacheTime:0,
    ...config
  }
  )
}