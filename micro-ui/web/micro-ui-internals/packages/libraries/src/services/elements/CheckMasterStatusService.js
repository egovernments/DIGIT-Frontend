import { MdmsService } from "./MDMS";
// import { CustomService } from "./CustomService";

const CheckMasterStatusService = {
  checkDataCompleteness: function (data1, data2) {
    // Convert data1 to a set of codes for quick lookup
    const requiredCodes = new Set(data1.map((item) => item.code));

    // Iterate over each required code
    for (const item of data1) {
      const [prefix, suffix] = item.code.split(".");

      // Check if the prefix exists in data2
      if (!data2[prefix]) {
        return false;
      }

      // Check if the suffix exists in data2 under the prefix
      if (!data2[prefix][suffix]) {
        return false;
      }

      // Check if there's at least one active object in the list
      const hasActiveObject = data2[prefix][suffix].some((obj) => obj.active);
      if (!hasActiveObject) {
        return false;
      }
    }

    return true;
  },
  getMasterSetupStatus: async function (tenantId, module) {
    const mdmsResp = await MdmsService.call(tenantId, {
      moduleDetails: [
        {
          moduleName: "sandbox-ui",
          masterDetails: [{ name: "ModuleMasterConfig" }],
        },
      ],
    });
    const filteredData = mdmsResp?.MdmsRes?.["sandbox-ui"]?.ModuleMasterConfig?.find((item) => item.module === module);
    const filteredMaster = filteredData?.master?.filter((item) => item?.type === "module" || item?.type === "common");
    const payloadStruc = filteredMaster?.map((item) => {
      return {
        moduleName: item?.code?.split(".")?.[0],
        masterDetails: [
          {
            name: item?.code?.split(".")?.[1],
          },
        ],
      };
    });
    const masterResp = await MdmsService.call(tenantId, {
      moduleDetails: payloadStruc,
    });
    const filteredMasterRes = masterResp?.MdmsRes;
    return this.checkDataCompleteness(filteredMaster, filteredMasterRes);
  },
};

export default CheckMasterStatusService;
