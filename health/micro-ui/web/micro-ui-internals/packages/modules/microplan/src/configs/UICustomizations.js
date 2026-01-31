import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import React, { useState, Fragment } from "react";
import { Button as ButtonNew, Dropdown,Toast } from "@egovernments/digit-ui-components";
import { DeleteIconv2, DownloadIcon, FileIcon, Button, Card, CardSubHeader, EditIcon, ArrowForward } from "@egovernments/digit-ui-react-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

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
        obj[key] === "" || // Check for empty string
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export const UICustomizations = {
  MyMicroplanSearchConfigPlan: {
    test: "yes",
  },
  FacilityMappingConfigPlan: {
    test: "yes",
  },
  UserManagementConfigPlan: {
    test: "yes",
  },
  MyMicroplanSearchConfigOverridePlan: {
    test: "yes",
  },
  MicroplanSearchConfig: {
    preProcess: (data, additionalDetails) => {
      const { name, status } = data?.state?.searchForm || {};
      data.body.PlanConfigurationSearchCriteria = {};
      data.body.PlanConfigurationSearchCriteria.limit = data?.state?.tableForm?.limit;
      // data.body.PlanConfigurationSearchCriteria.limit = 10
      data.body.PlanConfigurationSearchCriteria.offset = data?.state?.tableForm?.offset;
      data.body.PlanConfigurationSearchCriteria.name = name;
      data.body.PlanConfigurationSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.PlanConfigurationSearchCriteria.userUuid = Digit.UserService.getUser().info.uuid;
      // delete data.body.PlanConfigurationSearchCriteria.pagination
      data.body.PlanConfigurationSearchCriteria.status = status?.status;
      data.body.PlanConfigurationSearchCriteria.name = data?.state?.searchForm?.microplanName;
      cleanObject(data.body.PlanConfigurationSearchCriteria);

      const dic = {
        0: null,
        1: ["DRAFT"],
        2: ["EXECUTION_TO_BE_DONE"],
        3: ["CENSUS_DATA_APPROVAL_IN_PROGRESS", "CENSUS_DATA_APPROVED", "RESOURCE_ESTIMATION_IN_PROGRESS"],
        4: ["RESOURCE_ESTIMATIONS_APPROVED"],
      };
      const url = Digit.Hooks.useQueryParams();

      const tabId = url.tabId || "0"; // Default to '0' if tabId is undefined
      data.body.PlanConfigurationSearchCriteria.status = dic[String(tabId)];
      cleanObject(data.body.PlanConfigurationSearchCriteria);
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [showToast, setShowToast] = useState(false);
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const microplanId = row?.id;

      const { data: rootEstimationApprover } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId: tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId: tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_PLAN_ESTIMATION_APPROVER"],
            active: true,
          },
        },
        config: {
          enabled: true,
        },
      });

      const { data: rootPopulationApprover } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_POPULATION_DATA_APPROVER"],
            active: true,
          },
        },
        config: { enabled: true },
      });

      const { data: rootFacilityMapper } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_FACILITY_CATCHMENT_MAPPER"],
            active: true,
          },
        },
        config: { enabled: true },
      });

      switch (key) {
        case "ACTIONS":
          // TODO : Replace dummy file id with real file id when API is ready
          const dummyFile = "c22a7676-d5d7-49b6-bcdb-83e9519f58df"
          const microplanFileId = row?.campaignDetails?.additionalDetails?.microplanFileId || dummyFile;
          const EstimationsfileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
          let options = [];

          if (row?.status == "DRAFT") {
            options = [
              { code: "1", name: "MP_ACTIONS_EDIT_SETUP" },
              { code: "2", name: "MP_ACTIONS_DOWNLOAD_DRAFT" },
              { code: "3", name: "MP_ACTIONS_FREEZE_MICROPLAN" },
            ];
          } else {
            options = [{ code: "1", name: "MP_ACTIONS_VIEW_SUMMARY" }];
          }

          const handleDownload = ({ type }) => {
            const template = type === "Estimations" ? "Estimations" : "DraftComplete";
            const fileId = row?.files.find((item) => item.templateIdentifier === template)?.filestoreId;
            if (!fileId) {
              setShowToast({ label: t("NO_DRAFT_FILE_FOUND") });
              return;
            }
            const campaignName = row?.name || "";
            const customName = type === "Estimations" ? campaignName : `${campaignName}_DRAFT`;
            Digit.Utils.campaign.downloadExcelWithCustomName({
              fileStoreId: fileId,
              customName: customName,
            });
          };

          const onActionSelect = async (e, row) => {
            if (e.name === "MP_ACTIONS_EDIT_SETUP") {
              const key = parseInt(row?.additionalDetails?.key);
              const resolvedKey = key === 8 ? 7 : key === 10 ? 11 : key || 2;
              const url = `/${window.contextPath}/employee/microplan/setup-microplan?key=${resolvedKey}&microplanId=${row.id}&campaignId=${row.campaignDetails.id}`;
              window.location.href = url;
            }
            if (e.name === "MP_ACTIONS_DOWNLOAD_DRAFT") {
              if (row?.status == "DRAFT" && row?.assumptions.length > 0 && row?.operations.length > 0) {
                handleDownload({ type: "Draft" });
              } else {
                setShowToast({ label: t("PLEASE_UPDATE_THE_SETUP_INFORMATION_BEFORE_DOWNLOADING_DRAFT") });
              }
            }
            if (e.name === "MP_ACTIONS_FREEZE_MICROPLAN") {
              if (
                row?.status == "DRAFT" &&
                row?.assumptions.length > 0 &&
                row?.operations.length > 0 &&
                rootEstimationApprover?.data?.length > 0 &&
                rootPopulationApprover?.data?.length > 0 &&
                rootFacilityMapper?.data?.length > 0
              ) {
                const triggeredFromMain = "OPEN_MICROPLANS";
                const response = await Digit.Hooks.microplanv1.useCompleteSetUpFlow({
                  tenantId,
                  microplanId,
                  triggeredFrom: triggeredFromMain,
                });
                if (response && !response?.isError) {
                  window.history.pushState(response?.state, "", response?.redirectTo);
                  window.dispatchEvent(new PopStateEvent("popstate", { state: response?.state }));
                }
                if (response && response?.isError) {
                  console.error(`ERR_FAILED_TO_COMPLETE_SETUP`);
                }
              } else {
                setShowToast({ label: t("PLEASE_FINISH_THE_DRAFT_BEFORE_FREEZING") });
              }
            }
            if (e.name == "MP_ACTIONS_VIEW_SUMMARY") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&microplanId=${row.id}&campaignId=${
                row.campaignDetails.id
              }&setup-completed=true`;
            }
          };
          const handleToast = () => {
            setShowToast(false);
          };

          return (
            <div>
              {microplanFileId && row?.status == "RESOURCE_ESTIMATIONS_APPROVED" ? (
                <div>
                  <ButtonNew style={{ width: "20rem" }} icon="DownloadIcon" onClick={handleDownload} label={t("WBH_DOWNLOAD_MICROPLAN")} title={t("WBH_DOWNLOAD_MICROPLAN")}  />
                </div>
              ) : (
                <div className={"action-button-open-microplan"}>
                  <div style={{ position: "relative" }}>
                    <ButtonNew
                      type="actionButton"
                      variation="secondary"
                      label={t("MP_ACTIONS_FOR_MICROPLAN_SEARCH")}
                      title={t("MP_ACTIONS_FOR_MICROPLAN_SEARCH")}
                      options={options}
                      style={{ width: "20rem" }}
                      optionsKey="name"
                      showBottom={true}
                      isSearchable={false}
                      onOptionSelect={(item) => onActionSelect(item)}
                    />
                  </div>
                </div>
              )}
            </div>
          );

        case "NAME_OF_MICROPLAN":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
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

        case "MICROPLAN_STATUS":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_STATUS_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "CAMPAIGN_DISEASE":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISEASE_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "CAMPAIGN_TYPE":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_TYPE_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "DISTIRBUTION_STRATEGY":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISTRIBUTION_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        default:
          return null; // Handle any unexpected keys here if needed
      }
    },
  },
  MyMicroplanSearchConfig: {
    preProcess: (data, additionalDetails) => {
      const { name, status } = data?.state?.searchForm || {};

      data.body.PlanConfigurationSearchCriteria = {};
      data.body.PlanConfigurationSearchCriteria.limit = data?.state?.tableForm?.limit;
      // data.body.PlanConfigurationSearchCriteria.limit = 10
      data.body.PlanConfigurationSearchCriteria.offset = data?.state?.tableForm?.offset;
      data.body.PlanConfigurationSearchCriteria.name = name;
      data.body.PlanConfigurationSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.PlanConfigurationSearchCriteria.userUuid = Digit.UserService.getUser().info.uuid;
      // delete data.body.PlanConfigurationSearchCriteria.pagination
      data.body.PlanConfigurationSearchCriteria.status = status?.status;
      data.body.PlanConfigurationSearchCriteria.name = data?.state?.searchForm?.microplanName;
      cleanObject(data.body.PlanConfigurationSearchCriteria);

      const dic = {
        0: [
          "EXECUTION_TO_BE_DONE",
          "CENSUS_DATA_APPROVAL_IN_PROGRESS",
          "CENSUS_DATA_APPROVED",
          "RESOURCE_ESTIMATION_IN_PROGRESS",
          "RESOURCE_ESTIMATIONS_APPROVED",
        ],
        1: ["EXECUTION_TO_BE_DONE"],
        2: ["CENSUS_DATA_APPROVAL_IN_PROGRESS", "CENSUS_DATA_APPROVED", "RESOURCE_ESTIMATION_IN_PROGRESS"],
        3: ["RESOURCE_ESTIMATIONS_APPROVED"],
      };
      const url = Digit.Hooks.useQueryParams();

      const tabId = url.tabId || "0"; // Default to '0' if tabId is undefined
      data.body.PlanConfigurationSearchCriteria.status = dic[String(tabId)];
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const rolesCodes = Digit.Hooks.useSessionStorage("User", {})[0]?.info?.roles;
      const roles = rolesCodes.map((item) => item.code);
      const hasRequiredRole = roles.some((role) => role === "ROOT_POPULATION_DATA_APPROVER" || role === "POPULATION_DATA_APPROVER");
      const EstimationsfileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
      const handleFileDownload=()=>{
        const fileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
        if (!fileId) {
              console.error("Estimation template file not found");
              return;
            }
        const campaignName = row?.name || "";
        Digit.Utils.campaign.downloadExcelWithCustomName({
          fileStoreId: fileId,
          customName: campaignName
        });

      }
      switch (key) {
        case "ACTIONS":
          const onActionSelect = (key, row) => {
            switch (key) {
              case "START":
                window.history.pushState(
                  {
                    microplanId: row?.id,
                    campaignId: row?.campaignId,
                  },
                  "",
                  `/${window.contextPath}/employee/microplan/select-activity?microplanId=${row?.id}&campaignId=${row?.campaignId}`
                );
                const navEvent = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent);
                break;
              case "EDIT":
                window.history.pushState(
                  {
                    microplanId: row?.id,
                    campaignId: row?.campaignId,
                  },
                  "",
                  `/${window.contextPath}/employee/microplan/select-activity?microplanId=${row?.id}&campaignId=${row?.campaignId}`
                );
                const navEvent2 = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent2);
                break;
              case "DOWNLOAD":
                handleFileDownload();
                break;

              default:
                console.log(value);
                break;
            }
          };
          const onOptionSelect = (option) => {
            const key = option.code;
            switch (key) {
              case t("VIEW_AUDIT_LOGS"):
                window.history.pushState(
                  {
                    microplanId: row?.id,
                    campaignId: row?.campaignId,
                  },
                  "",
                  `/${window.contextPath}/employee/microplan/select-activity?microplanId=${row?.id}&campaignId=${row?.campaignId}`
                );
                const navEvent2 = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent2);
                break;
              case t("WBH_DOWNLOAD_MICROPLAN"):
                handleFileDownload();
                break;
              default:
                break;
            }
          };
          return row.status === "EXECUTION_TO_BE_DONE" ? (
            <ButtonNew
              label={t("START")}
              title={t("START")}
              variation="primary"
              icon={"ArrowForward"}
              type="button"
              style={{ width: "290px" }}
              isSuffix={true}
              isDisabled={!hasRequiredRole}
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("START", row)}
            />
          ) : row.status === "RESOURCE_ESTIMATIONS_APPROVED" ? (
            <ButtonNew
            isSearchable={false}
            title={t("MP_ACTIONS_FOR_MICROPLANS")}
            label={t("MP_ACTIONS_FOR_MICROPLANS")}
            isDisabled={!EstimationsfileId}
            onClick={() => {}}
            variation="primary"
            onOptionSelect={(option) => onOptionSelect(option)} 
            options={[
              {
                code: t("WBH_DOWNLOAD_MICROPLAN"),
                name: t("WBH_DOWNLOAD_MICROPLAN"),
                icon: "FileDownload"
              },
              {
                code: t("VIEW_AUDIT_LOGS"),
                name: t("VIEW_AUDIT_LOGS")
              },
            ]}
            optionsKey="name"
            showBottom={true}
            style={{ width: "290px" }}
            type="actionButton"
            className="my-microplans-action-button"
          />
          ) : (
            <ButtonNew
              label={t("WBH_EDIT")}
              title={t("WBH_EDIT")}
              variation="primary"
              icon={"Edit"}
              style={{ width: "290px" }}
              type="button"
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("EDIT", row)}
            />
          );
        case "NAME_OF_MICROPLAN":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "CAMPAIGN_DISEASE":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISEASE_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "CAMPAIGN_TYPE":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_TYPE_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "DISTIRBUTION_STRATEGY":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISTRIBUTION_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "MICROPLAN_STATUS":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_STATUS_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }
        default:
          return t("ES_COMMON_NA");
      }
    },
  },

  UserManagementConfig: {
    customValidationCheck: (data) => {
      const { phone } = data;
      const mobileRegex = /^[0-9]{10}$/;

      // Allow empty mobile number
      if (!phone || phone.trim() === "") {
        return false;
      }

      // Check if phone matches the regex
      if (!mobileRegex.test(phone)) {
        return { error: true, label: "INVALID_MOBILE_NUMBER" }; // Return an error message if invalid
      }

      return false;
    },

    preProcess: (data, additionalDetails) => {
      const { phone, name } = data?.state?.searchForm || {};
      const { sortOrder } = data?.state?.filterForm || {};
      let { roleschosen } = data?.state?.filterForm || [];

      if (!roleschosen) {
        roleschosen = {};
      }
      if (Object.keys(roleschosen).length === 0) {
        for (const obj of additionalDetails["microplanData"]) {
          roleschosen[obj["roleCode"]] = true;
        }
      }

      let rolesString = "";
      if (roleschosen) {
        rolesString = Object.keys(roleschosen)
          .filter((role) => roleschosen[role] === true)
          .join(",");
      }

      data.params.names = name;
      data.params.sortOrder = "DESC";
      data.params.sortBy = "lastModifiedTime";

      data.params.phone = phone;

      data.params.roles = rolesString;
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      cleanObject(data.params);
      delete data.params.roleschosen;
      delete data.params.name;

      return data;
    },

    rolesForFilter: (props) => {
      const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      return {
        params: {},
        url: `/${mdms_context_path}/v2/_search`, //mdms fetch from

        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            filters: {},
            schemaCode: "hcm-microplanning.rolesForMicroplan",
            limit: 10,
            offset: 0,
          },
        },
        config: {
          enabled: true,
          select: (data) => {
            const roles = data?.mdms.map((item) => {
              return {
                roleCode: item.data.roleCode,
                i18nKey: Digit.Utils.locale.getTransformedLocale(`MP_ROLE_${item.data.roleCode}`),
                // orderNumber: item.data.orderNumber

                // roleCode:{labelKey:item.data.roleCode}
              };
            });

            return roles;
          },
        },
        // changeQueryName:"setPlantUsersInboxDropdown"
      };
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if (key === "MP_USER_MANAGEMENT_ROLE") {
        return (
          <div>
            {value.map((item, index) => (
              <span key={index} className="dm-code">
                {t(`MP_ROLE_${item.code}`)}
                {index < value.length - 1 && ", "}
              </span>
            ))}
          </div>
        );
      }
    },
  },
  FacilityMappingConfig: {
    preProcess: (data) => {
      return data;
    },
    getFacilitySearchRequest: (prop) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const { campaignId } = Digit.Hooks.useQueryParams();
      return {
        url: `/project-factory/v1/project-type/search`,
        params: {},
        body: {
          CampaignDetails: {
            "tenantId": tenantId,
            "ids": [
              campaignId
            ]
          }
        },
        changeQueryName: `boundarySearchForPlanFacility`,
        config: {
          enabled: true,
          select: (data) => {
            const result = data?.CampaignDetails?.[0]?.boundaries?.filter((item) => item.type == prop.lowestHierarchy) || [];
            return result
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [showPopup, setShowPopup] = useState(false);
      const [showMapPopup, setShowMapPopup] = useState(false);
      const FacilityPopUp = Digit.ComponentRegistryService.getComponent("FacilityPopup");
      const MapViewPopup = Digit.ComponentRegistryService.getComponent("MapViewPopup");
      const VillageHierarchyTooltipWrapper = Digit.ComponentRegistryService.getComponent("VillageHierarchyTooltipWrapper");
      const [refreshKey, setRefreshKey, clearRefreshKey] = Digit.Hooks.useSessionStorage("FACILITY_POPUP_KEY", 0);

      switch (key) {
        case `MICROPLAN_FACILITY_${column?.projectType}_CAPACITY`:
          if (row?.additionalDetails?.capacity || row?.additionalDetails?.capacity === 0) {
            return row?.additionalDetails?.capacity;
          }
          return t("NA");
        case "MICROPLAN_FACILITY_SERVINGPOPULATION":
          return row?.additionalDetails?.servingPopulation;
        case "MICROPLAN_FACILITY_RESIDINGVILLAGE":
          return <div style={{ display: "flex", gap: ".5rem" }}>
            {t(row?.residingBoundary)}
            <VillageHierarchyTooltipWrapper boundaryCode={row?.residingBoundary} />
          </div>
        case "MICROPLAN_FACILITY_ASSIGNED_VILLAGES":
          const assignedVillages = row?.serviceBoundaries;
          return assignedVillages ? assignedVillages.length : null;
        case "HCM_MICROPLAN_FACILITY_VIEW_ASSIGNMENT":
        case "HCM_MICROPLAN_FACILITY_ACTION_ASSIGNMENT":
          return (
            <>
              <ButtonNew
                className=""
                icon="ArrowForward"
                iconFill=""
                isSuffix
                title={t(key)}
                label={t(key)}
                onClick={() => {setShowPopup(true);}}
                // removed this because due to popup crashing on dev
                // onClick={() => console.log("temp action")}
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                variation="primary"
              />
              {showPopup && (
                <FacilityPopUp
                  detail={row}
                  onClose={() => {
                    setShowPopup(false);
                    setRefreshKey(prev => prev + 1);
                    window.dispatchEvent(new Event("refreshKeyUpdated"));
                  }}
                />
              )}
            </>
          );
        case "VIEW_ON_MAP":
          return (
            <>
              <ButtonNew
                className=""
                icon="MyLocation"
                iconFill=""
                isSuffix
                title={t(key)}
                label={t(key)}
                onClick={() => {
                  setShowMapPopup(true);
                }}
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                variation="link"
              />
              {showMapPopup && (
                <MapViewPopup
                  type={"Facility"}
                  bounds={{ latitude: row?.additionalDetails?.latitude, longitude: row?.additionalDetails?.longitude }}
                  heading={row?.facilityName}
                  setShowPopup={setShowMapPopup}
                />
              )}
            </>
          );
        default:
          return null;
      }
    },
  },
};
