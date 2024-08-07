import React, { useState, useEffect } from "react";
import { Hooks } from "components";

const { useCustomAPIHook, useMDMSHook } = Hooks;

/**
 * `NetworkTest` Component
 * 
 * This component demonstrates the use of custom hooks for fetching data from APIs.
 * It uses `useMDMSHook` to fetch data related to master data management and `useCustomAPIHook`
 * for fetching data based on specific criteria. The fetched data is then displayed in the component.
 * 
 * @component
 * 
 * @example
 * import NetworkTest from './NetworkTest';
 * 
 * function App() {
 *   return <NetworkTest />;
 * }
 * 
 * @returns {JSX.Element} The rendered `NetworkTest` component.
 */
function NetworkTest() {
  /**
   * Request criteria for fetching data using the `useCustomAPIHook`.
   * 
   * @type {Object}
   * @property {string} url - The endpoint URL for the API request.
   * @property {Object} body - The request payload for the API.
   * @property {Object} config - Configuration options for the hook.
   * @property {boolean} config.enabled - Flag indicating whether the hook is enabled.
   * @property {Function} config.select - Function to process the response data.
   */
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

  // Fetch data using `useMDMSHook` for different criteria
  const { data: mdms0 } = useMDMSHook({
    tenantId: "mz",
    moduleDetails: [
      {
        moduleName: "common-masters",
        masterDetails: [
          { name: "tenants" },
          { name: "citymodule" },
        ],
      },
    ],
    url: "/egov-mdms-service/v1/_search",
  });

  const { data: mdms1 } = useMDMSHook({
    tenantId: "mz",
    moduleDetails: [
      {
        moduleName: "common-masters",
        masterDetails: [
          { name: "StateInfo" },
        ],
      },
    ],
    url: "/egov-mdms-service/v1/_search",
  });

  const { data: mdms2 } = useMDMSHook({
    tenantId: "mz",
    moduleDetails: [
      {
        moduleName: "common-masters",
        masterDetails: [
          { name: "uiCommonConstants" },
        ],
      },
    ],
    url: "/egov-mdms-service/v1/_search",
  });

  // Fetch data using `useCustomAPIHook` based on request criteria
  const { isLoading, data, isFetching } = useCustomAPIHook(reqCriteriaResource);

  // Render component
  return (
    <div className="App">
      {mdms2 ? (
        <div>Data: {JSON.stringify(mdms2)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default NetworkTest;
