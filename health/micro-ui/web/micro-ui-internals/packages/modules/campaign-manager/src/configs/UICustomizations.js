import { Link } from "react-router-dom";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Fragment } from "react";
import { Button, PopUp, Switch, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import TimelineComponent from "../components/TimelineComponent";
import getMDMSUrl from "../utils/getMDMSUrl";
//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};
const businessServiceMap = {};

const inboxModuleNameMap = {};
// const history=useHistory();



export const UICustomizations = {
  MyChecklistSearchConfig: {

    
    preProcess: (data, additionalDetails) => {

      const tenantId = Digit.ULBService.getCurrentTenantId();
      const [checklistTypeCode, setChecklistTypeCode] = useState(null);
      let checklistType = data?.state?.searchForm?.Type?.list;
      const reqCriteria = {
        url: `/localization/messages/v1/_search`,
        body:{
          tenantId: tenantId
        },
        params: {
          locale: "en_MZ",
          tenantId: tenantId,
          module: "hcm-campaignmanager"
        },
      }
      const { isLoading1, data: localization, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqCriteria);
      useEffect(()=>{
        if (localization?.messages?.length > 0) {
          let matchedItem = localization.messages.find(item => item.message === checklistType);
          // If a match is found, assign the 'code' to 'checklistcode'
          if (matchedItem) {
            let code = matchedItem.code;
            let res = code.replace("HCM_CHECKLIST_TYPE_", "");
            setChecklistTypeCode(res);
          } else {
          }
        } else {
        }
    
      }, [localization, data])

      data.body.ServiceDefinitionCriteria.code.length=0;

      let listTemp = data?.state?.searchForm?.Type?.list;
      let codeTemp = data?.state?.searchForm?.Role?.code;
      let listt = "";
      let codee = "";

      if(listTemp) listt = listTemp.toUpperCase().replace(/ /g, "_");
      if(codeTemp) codee = codeTemp.toUpperCase().replace(/ /g, "_");
      if(checklistTypeCode) listt = checklistTypeCode;
      let pay = window.history.state.name + '.' + listt + '.' + codee;

      data.body.ServiceDefinitionCriteria.code.push(pay);
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [isActive, setIsActive] = useState(row?.isActive);
      switch (key) {
        case "Checklist Role":
          return row?.additionalDetails?.role;
          break;
        case "Checklist Type":
          return row?.additionalDetails?.type;
          break;
        case "Checklist Name":
          return row?.additionalDetails?.name;
          break;
        case "Status":
          const toggle = () => {
            setIsActive(!isActive);
          };
          const switchText = isActive ? "Active" : "Inactive";
          return (
            <>
              <Switch
                isCheckedInitially={isActive ? true : false}
                label={switchText}
                onToggle={toggle} // Passing the function reference here
              />
            </>
          );
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
        const tenantId = Digit.ULBService.getCurrentTenantId();
        let res;
        const callSearch = async () => {
          const res = await Digit.CustomService.getResponse({
            url: `/boundary-service/boundary-hierarchy-definition/_search`,
                body: {
                    BoundaryTypeHierarchySearchCriteria: {
                        tenantId: tenantId,
                        limit: 2,
                        offset: 0,
                        hierarchyType: row?.hierarchyType
                  }
                }
          });
          return res;

        }
        const fun = async ()=>{
          res = await callSearch();
        }
        // fun();
        switch (key) {
          case "HIERARCHY_NAME":
            return row?.hierarchyType;
            break;
          case "LEVELS":
            return row?.boundaryHierarchy?.length
            
            return (
            (
              <>
                {/* <span data-tip data-for="dynamicTooltip">{row?.boundaryHierarchy?.length}</span>
                <ReactTooltip id="dynamicTooltip" getContent={() => tooltipContent} /> */}
                <TooltipWrapper
                  arrow={false}
                  content={res}
                  enterDelay={100}
                  leaveDelay={0}
                  placement="bottom"
                  style={{}}
                >
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
            )
            )
            break;
          case "CREATION_DATE":
            let epoch = row?.auditDetails?.createdTime;
            return Digit.DateUtils.ConvertEpochToDate(epoch);
            // return row?.auditDetails?.createdTime;
            break;
          case "ACTION":
            const tenantId = Digit.ULBService.getCurrentTenantId();
            const generateFile = async()=>{
              const res = await Digit.CustomService.getResponse({
                  url: `/project-factory/v1/data/_generate`,
                  body: {
                  },
                  params: {
                      tenantId: tenantId,
                      type: "boundaryManagement",
                      forceUpdate: true,
                      hierarchyType: row?.hierarchyType,
                      campaignId: "default"
                  }
              });
              return res;
          }
            const generateTemplate = async() => {
              const res = await Digit.CustomService.getResponse({
                  url: `/project-factory/v1/data/_download`,
                  body: {
                  },
                  params: {
                      tenantId: tenantId ,
                      type: "boundaryManagement",
                      hierarchyType: row?.hierarchyType,
                      campaignId: "default"
                  }
              });
              return res;
            }
            const downloadExcelTemplate = async() => {
              const res = await generateFile();
              const resFile = await generateTemplate();
              if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
                  // Splitting filename before .xlsx or .xls
                  const fileNameWithoutExtension = row?.hierarchyType ;
                  
                  Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid, customName: fileNameWithoutExtension });
              }
            }
            return(
              <>
                <Button
                  type={"button"}
                  size={"medium"}
                  icon={"Add"}
                  variation={"secondary"}
                  label={t("DOWNLOAD")}
                  onClick={()=>{
                    downloadExcelTemplate();
                  }}
                />
              </>
            )
        }

    },

  },
  MyCampaignConfigOngoing: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        createdBy: Digit.UserService.getUser().info.uuid,
        campaignsIncludeDates: true,
        startDate: Digit.Utils.pt.convertDateToEpoch(new Date().toISOString().split("T")[0], "daystart"),
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date().toISOString().split("T")[0]),
        pagination: {
          sortBy: "createdTime",
          sortOrder: "desc",
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl();
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
      // const { t } = useTranslation();
      const onActionSelect = (value, row) => {
        switch (value?.code) {
          case "ACTION_LABEL_UPDATE_DATES":
            window.history.pushState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${row?.id}`
            );
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);
            break;
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;
          case "ACTION_LABEL_CONFIGURE_APP":

              window.history.pushState(
                {
                  name: row?.campaignName,
                  data: row,
                  projectId: row?.projectId,
                },
                "",
                `/${window.contextPath}/employee/campaign/checklist/search?name=${row?.campaignName}&campaignId=${row?.id}`
              );
              const navEvent1 = new PopStateEvent("popstate");
              window.dispatchEvent(navEvent1);
              break;

          case "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS":
            window.history.pushState(
              {
                name: row?.campaignName,
                data: row,
              },
              "",
              `/${window.contextPath}/employee/campaign/boundary/update-campaign?key=1&parentId=${row?.id}`
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
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
          sortOrder: "desc",
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl();
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
                options={[{ key: 1, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") }]}
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
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
          sortOrder: "desc",
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl();
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
            window.history.pushState(
              {
                name: row?.campaignName,
                data: row,
                projectId: row?.projectId,
                campaignId: row?.id,
              },
              "",
              `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${row?.id}`
            );
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);
            break;
          case "ACTION_LABEL_VIEW_TIMELINE":
            setTimeline(true);
            break;

         
          case "ACTION_LABEL_UPDATE_BOUNDARY_DETAILS":
            window.history.pushState(
              {
                name: row?.campaignName,
                data: row,
              },
              "",
              `/${window.contextPath}/employee/campaign/boundary/update-campaign?key=1&parentId=${row?.id}`
            );
            const nav = new PopStateEvent("popstate");
            window.dispatchEvent(nav);
            break;

            case "ACTION_LABEL_CONFIGURE_APP":
              window.history.pushState(
                {
                  name: row?.campaignName,
                  data: row,
                  projectId: row?.projectId,
                  campaignType: row?.projectType
                },
                "",
                `/${window.contextPath}/employee/campaign/checklist/search?name=${row?.campaignName}&campaignId=${row?.id}`
              );
              const navEvent1 = new PopStateEvent("popstate");
              window.dispatchEvent(navEvent1);
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["drafted"],
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: "desc",
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl();
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

        case "CAMPAIGN_START_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);
        case "CAMPAIGN_END_DATE":
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["failed"],
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: "desc",
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
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl();
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
                options={[{ key: 1, code: "ACTION_LABEL_VIEW_TIMELINE", i18nKey: t("ACTION_LABEL_VIEW_TIMELINE") }]}
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
