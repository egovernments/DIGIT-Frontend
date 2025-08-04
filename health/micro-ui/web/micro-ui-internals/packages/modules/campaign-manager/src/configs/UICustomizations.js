import { Link } from "react-router-dom";
import _ from "lodash";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import {
  Button,
  PopUp,
  Switch,
  Tooltip,
  Toast,
  TooltipWrapper,
  FieldV1,
  Stepper,
  TextBlock,
  Card,
  HeaderComponent,
  ActionBar,
} from "@egovernments/digit-ui-components";
import TimelineComponent from "../components/TimelineComponent";
import getMDMSUrl from "../utils/getMDMSUrl";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import CloneCampaignWrapper from "../components/CloneCampaignWrapper";
//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};
const businessServiceMap = {};

const inboxModuleNameMap = {};

const HCM_MODULE_NAME = "console";
const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const updateServiceDefinition = async (tenantId, newStatus, sdcode) => {
  try {
    const res = await Digit.CustomService.getResponse({
      url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_update`,
      body: {
        ServiceDefinition: {
          tenantId: tenantId,
          code: sdcode,
          isActive: newStatus,
        },
      },
    });
    if (res) {
    }
    return res;
  } catch (error) {
    // console.error("Error updating service definition:", error);
    return null;
  }
};
const retryCampaign = async (row, searchResult) => {
  const filteredCampaign = searchResult.filter((item) => item?.id === row?.id);
  if (filteredCampaign?.length > 0) {
    const newCampaignObject = filteredCampaign?.[0] || {};
    try {
      const res = await Digit.CustomService.getResponse({
        url: "/project-factory/v1/project-type/retry",
        body: {
          CampaignDetails: {
            ...newCampaignObject,
            action: "retry",
          },
        },
      });
      return res;
    } catch (error) {
      // console.error("Error updating service definition:", error);
      return null;
    }
  }
};
export const UICustomizations = {
  HCM_MODULE_NAME,
  MyChecklistSearchConfig: {
    preProcess: (data, additionalDetails) => {
      if (data?.state?.searchForm?.Role?.code) {
        let ro = data.state.searchForm.Role.code;
        ro = ro.replace("ACCESSCONTROL_ROLES_ROLES_", "");
        data.body.MdmsCriteria.filters.role = ro;
      }
      if (data?.state?.searchForm?.Type?.list) {
        let ty = data.state.searchForm.Type.list;
        ty = ty.replace("HCM_CHECKLIST_TYPE_", "");
        data.body.MdmsCriteria.filters.checklistType = ty;
      }
      if (data?.state?.searchForm && Object.keys(data.state.searchForm).length === 0) {
        data.body.MdmsCriteria.filters = {};
      }
      // data.params.limit = 5;
      // data.params.offset = 0;

      // if (additionalDetails?.campaignName) setCampaignName(additionalDetails?.campaignName);
      return data;
    },

    additionalCustomizations: (row, key, column, value, searchResult) => {
      const { t } = useTranslation();
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      const navigate = useNavigate();
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const campaignName = searchParams.get("name");
      const projectType = searchParams.get("projectType");
      const campaignId = searchParams.get("campaignId");
      const campaignNumber = searchParams.get("campaignNumber");
      switch (key) {
        case "HCM_CHECKLIST_STATUS":
          const [localIsActive, setLocalIsActive] = useState(row?.ServiceRequest?.[0]?.isActive);
          const toggle = async () => {
            const prev = row?.ServiceRequest?.[0]?.isActive;
            const sdcode = row?.ServiceRequest?.[0]?.code;
            const res = await updateServiceDefinition(tenantId, !prev, sdcode);
            setLocalIsActive(!localIsActive);
            if (res) {
            }
          };
          const switchText = localIsActive ? "Active" : "Inactive";
          return row?.ServiceRequest?.[0] ? (
            <Switch isCheckedInitially={row?.ServiceRequest?.[0]?.isActive} label={switchText} onToggle={toggle} />
          ) : (
            <>{t("CHECKLIST_TOBE_CONFIGURED")}</>
          );
        case "CHECKLIST_LAST_UPDATE":
          const lastModDate =
            row?.ServiceRequest?.length !== 0 ? row?.ServiceRequest?.[0]?.auditDetails?.lastModifiedTime : row?.auditDetails?.lastModifiedTime;
          return Digit.DateUtils.ConvertEpochToDate(lastModDate);
        case "HCM_CHECKLIST_ACTION":
          const role_code = row?.data?.role;
          const cl_code = row?.data?.checklistType;
          const sd = row?.ServiceRequest?.[0];
          if (sd) {
            return (
              <Button
                type="button"
                size="medium"
                style={{ width: "8rem" }}
                // icon="View"
                variation="secondary"
                label={t("HCM_CHECKLIST_VIEW")}
                onClick={() => {
                  navigate(
                    `/${window.contextPath}/employee/campaign/checklist/view?campaignName=${campaignName}&role=${role_code}&checklistType=${cl_code}&projectType=${projectType}&campaignId=${campaignId}&campaignNumber=${campaignNumber}`
                  );
                }}
              />
            );
          } else {
            return (
              <Button
                type="button"
                size="medium"
                style={{ width: "8rem" }}
                // icon="View"
                variation="secondary"
                label={t("HCM_CHECKLIST_CREATE")}
                onClick={() => {
                  navigate(
                    `/${window.contextPath}/employee/campaign/checklist/create?campaignName=${campaignName}&role=${role_code}&checklistType=${cl_code}&projectType=${projectType}&campaignId=${campaignId}&campaignNumber=${campaignNumber}`
                  );
                }}
              />
            );
          }
        default:
          return value;
      }
    },
  },
  MyBoundarySearchConfig: {
    preProcess: (data, additionalDetails) => {
      data.body.BoundaryTypeHierarchySearchCriteria.hierarchyType = data?.state?.searchForm?.Name;
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [isActive, setIsActive] = useState(row?.isActive);
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      let res;
      const callSearch = async () => {
        const res = await Digit.CustomService.getResponse({
          url: `/boundary-service/boundary-hierarchy-definition/_search`,
          body: {
            BoundaryTypeHierarchySearchCriteria: {
              tenantId: tenantId,
              limit: 2,
              offset: 0,
              hierarchyType: row?.hierarchyType,
            },
          },
        });
        return res;
      };
      const fun = async () => {
        res = await callSearch();
      };
      // fun();
      const [showToast, setShowToast] = useState(null);
      switch (key) {
        case "HIERARCHY_NAME":
          return row?.hierarchyType;
          break;
        case "LEVELS":
          return row?.boundaryHierarchy?.length;

          return (
            <>
              {/* <span data-tip data-for="dynamicTooltip">{row?.boundaryHierarchy?.length}</span>
                <ReactTooltip id="dynamicTooltip" getContent={() => tooltipContent} /> */}
              <TooltipWrapper arrow={false} content={res} enterDelay={100} leaveDelay={0} placement="bottom" style={{}}>
                {row?.boundaryHierarchy?.length}
              </TooltipWrapper>
              {/* <Tooltip
                  className=""
                  content="Tooltipkbjkjnjknk"
                  description=""
                  header=""
                  style={{}}
                /> */}
            </>
          );
          break;
        case "CREATION_DATE":
          let epoch = row?.auditDetails?.createdTime;
          return Digit.DateUtils.ConvertEpochToDate(epoch);
          // return row?.auditDetails?.createdTime;
          break;
        case "ACTION":
          const tenantId = Digit?.ULBService?.getCurrentTenantId();
          const generateFile = async () => {
            const res = await Digit.CustomService.getResponse({
              url: `/project-factory/v1/data/_generate`,
              body: {},
              params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                forceUpdate: true,
                hierarchyType: row?.hierarchyType,
                campaignId: "default",
              },
            });
            return res;
          };
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const closeToast = () => {
            setShowToast(null);
          };
          const generateTemplate = async () => {
            try {
              const res = await Digit.CustomService.getResponse({
                url: `/project-factory/v1/data/_download`,
                body: {},
                params: {
                  tenantId: tenantId,
                  type: "boundaryManagement",
                  hierarchyType: row?.hierarchyType,
                  campaignId: "default",
                },
              });
              return res;
            } catch (error) {
              setShowToast({ label: error?.response?.data?.Errors?.[0]?.code, type: "error" });
              return error;
            }
          };
          const downloadExcelTemplate = async () => {
            // const res = await generateFile();
            // await delay(2000);
            const resFile = await generateTemplate();

            if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
              // Splitting filename before .xlsx or .xls
              setShowToast({ label: "BOUNDARY_DOWNLOADING", type: "info" });
              const fileNameWithoutExtension = row?.hierarchyType;

              Digit.Utils.campaign.downloadExcelWithCustomName({
                fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid,
                customName: fileNameWithoutExtension,
              });
              setShowToast({ label: "BOUNDARY_DOWNLOADED", type: "success" });
            }
          };
          return (
            <>
              {showToast && <Toast type={String(showToast?.type)} label={t(showToast?.label)} isDleteBtn={"true"} onClose={() => closeToast()} />}
              <Button
                type={"button"}
                size={"medium"}
                icon={"DownloadIcon"}
                variation={"secondary"}
                label={t("DOWNLOAD")}
                onClick={() => {
                  downloadExcelTemplate();
                }}
              />
            </>
          );
      }
    },
  },
  MicroplanCampaignSearchConfig: {
    preProcess: (data, additionalDetails) => {
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get("userId");
      const status = searchParams.get("status");
      userId && (data.body.PlanConfigurationSearchCriteria.userUuid = userId);
      status && (data.body.PlanConfigurationSearchCriteria.status = [status]);
      data.body.PlanConfigurationSearchCriteria.name = data?.state?.searchForm?.microplanName;
      // data.body.PlanConfigurationSearchCriteria.campaignType = data?.state?.searchForm?.campaignType?.[0]?.code;
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "NAME_OF_MICROPLAN":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "CAMPAIGN_TYPE":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("CAMPAIGN_PROJECT_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }
        case "LAST_MODIFIED_TIME":
          return Digit.DateUtils.ConvertEpochToDate(value);
        default:
          return null; // Handle any unexpected keys here if needed
      }
    },
  },
  MyCampaignConfigOngoing: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        campaignsIncludeDates: true,
        startDate: Digit.Utils.pt.convertDateToEpoch(new Date().toISOString().split("T")[0], "daystart"),
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date().toISOString().split("T")[0]),
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [timeLine, setTimeline] = React.useState(false);
      const [campainCopying, setCampaignCopying] = React.useState(false);
      const resourceIdArr = [];
      row?.resources?.map((i) => {
        if (i?.createResourceId && i?.type === "user") {
          resourceIdArr.push(i?.createResourceId);
        }
      });
      // const { t } = useTranslation();
      const onActionSelect = (value, row) => {
        switch (value?.code) {
          case "ACTION_LABEL_UPDATE_DATES":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${row?.id}&campaignName=${row?.campaignName}`
            );
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);
            break;
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;
          case "CREATE_COPY":
            setCampaignCopying(true);
            break;
          case "ACTION_LABEL_CONFIGURE_APP":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
              },
              "",
              `/${window.contextPath}/employee/campaign/checklist/search?name=${row?.campaignName}&campaignId=${row?.id}&projectType=${row?.projectType}`
            );
            const navEvent1 = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent1);
            break;

          case "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${row?.id}&campaignName=${row?.campaignName}`
            );
            const nav = new PopStateEvent("popstate");
            window.dispatchEvent(nav);
            break;
          default:
            console.log(value);
            break;
        }
      };
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_END_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_ACTIONS":
          return (
            <>
              <Button
                className="campaign-action-button"
                type="actionButton"
                variation="secondary"
                label={"Action"}
                options={[
                  ...(row?.status === "created" ? [{ key: 1, code: "ACTION_LABEL_UPDATE_DATES", i18nKey: t("ACTION_LABEL_UPDATE_DATES") }] : []),
                  { key: 2, code: "ACTION_LABEL_CONFIGURE_APP", i18nKey: t("ACTION_LABEL_CONFIGURE_APP") },
                  { key: 3, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") },
                  { key: 4, code: "CREATE_COPY", i18nKey: t("CREATE_COPY") },
                  ...(row?.status === "created"
                    ? [{ key: 1, code: "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS", i18nKey: t("ACTION_LABEL_UPDATE_BOUNDARY_DETAILS") }]
                    : []),
                ]}
                optionsKey="i18nKey"
                showBottom={true}
                isSearchable={false}
                onOptionSelect={(item) => onActionSelect(item, row)}
              />
              {timeLine && (
                <PopUp
                  type={"default"}
                  heading={t("ES_CAMPAIGN_TIMELINE")}
                  onOverlayClick={() => setTimeline(false)}
                  onClose={() => setTimeline(false)}
                >
                  <TimelineComponent campaignId={row?.id} resourceId={resourceIdArr} />
                </PopUp>
              )}
              {campainCopying && (
                <CloneCampaignWrapper campaignId={row?.id} campaignName={row?.campaignName} setCampaignCopying={setCampaignCopying} />
              )}
            </>
          );
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
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
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [timeLine, setTimeline] = React.useState(false);
      const [campainCopying, setCampaignCopying] = React.useState(false);

      const resourceIdArr = [];
      row?.resources?.map((i) => {
        if (i?.createResourceId && i?.type === "user") {
          resourceIdArr.push(i?.createResourceId);
        }
      });
      const onActionSelect = (value, row) => {
        switch (value?.code) {
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;
          case "CREATE_COPY":
            setCampaignCopying(true);
            break;
          default:
            console.log(value);
            break;
        }
      };
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_END_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_ACTIONS":
          return (
            <>
              <Button
                className="campaign-action-button"
                type="actionButton"
                variation="secondary"
                label={"Action"}
                options={[
                  { key: 1, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") },
                  { key: 1, code: "CREATE_COPY", i18nKey: t("CREATE_COPY") },
                ]}
                optionsKey="i18nKey"
                showBottom={true}
                isSearchable={false}
                onOptionSelect={(item) => onActionSelect(item, row)}
              />
              {timeLine && (
                <PopUp
                  type={"default"}
                  heading={t("ES_CAMPAIGN_TIMELINE")}
                  onOverlayClick={() => setTimeline(false)}
                  onClose={() => setTimeline(false)}
                >
                  <TimelineComponent campaignId={row?.id} resourceId={resourceIdArr} />
                </PopUp>
              )}

              {campainCopying && (
                <CloneCampaignWrapper campaignId={row?.id} campaignName={row?.campaignName} setCampaignCopying={setCampaignCopying} />
              )}
            </>
          );
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
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
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
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
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [timeLine, setTimeline] = React.useState(false);
      const [campainCopying, setCampaignCopying] = React.useState(false);
      // const { t } = useTranslation();
      const resourceIdArr = [];
      row?.resources?.map((i) => {
        if (i?.createResourceId && i?.type === "user") {
          resourceIdArr.push(i?.createResourceId);
        }
      });
      const onActionSelect = (value, row) => {
        switch (value?.code) {
          case "ACTION_LABEL_UPDATE_DATES":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
                campaignId: row?.id,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${row?.id}&campaignName=${row?.campaignName}`
            );
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);
            break;
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;

          case "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${row?.id}&campaignName=${row?.campaignName}`
            );
            const nav = new PopStateEvent("popstate");
            window.dispatchEvent(nav);
            break;

          case "ACTION_LABEL_CONFIGURE_APP":
            window.navigateState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
                campaignType: row?.projectType,
              },
              "",
              `/${window.contextPath}/employee/campaign/checklist/search?name=${row?.campaignName}&campaignId=${row?.id}&projectType=${row?.projectType}`
            );
            const navEvent1 = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent1);
            break;
          case "CREATE_COPY":
            setCampaignCopying(true);
            break;
          default:
            console.log(value);
            break;
        }
      };
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_END_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_ACTIONS":
          return (
            <>
              <Button
                className="campaign-action-button"
                type="actionButton"
                variation="secondary"
                label={"Action"}
                options={[
                  ...(row?.status === "created" ? [{ key: 1, code: "ACTION_LABEL_UPDATE_DATES", i18nKey: t("ACTION_LABEL_UPDATE_DATES") }] : []),
                  { key: 2, code: "ACTION_LABEL_CONFIGURE_APP", i18nKey: t("ACTION_LABEL_CONFIGURE_APP") },
                  { key: 3, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") },
                  { key: 4, code: "CREATE_COPY", i18nKey: t("CREATE_COPY") },
                  ...(row?.status === "created"
                    ? [{ key: 1, code: "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS", i18nKey: t("ACTION_LABEL_UPDATE_BOUNDARY_DETAILS") }]
                    : []),
                ]}
                optionsKey="i18nKey"
                showBottom={true}
                isSearchable={false}
                onOptionSelect={(item) => onActionSelect(item, row)}
              />
              {timeLine && (
                <PopUp
                  type={"default"}
                  heading={t("ES_CAMPAIGN_TIMELINE")}
                  onOverlayClick={() => setTimeline(false)}
                  onClose={() => setTimeline(false)}
                >
                  <TimelineComponent campaignId={row?.id} resourceId={resourceIdArr} />
                </PopUp>
              )}
              {campainCopying && (
                <CloneCampaignWrapper campaignId={row?.id} campaignName={row?.campaignName} setCampaignCopying={setCampaignCopying} />
              )}
            </>
          );
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
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
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&draft=${true}&fetchBoundary=${true}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CM_DRAFT_TYPE":
          return value ? t("CM_UPDATE_REQUEST") : t("CM_CREATE_REQUEST");
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "LAST_MODIFIED_TIME":
          return Digit.DateUtils.ConvertEpochToDate(value);
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
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
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link
                to={`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${row.campaignNumber}&tenantId=${
                  row.tenantId
                }&draft=${true}`}
              >
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CM_DRAFT_TYPE":
          return value ? t("CM_UPDATE_REQUEST") : t("CM_CREATE_REQUEST");
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "LAST_MODIFIED_TIME":
          return Digit.DateUtils.ConvertEpochToDate(value);
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
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
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
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
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
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
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [timeLine, setTimeline] = React.useState(false);
      const resourceIdArr = [];
      row?.resources?.map((i) => {
        if (i?.createResourceId && i?.type === "user") {
          resourceIdArr.push(i?.createResourceId);
        }
      });
      const onActionSelect = (value, row) => {
        switch (value?.code) {
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;
          case "ACTION_LABEL_RETRY":
            retryCampaign(row, searchResult);
            break;
          default:
            console.log(value);
            break;
        }
      };
      switch (key) {
        case "CAMPAIGN_NAME":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "CM_DRAFT_TYPE":
          return value ? t("CM_UPDATE_REQUEST") : t("CM_CREATE_REQUEST");
        case "CAMPAIGN_LAST_UPDATE":
          return Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.lastModifiedTime);
        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_END_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_ACTIONS":
          return (
            <>
              <Button
                className="campaign-action-button"
                type="actionButton"
                variation="secondary"
                label={"Action"}
                options={[
                  { key: 1, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") },
                  // { key: 2, code: "ACTION_LABEL_RETRY", i18nKey: t("ACTION_LABEL_RETRY") }, // disabling in UI Since it is just beta functionality
                ].filter((obj) => Digit.Utils.didEmployeeHasAtleastOneRole(["SYSTEM_ADMINISTRATOR"] || obj?.key != 2))} //added retry for system adminstrator for failed campaign
                optionsKey="i18nKey"
                showBottom={true}
                isSearchable={false}
                onOptionSelect={(item) => onActionSelect(item, row)}
              />
              {timeLine && (
                <PopUp
                  type={"default"}
                  heading={t("ES_CAMPAIGN_TIMELINE")}
                  onOverlayClick={() => setTimeline(false)}
                  onClose={() => setTimeline(false)}
                >
                  <TimelineComponent campaignId={row?.id} resourceId={resourceIdArr} />
                </PopUp>
              )}
            </>
          );
        default:
          return "case_not_found";
      }
    },
    onCardClick: (obj) => {
      // return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      // return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
    },
  },
};
