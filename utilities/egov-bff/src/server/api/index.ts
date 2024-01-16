import config, { getErrorCodes } from "../config";
import { httpRequest } from "../utils/request";

var url = require("url");

const search_user = async (
  uuid: string,
  tenantId: string,
  requestinfo: any
) => {
  return await httpRequest(
    url.resolve(config.host.user, config.paths.user_search),
    {
      RequestInfo: requestinfo.RequestInfo,
      uuid: [uuid],
      tenantId: tenantId,
    }
  );
};

const search_workflow = async (
  applicationNumber: string,
  tenantId: string,
  requestinfo: any
) => {
  var params = {
    tenantId: tenantId,
    businessIds: applicationNumber,
  };
  return await httpRequest(
    url.resolve(config.host.workflow, config.paths.workflow_search),
    requestinfo,
    params
  );
};
const search_localization = async (
  tenantId: string,
  module: string = "rainmaker-common",
  locale: string = "en_IN",
  requestinfo: any
) => {
  return await httpRequest(
    url.resolve(config.host.localization, config.paths.localization_search),
    requestinfo,
    {
      tenantId: tenantId,
      module: module,
      locale: locale,
    }
  );
};

const search_mdms = async (
  tenantId: string,
  module: string,
  master: string,
  requestinfo: any
) => {
  const requestBody = {
    RequestInfo: requestinfo.RequestInfo,
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: module,
          masterDetails: [
            {
              name: master,
            },
          ],
        },
      ],
    },
  };
  return await httpRequest(
    url.resolve(config.host.mdms, config.paths.mdms_search),
    requestBody,
    null,
    "post",
    "",
    { cachekey: `${tenantId}-${module}-${master}` }
  ).then((response: { MdmsRes: any }) => response.MdmsRes[module][master]);
};

/*
  This asynchronous function searches for contracts based on the provided parameters.
*/
const search_mdms_v2 = async (schemaCode: string, filters: any = {},id:string ="") => {
  const reqBody = {
    MdmsCriteria: {
      tenantId: config.stateTenantId,
      filters: filters,
      schemaCode: schemaCode,
      limit: 100,
      offset: 0,
      ...(id && { "ids": [id] }),
    },
  };
  // Send an HTTP request to the mdms search endpoint using the provided parameters and request information.
    return await httpRequest(
      url.resolve(config.host.mdmsV2, config.paths.mdmsV2_search),
      reqBody
    ); 
};

/*
  This asynchronous function searches for contracts based on the provided parameters.
*/
const create_mdms_v2 = async (schemaCode: string, body: any = {}) => {
  const {RequestInfo,DataSync}=body;
  const reqBody = {
    RequestInfo,
    Mdms: {
      tenantId: config?.stateTenantId,
      schemaCode: schemaCode,
      uniqueIdentifier: null,
      data: {
        ...DataSync,
      },
      isActive: true,
    },
  };
  // Send an HTTP request to the mdms search endpoint using the provided parameters and request information.
  const mdmsResponse = await httpRequest(
    url.resolve(
      config.host.mdmsV2,
      config.paths.mdmsV2_create + `/${schemaCode}`
    ),
    reqBody
  );
  // Check if there are contracts in the response.
  if (mdmsResponse?.mdms?.length > 0) {
    // If contracts are found, return the first one.
    return mdmsResponse;
  }

  // If no contracts are found, return an error code.
  return getErrorCodes("MDMS", "MDMS_DATA_CREATION_FAILED");
};

export {
  create_mdms_v2,
  search_mdms,
  search_user,
  search_workflow,
  search_mdms_v2,
  search_localization,
};
