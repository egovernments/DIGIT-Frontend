import { useQuery } from "react-query";
import { MdmsService } from "../services/elements/MDMS";
import useCustomAPIHook from "./useCustomAPIHook";
import Urls from "../services/atoms/urls";
import _ from "lodash";
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
const useCustomMDMS = (tenantId, moduleName, masterDetails = [], config = {}, mdmsv2 = false) => {
  if (mdmsv2) {
    //here call the mdmsv2 api and return the options array
    return useCustomAPIHook({
      url: Urls.MDMS_V2,
      params: {},
      changeQueryName: `mdms-v2-dropdowns${mdmsv2?.schemaCode}`,
      body: {
        MdmsCriteria: {
          // tenantId, //changing here to send user's tenantId always whether stateId or city
          tenantId: Digit.ULBService.getCurrentTenantId(),
          moduleDetails: [
            {
              moduleName: moduleName,
              masterDetails: masterDetails,
            },
          ],
        },
      },
      config: {
        enabled: mdmsv2 ? true : false,
        select: (response) => {
          //mdms will be an array of master data
          //published this change in 1.8.2-beta.7
          if (config.select) {
            return config.select(response.MdmsRes);
          }
          return response;
        },
      },
    });
  }
  return useQuery([tenantId, moduleName, masterDetails], () => MdmsService.getMultipleTypesWithFilter(tenantId, moduleName, masterDetails), config);
};

export default useCustomMDMS;
