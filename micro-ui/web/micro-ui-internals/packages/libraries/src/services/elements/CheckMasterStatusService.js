import { MdmsService } from "./MDMS";

const CheckMasterStatusService = {
  //function to check each master has atleast one data inside 
  checkDataCompleteness: function (data1, data2) {
    const requiredCodes = new Set(data1.map((item) => item.code));

    for (const item of data1) {
      const [prefix, suffix] = item.code.split(".");

      if (!data2[prefix]) {
        return false;
      }

      if (!data2[prefix][suffix]) {
        return false;
      }

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
