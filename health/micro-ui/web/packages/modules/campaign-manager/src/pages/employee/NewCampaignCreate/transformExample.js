/**
 * Example usage of the MDMS to App Config transformer
 */

import { transformMdmsData, transformMdmsToAppConfig } from "./transformMdmsConfig";

// Example usage:
export const useMdmsTransformation = (mdmsData) => {
  // Full transformation with metadata
  const transformedData = transformMdmsData(mdmsData);

  return transformedData;
};

// Simple transformation - just get app config array
export const getAppConfigOnly = (mdmsData) => {
  return transformMdmsToAppConfig(mdmsData);
};

// Example: Get config for a specific flow
export const getFlowConfig = (mdmsData, flowName) => {
  const appConfig = transformMdmsToAppConfig(mdmsData);
  return appConfig.filter((item) => item.flow === flowName);
};

// Example: Get all pages for a specific flow
export const getFlowPages = (mdmsData, flowName) => {
  const appConfig = transformMdmsToAppConfig(mdmsData);
  return appConfig.filter((item) => item.flow === flowName);
};

// Example: Merge transformed config with existing config
export const mergeWithExistingConfig = (existingConfig, mdmsData) => {
  const newConfig = transformMdmsToAppConfig(mdmsData);

  // You can implement custom merge logic here
  // For example, replace existing flows or append new ones
  const flowsInNew = new Set(newConfig.map((item) => item.flow));

  const filteredExisting = existingConfig.filter((item) => !flowsInNew.has(item.flow));

  return [...filteredExisting, ...newConfig];
};

/**
 * Usage in React Component:
 *
 * import { transformMdmsData } from './transformMdmsConfig';
 * import { useMdmsTransformation } from './transformExample';
 *
 * function MyComponent() {
 *   const [appConfig, setAppConfig] = useState([]);
 *
 *   useEffect(() => {
 *     if (mdmsData) {
 *       const transformed = transformMdmsData(mdmsData);
 *       setAppConfig(transformed.appConfig);
 *
 *       // You can also access:
 *       // transformed.flowMetadata - for onAction and wrapperConfig
 *       // transformed.initialPage - for routing
 *       // transformed.project - project details
 *     }
 *   }, [mdmsData]);
 *
 *   return (
 *     // Your component JSX
 *   );
 * }
 */
