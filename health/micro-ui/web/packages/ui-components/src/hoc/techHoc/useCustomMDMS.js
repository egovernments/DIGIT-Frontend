import { useQuery } from "@tanstack/react-query";
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
// const useCustomMDMS = (tenantId, moduleName, masterDetails = [], config = {}) => {
//   return useQuery([tenantId, moduleName, masterDetails], () => window?.Digit?.MdmsService.getMultipleTypesWithFilter(tenantId, moduleName, masterDetails), config);
// };

// export default useCustomMDMS;

const useCustomMDMS = (tenantId, moduleName, masterDetails = [], config = {}, mdmsv2 ) => {
  if (mdmsv2) {
    //here call the mdmsv2 api and return the options array
    return useCustomAPIHook({
      url: Urls.mdms_v2.search,
      params: {},
      changeQueryName: `mdms-v2-dropdowns-${mdmsv2?.schemaCode}`,
      body: {
        MdmsCriteria: {
          // tenantId, //changing here to send user's tenantId always whether stateId or city
          tenantId: Digit.ULBService.getCurrentTenantId(),
          schemaCode: mdmsv2?.schemaCode,
          isActive: true,
          limit: 1000,
        },
      },
      config: {
        enabled: Boolean(mdmsv2),
        select: (response) => {
          const { mdms } = response || {};
          return mdms
            ?.filter((row) => row?.isActive)
            ?.map((row) => ({
              i18nKey: Digit.Utils.locale.getTransformedLocale(
                `${row?.schemaCode}_${row?.data?.code}`
              ),
              ...row.data,
            }));
        },
      },
    });
  }

  // MDMS v1 flow (TanStack v5)
  return useQuery({
    queryKey: ["mdms", tenantId, moduleName, masterDetails],
    queryFn: () =>
      MdmsService.getMultipleTypesWithFilter(
        tenantId,
        moduleName,
        masterDetails
      ),
    gcTime: 0, // replaces cacheTime
    ...config,
  });
};

export default useCustomMDMS;
