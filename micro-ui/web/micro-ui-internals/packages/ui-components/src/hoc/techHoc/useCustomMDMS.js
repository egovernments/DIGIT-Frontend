// import { useQuery } from "@tanstack/react-query";
// import { MdmsService } from "../services/elements/MDMS";
/**
 * Custom hook which can be used to
 * make a single hook a module to get multiple masterdetails with/without filter
 *
 * @author jagankumar-egov
 *
 * @example
 * // returns useQuery object
 * Digit.Hooks.useCustomMDMS(
 *          "stateid",
 *          "modulename",
 *          [
 *              { name:"masterdetail1",filter:"[?(@.active == true)]"},
 *              { name:"masterdetail2" }
 *          ],
 *          { // all configs supported by the usequery
 *              default:(data)=>{
 *                          format
 *                          return formattedData;
 *                          }
 *          })
 *
 * @returns {Object} Returns the object of the useQuery from react-query.
 */
const useCustomMDMS = (tenantId, moduleName, masterDetails = [], config = {}) => {
  return null;
  // return useQuery(
  //   [tenantId, moduleName, ...masterDetails], // Spread masterDetails to ensure each item is treated as part of the query key
  //   () =>
  //     window?.Digit?.MdmsService.getMultipleTypesWithFilter(tenantId, moduleName, masterDetails), // Ensure the service function is properly called
  //   config // Pass along the config object for any additional query configurations
  // );
};

export default useCustomMDMS;
