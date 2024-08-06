import React, { useState, useEffect } from "react";
import { Hooks } from "components";

const {useCustomAPIHook,useMDMSHook} = Hooks;


function NetworkTest() {
  const reqCriteriaResource = {
    url: `/egov-mdms-service/v1/_search`,
    body: {
      MdmsCriteria: {
        tenantId: "mz",
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "uiCommonConstants",
              },
              {
                name: "StateInfo",
              },
            ],
          },
        ],
      },
    },
    config: {
      enabled: false,
      select: (data) => {
        return data?.MdmsRes;
      },
    },
  };
  const { data:mdms0 } = useMDMSHook({tenantId: "mz",moduleDetails:[
    {
      moduleName: "common-masters",
      masterDetails: [{ name: "tenants" }, { name: "citymodule" }],
    },
  ],url:"/egov-mdms-service/v1/_search"})
  const {  data:mdms1 } = useMDMSHook({tenantId: "mz",moduleDetails:[
    {
      moduleName: "common-masters",
      masterDetails: [
     
        {
          name: "StateInfo",
        },
      ],
    },
  ]})
  const {data:mdms2 } = useMDMSHook({tenantId: "mz",moduleDetails:[
    {
      moduleName: "common-masters",
      masterDetails: [
        {
          name: "uiCommonConstants",
        },
       
      ],
    },
  ]})
  const { isLoading, data, isFetching } = useCustomAPIHook(reqCriteriaResource);
  // if(isLoading){
  //   return  <div>Loading...</div>
  // }
  
  return (
    <div className="App">
      {mdms2 ? <div>Data: {JSON.stringify(mdms2)}</div> : <div>Loading...</div>}
    </div>
  );
}

export default NetworkTest;
