import _ from "lodash";
import React, { useState, Fragment } from "react";
import { Button as ButtonNew, Toast } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const getMDMSUrl = (v2 = false) => {
  if (v2) {
    let url = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || window.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
    return `/${url}`;
  }
  let url = window.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") || "egov-mdms-service";
  return `/${url}`;
};

function cleanObject(obj) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          delete obj[key];
        }
      } else if (
        obj[key] === undefined ||
        obj[key] === null ||
        obj[key] === false ||
        obj[key] === "" ||
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

const wrapTextStyle = {
  maxWidth: "15rem",
  wordWrap: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

const renderText = (value, t) => {
  if (value && value !== "NA") {
    return (
      <div style={wrapTextStyle}>
        <p>{t(value)}</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>{t(I18N_KEYS.COMMON.NA)}</p>
      </div>
    );
  }
};

export const UICustomizations = {
  IframeInterfaceConfig: {
    addAdditionalFilters: (url, filters) => {
      const { boundaryType, campaignNumber } = filters || {};
      const boundaryValue = filters?.[boundaryType];
      let filter = "";
      if (boundaryType && boundaryValue && campaignNumber) {
        filter = `(query:(match_phrase:(Data.boundaryHierarchy.${boundaryType}.keyword:'${boundaryValue}'))),(query:(match_phrase:(Data.campaignNumber.keyword:'${campaignNumber}')))`;
      } else {
        filter =
          boundaryType && boundaryValue
            ? `(query:(match_phrase:(Data.boundaryHierarchy.${boundaryType}.keyword:'${boundaryValue}')))`
            : campaignNumber
            ? `(query:(match_phrase:(Data.campaignNumber.keyword:'${campaignNumber}')))`
            : null;
      }
      const gParamMatch = /_g=\((.*?)\)/.exec(url);
      let gParamContent = gParamMatch && gParamMatch[1] ? gParamMatch[1] : "";

      if (filter) {
        const updatedGParam = `filters:!(${filter}),${gParamContent}`;
        const updatedUrl = url.replace(/_g=\((.*?)\)/, `_g=(${updatedGParam})`).replace(/ /g, "%20");
        return updatedUrl;
      } else {
        return url;
      }
    },
  },
  CampaignsInboxConfig: {
    preProcess: (data, additionalDetails) => {
      data.body.ProjectStaff = {};
      data.body.ProjectStaff.staffId = [Digit.UserService.getUser().info.uuid];
      data.params.tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.params.limit = data.state.tableForm.limit;
      data.params.offset = data.state.tableForm.offset;
      delete data.body.ProjectStaff.campaignName;
      delete data.body.ProjectStaff.campaignType;
      cleanObject(data.body.ProjectStaff);
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "ACTIONS":
          let options = [
            { code: "1", name: "VIEW_DASHBOARD" },
            { code: "2", name: "VIEW_CUSTOM_REPORT" },
          ];
          const onActionSelect = async (e, row) => {
            if (e.name == "VIEW_DASHBOARD") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&setup-completed=true`;
            }
            if (e.name == "VIEW_CUSTOM_REPORT") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&setup-completed=true`;
            }
          };
          return (
            <ButtonNew
              type="actionButton"
              variation="secondary"
              label={t(I18N_KEYS.COMPONENTS.TAKE_ACTION)}
              title={t(I18N_KEYS.COMPONENTS.TAKE_ACTION)}
              options={options}
              style={{ width: "20rem" }}
              optionsKey="name"
              showBottom={true}
              isSearchable={false}
              onOptionSelect={(item) => onActionSelect(item, row)}
            />
          );

        case "CAMPAIGN_NAME":
          return renderText(value, t);

        case "BOUNDARY_NAME":
          return renderText(value, t);

        case "START_DATE":
          return (
            <div style={{ maxWidth: "15rem", wordWrap: "break-word", whiteSpace: "normal", overflowWrap: "break-word" }}>
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "YEAR":
          return renderText(value, t);

        case "END_DATE":
          return (
            <div style={{ maxWidth: "15rem", wordWrap: "break-word", whiteSpace: "normal", overflowWrap: "break-word" }}>
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "PLANNED_END_DATE":
          return (
            <div style={{ maxWidth: "15rem", wordWrap: "break-word", whiteSpace: "normal", overflowWrap: "break-word" }}>
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        default:
          return null;
      }
    },
  },
  MyCampaignConfigOngoing: {
    preProcess: (data, additionalDetails) => {
      data.body.ProjectStaff = {};
      data.body.ProjectStaff.staffId = [Digit.UserService.getUser().info.uuid];
      data.params.tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.params.limit = data.state.tableForm.limit;
      data.params.offset = data.state.tableForm.offset;
      cleanObject(data.body.ProjectStaff);
      return data;
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
  },
  MyCampaignConfigCompleted: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) data.body.CampaignDetails.campaignName = campaignName;
      if (campaignType) data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
  },
  MyCampaignConfigUpcoming: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        createdBy: Digit.UserService.getUser().info.uuid,
        campaignsIncludeDates: false,
        startDate: Digit.Utils.pt.convertDateToEpoch(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], "daystart"),
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) data.body.CampaignDetails.campaignName = campaignName;
      if (campaignType) data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
  },
  MyCampaignConfigDrafts: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["drafted"],
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) data.body.CampaignDetails.campaignName = campaignName;
      if (campaignType) data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
  },
  MyCampaignConfigDraftsNew: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["drafted"],
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) data.body.CampaignDetails.campaignName = campaignName;
      if (campaignType) data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
  },
  MyCampaignConfigFailed: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["failed"],
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) data.body.CampaignDetails.campaignName = campaignName;
      if (campaignType) data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [{ name: "projectTypes" }],
              },
            ],
          },
        },
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => {},
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {},
    onCardActionClick: (obj) => {},
  },
};
