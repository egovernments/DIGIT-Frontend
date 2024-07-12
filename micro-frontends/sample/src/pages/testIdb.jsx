import React, { useState, useEffect } from "react";
import { isOnline, onNetworkChange } from "../idb/networkStatus";
import useCustomAPIHook from "../hooks/useCustomAPIHook";
// import { get, set } from './idb';
// import { isOnline, onNetworkChange } from './networkStatus';

function TestIdb() {
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
      enabled: true,
      select: (data) => {
        return data?.MdmsRes;
      },
    },
  };

  const { isLoading, data, isFetching } = useCustomAPIHook(reqCriteriaResource);
  // if(isLoading){
  //   return  <div>Loading...</div>
  // }
  return (
    <div className="App">
      {data ? <div>Data: {JSON.stringify(data)}</div> : <div>Loading...</div>}
    </div>
  );
}

export default TestIdb;
