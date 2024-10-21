import { Link } from "react-router-dom";
import _ from "lodash";
import React, { useState, useEffect, useRef, useCallback} from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { Fragment } from "react";
import { Button, PopUp, Switch, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import TimelineComponent from "../components/TimelineComponent";
import getMDMSUrl from "../utils/getMDMSUrl";
import { useTranslation } from "react-i18next";
import { useTranslation } from "react-i18next";
//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};
const businessServiceMap = {};

const inboxModuleNameMap = {};
// const history=useHistory();

// const 
// const [campaignName, setCampaignName] = useState(null);
const rowDataCache = {};
const apiCache = {};

// // Batch API request function
// const batchFetchServiceDefinitions = async (serviceCodes, tenantId) => {
//   try {
//     const res = await Digit.CustomService.getResponse({
//       url: "/service-request/service/definition/v1/_search",
//       params: {},
//       body: {
//         ServiceDefinitionCriteria: {
//           "tenantId": tenantId,
//           "code": serviceCodes
//         },
//         includeDeleted: true
//       },
//     });
//     return res;
//   } catch (error) {
//     console.error("Error fetching batch data:", error);
//     return null;
//   }
// };


export const UICustomizations = {
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
      data.params.limit = 5;
      data.params.offset = 0;

      // if (additionalDetails?.campaignName) setCampaignName(additionalDetails?.campaignName);
      return data;
    },


    additionalCustomizations: (row, key, column, value, searchResult) => {
      console.log("the row is", row);
      const { t } = useTranslation();
      const history = useHistory();
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const campaignName = searchParams.get("name");
      const tenantId = Digit.ULBService.getCurrentTenantId();
  
      const cl_code = row?.data?.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
      const role_code = row?.data?.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
      const serviceCode = `${campaignName}.${cl_code}.${role_code}`;
  
      // Check if we've already processed this row
      if (!rowDataCache[serviceCode]) {
        rowDataCache[serviceCode] = {
          isLoading: true,
          isActive: false,
          attributes: null,
          fetchPromise: null
        };
  
        const fetchData = async () => {
          if (apiCache[serviceCode]) {
            return apiCache[serviceCode];
          }
  
          try {
            const res = await Digit.CustomService.getResponse({
              url: "/service-request/service/definition/v1/_search",
              params: {},
              body: {
                ServiceDefinitionCriteria: {
                  "tenantId": tenantId,
                  "code": [serviceCode]
                },
                includeDeleted: true
              },
            });
            apiCache[serviceCode] = res;
            return res;
          } catch (error) {
            // console.error("Error fetching data:", error);
            return null;
  
      const cl_code = row?.data?.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
      const role_code = row?.data?.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
      const serviceCode = `${campaignName}.${cl_code}.${role_code}`;
  
      // Check if we've already processed this row
      if (!rowDataCache[serviceCode]) {
        rowDataCache[serviceCode] = {
          isLoading: true,
          isActive: false,
          attributes: null,
          fetchPromise: null
        };
  
        const fetchData = async () => {
          if (apiCache[serviceCode]) {
            return apiCache[serviceCode];
          }
  
          try {
            const res = await Digit.CustomService.getResponse({
              url: "/service-request/service/definition/v1/_search",
              params: {},
              body: {
                ServiceDefinitionCriteria: {
                  "tenantId": tenantId,
                  "code": [serviceCode]
                },
                includeDeleted: true
              },
            });
            apiCache[serviceCode] = res;
            return res;
          } catch (error) {
            // console.error("Error fetching data:", error);
            return null;
          }
        };
  
        // Start the fetch if it hasn't been started yet
        if (!rowDataCache[serviceCode].fetchPromise) {
          rowDataCache[serviceCode].fetchPromise = fetchData().then(res => {
            if (res?.ServiceDefinitions?.[0]) {
              rowDataCache[serviceCode].attributes = res.ServiceDefinitions[0].attributes;
              rowDataCache[serviceCode].isActive = res.ServiceDefinitions[0].isActive;
            }
            rowDataCache[serviceCode].isLoading = false;
          });
        }
      }
  
      // If data is still loading, return a loading indicator
      if (rowDataCache[serviceCode].isLoading) {
        return <div>Loading...</div>;
      }
  
      // Ensure the fetch has completed
      rowDataCache[serviceCode].fetchPromise?.then(() => {
        // This will trigger a re-render once the data is available
      });
  
      const updateServiceDefinition = async (newStatus) => {
        try {
          const res = await Digit.CustomService.getResponse({
            url: "/service-request/service/definition/v1/_update",
            body: {
              ServiceDefinition: {
                "tenantId": tenantId,
                "code": serviceCode,
                "isActive": newStatus
              },
            },
          });
          if (res) {
            rowDataCache[serviceCode].isActive = newStatus;
            if (apiCache[serviceCode]) {
              apiCache[serviceCode].ServiceDefinitions[0].isActive = newStatus;
            }
          }
          return res;
        } catch (error) {
          // console.error("Error updating service definition:", error);
          return null;
        }
      };
  
        };
  
        // Start the fetch if it hasn't been started yet
        if (!rowDataCache[serviceCode].fetchPromise) {
          rowDataCache[serviceCode].fetchPromise = fetchData().then(res => {
            if (res?.ServiceDefinitions?.[0]) {
              rowDataCache[serviceCode].attributes = res.ServiceDefinitions[0].attributes;
              rowDataCache[serviceCode].isActive = res.ServiceDefinitions[0].isActive;
            }
            rowDataCache[serviceCode].isLoading = false;
          });
        }
      }
  
      // If data is still loading, return a loading indicator
      if (rowDataCache[serviceCode].isLoading) {
        return <div>Loading...</div>;
      }
  
      // Ensure the fetch has completed
      rowDataCache[serviceCode].fetchPromise?.then(() => {
        // This will trigger a re-render once the data is available
      });
  
      const updateServiceDefinition = async (newStatus) => {
        try {
          const res = await Digit.CustomService.getResponse({
            url: "/service-request/service/definition/v1/_update",
            body: {
              ServiceDefinition: {
                "tenantId": tenantId,
                "code": serviceCode,
                "isActive": newStatus
              },
            },
          });
          if (res) {
            rowDataCache[serviceCode].isActive = newStatus;
            if (apiCache[serviceCode]) {
              apiCache[serviceCode].ServiceDefinitions[0].isActive = newStatus;
            }
          }
          return res;
        } catch (error) {
          // console.error("Error updating service definition:", error);
          return null;
        }
      };
  
      switch (key) {
        case "CHECKLIST_ROLE":
          let str = row?.data?.role;
          if (!str.startsWith("ACCESSCONTROL_ROLES_ROLES_")) {
            str = "ACCESSCONTROL_ROLES_ROLES_" + str;
          }
          return t(str);
        case "CHECKLIST_TYPE":
          let str1 = row?.data?.checklistType;
          if (!str1.startsWith("HCM_CHECKLIST_TYPE_")) {
            str1 = "HCM_CHECKLIST_TYPE_" + str1;
          }
          return t(str1);
          case "STATUS":
            const [localIsActive, setLocalIsActive] = useState(rowDataCache[serviceCode].isActive);
            
            const toggle = async () => {
              const newStatus = !localIsActive;
              const res = await updateServiceDefinition(newStatus);
              if (res) {
                rowDataCache[serviceCode].isActive = newStatus;
                setLocalIsActive(newStatus);
              }
            };
            
            const switchText = localIsActive ? "Active" : "Inactive";
            return (
        case "CHECKLIST_ROLE":
          let str = row?.data?.role;
          if (!str.startsWith("ACCESSCONTROL_ROLES_ROLES_")) {
            str = "ACCESSCONTROL_ROLES_ROLES_" + str;
          }
          return t(str);
        case "CHECKLIST_TYPE":
          let str1 = row?.data?.checklistType;
          if (!str1.startsWith("HCM_CHECKLIST_TYPE_")) {
            str1 = "HCM_CHECKLIST_TYPE_" + str1;
          }
          return t(str1);
          case "STATUS":
            const [localIsActive, setLocalIsActive] = useState(rowDataCache[serviceCode].isActive);
            
            const toggle = async () => {
              const newStatus = !localIsActive;
              const res = await updateServiceDefinition(newStatus);
              if (res) {
                rowDataCache[serviceCode].isActive = newStatus;
                setLocalIsActive(newStatus);
              }
            };
            
            const switchText = localIsActive ? "Active" : "Inactive";
            return (
              <Switch
                isCheckedInitially={localIsActive}
                isCheckedInitially={localIsActive}
                label={switchText}
                onToggle={toggle}
              />
            );
        case "ACTION":
          if (rowDataCache[serviceCode].attributes) {
            return (
              <Button
                type="button"
                size="medium"
                icon="View"
                variation="secondary"
                label={t("VIEW")}
                onClick={() => {
                  history.push(`/${window.contextPath}/employee/campaign/checklist/view?campaignName=${campaignName}&role=${role_code}&checklistType=${cl_code}`)
                }}
              />
            );
          } else {
            return (
              <Button
                type="button"
                size="medium"
                icon="View"
                variation="secondary"
                label={t("CREATE")}
                onClick={() => {
                  history.push(`/${window.contextPath}/employee/campaign/checklist/create?campaignName=${campaignName}&role=${role_code}&checklistType=${cl_code}`)
                }}
              />
            );
          }
        default:
          return value;
      }
    },

    // additionalCustomizations: (row, key, column, value, searchResult) => {
    //   const { t } = useTranslation();
    //   const history = useHistory();
    //   const location = useLocation();
    //   const searchParams = new URLSearchParams(location.search);
    //   const campaignName = searchParams.get("name");
    //   const tenantId = Digit.ULBService.getCurrentTenantId();

    //   const cl_code = row?.data?.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
    //   const role_code = row?.data?.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
    //   const serviceCode = `${campaignName}.${cl_code}.${role_code}`;

    //   const [serviceData, setServiceData] = useState(() => 
    //     apiCache[serviceCode] || { isLoading: true, isActive: false, attributes: null }
    //   );

    //   const fetchServiceDefinition = useCallback(async () => {
    //     if (apiCache[serviceCode] && !apiCache[serviceCode].isLoading) {
    //       return apiCache[serviceCode];
    //     }

    //     try {
    //       const res = await Digit.CustomService.getResponse({
    //         url: "/service-request/service/definition/v1/_search",
    //         params: {},
    //         body: {
    //           ServiceDefinitionCriteria: {
    //             "tenantId": tenantId,
    //             "code": [serviceCode]
    //           },
    //           includeDeleted: true
    //         },
    //       });

    //       const newData = res?.ServiceDefinitions?.[0] 
    //         ? { 
    //             isLoading: false, 
    //             isActive: res.ServiceDefinitions[0].isActive, 
    //             attributes: res.ServiceDefinitions[0].attributes 
    //           }
    //         : { isLoading: false, isActive: false, attributes: null };

    //       apiCache[serviceCode] = newData;
    //       return newData;
    //     } catch (error) {
    //       console.error("Error fetching service definition:", error);
    //       apiCache[serviceCode] = { isLoading: false, isActive: false, attributes: null, error: true };
    //       return apiCache[serviceCode];
    //     }
    //   }, [serviceCode, tenantId]);

    //   useEffect(() => {
    //     if (serviceData.isLoading) {
    //       fetchServiceDefinition().then(setServiceData);
    //     }
    //   }, [fetchServiceDefinition, serviceData.isLoading]);

    //   const updateServiceDefinition = async (newStatus) => {
    //     try {
    //       const res = await Digit.CustomService.getResponse({
    //         url: "/service-request/service/definition/v1/_update",
    //         body: {
    //           ServiceDefinition: {
    //             "tenantId": tenantId,
    //             "code": serviceCode,
    //             "isActive": newStatus
    //           },
    //         },
    //       });
    //       if (res) {
    //         const updatedData = { ...apiCache[serviceCode], isActive: newStatus };
    //         apiCache[serviceCode] = updatedData;
    //         setServiceData(updatedData);
    //       }
    //       return res;
    //     } catch (error) {
    //       console.error("Error updating service definition:", error);
    //       return null;
    //     }
    //   };

    //   if (serviceData.isLoading) {
    //     return <div>Loading...</div>;
    //   }

    //   if (serviceData.error) {
    //     return <div>Error loading data</div>;
    //   }

    //   switch (key) {
    //     case "CHECKLIST_ROLE":
    //       let str = row?.data?.role;
    //       if (!str.startsWith("ACCESSCONTROL_ROLES_ROLES_")) {
    //         str = "ACCESSCONTROL_ROLES_ROLES_" + str;
    //       }
    //       return t(str);
    //     case "CHECKLIST_TYPE":
    //       let str1 = row?.data?.checklistType;
    //       if (!str1.startsWith("HCM_CHECKLIST_TYPE_")) {
    //         str1 = "HCM_CHECKLIST_TYPE_" + str1;
    //       }
    //       return t(str1);
    //     case "STATUS":
    //       return (
    //         <Switch
    //           isCheckedInitially={serviceData.isActive}
    //           label={serviceData.isActive ? "Active" : "Inactive"}
    //           onToggle={() => updateServiceDefinition(!serviceData.isActive)}
    //         />
    //       );
    //     case "ACTION":
    //       return (
    //         <Button
    //           type="button"
    //           size="medium"
    //           icon="View"
    //           variation="secondary"
    //           label={t(serviceData.attributes ? "VIEW" : "CREATE")}
    //           onClick={() => {
    //             const path = serviceData.attributes ? 'view' : 'create';
    //             history.push(`/${window.contextPath}/employee/campaign/checklist/${path}?campaignName=${campaignName}&role=${role_code}&checklistType=${cl_code}`);
    //           }}
    //         />
    //       );
    //     default:
    //       return value;
    //   }
    // },
    // additionalCustomizations: (row, key, column, value, searchResult) => {
    //   const serviceData = row.serviceDefinition;
  
    //   switch (key) {
    //     case "CHECKLIST_ROLE":
    //       return t(row.role);
    //     case "CHECKLIST_TYPE":
    //       return t(row.checklistType);
    //     case "STATUS":
    //       return (
    //         <Switch
    //           isCheckedInitially={serviceData.isActive}
    //           label={serviceData.isActive ? "Active" : "Inactive"}
    //           onToggle={() => updateServiceDefinition(row.serviceCode, !serviceData.isActive)}
    //         />
    //       );
    //     case "ACTION":
    //       return (
    //         <Button
    //           type="button"
    //           size="medium"
    //           icon="View"
    //           variation="secondary"
    //           label={t(serviceData.attributes ? "VIEW" : "CREATE")}
    //           onClick={() => {
    //             const path = serviceData.attributes ? 'view' : 'create';
    //             history.push(`/${window.contextPath}/employee/campaign/checklist/${path}?campaignName=${campaignName}&role=${row.role}&checklistType=${row.checklistType}`);
    //           }}
    //         />
    //       );
    //     default:
    //       return value;
    //   }
    // }
  
    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading data</div>;
    
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
      const fun = async () => {
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
      }
      const fun = async () => {
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
          const generateFile = async () => {
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
          )
          break;
        case "CREATION_DATE":
          let epoch = row?.auditDetails?.createdTime;
          return Digit.DateUtils.ConvertEpochToDate(epoch);
          // return row?.auditDetails?.createdTime;
          break;
        case "ACTION":
          const tenantId = Digit.ULBService.getCurrentTenantId();
          const generateFile = async () => {
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
          const generateTemplate = async () => {
            const res = await Digit.CustomService.getResponse({
              url: `/project-factory/v1/data/_download`,
              body: {
              },
              params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                hierarchyType: row?.hierarchyType,
                campaignId: "default"
              }
            });
            return res;
          }
          const downloadExcelTemplate = async () => {
            const res = await generateFile();
            const resFile = await generateTemplate();
            if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
              // Splitting filename before .xlsx or .xls
              const fileNameWithoutExtension = row?.hierarchyType;

              Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid, customName: fileNameWithoutExtension });
            }
          }
          return (
            <>
              <Button
                type={"button"}
                size={"medium"}
                icon={"Add"}
                variation={"secondary"}
                label={t("DOWNLOAD")}
                onClick={() => {
                  downloadExcelTemplate();
                }}
              />
            </>
          )
      }
          const generateTemplate = async () => {
            const res = await Digit.CustomService.getResponse({
              url: `/project-factory/v1/data/_download`,
              body: {
              },
              params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                hierarchyType: row?.hierarchyType,
                campaignId: "default"
              }
            });
            return res;
          }
          const downloadExcelTemplate = async () => {
            const res = await generateFile();
            const resFile = await generateTemplate();
            if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
              // Splitting filename before .xlsx or .xls
              const fileNameWithoutExtension = row?.hierarchyType;

              Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid, customName: fileNameWithoutExtension });
            }
          }
          return (
            <>
              <Button
                type={"button"}
                size={"medium"}
                icon={"Add"}
                variation={"secondary"}
                label={t("DOWNLOAD")}
                onClick={() => {
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
              `/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${row?.id}`
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
              `/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${row?.id}`
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
