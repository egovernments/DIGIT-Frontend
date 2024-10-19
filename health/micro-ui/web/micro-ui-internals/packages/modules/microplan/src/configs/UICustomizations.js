import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import React,{useState,Fragment} from "react";
import { Button as ButtonNew} from "@egovernments/digit-ui-components";
import { Dropdown} from "@egovernments/digit-ui-components";
import { DeleteIconv2, DownloadIcon, FileIcon, Button, Card, CardSubHeader,EditIcon,ArrowForward } from "@egovernments/digit-ui-react-components";
import FacilityPopUp from "../components/FacilityPopup";

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
  MyMicroplanSearchConfigPlan:{
    test:"yes"
  },
  FacilityMappingConfigPlan:{
    test:"yes"
  },
  UserManagementConfigPlan:{
    test:"yes"
  },
  MyMicroplanSearchConfigOverridePlan:{
    test:"yes"
  },
  MyMicroplanSearchConfigOverridePlan:{
    test:"yes"
  },
  MyMicroplanSearchConfigOverridePlan:{
    test:"yes"
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
      if (key === "Actions") {
        // `/${window.contextPath}/employee/microplan/setup-microplan?key=${9}&preview=${true}&action=${false}`
        return (
          <Dropdown
            option={[
              { code: "1", name: "Edit Setup" },
              { code: "2", name: "View Summary" },
              { code: "3", name: "ACTIVITY" },

            ]}
            select={(e) => {
              console.log(e, "event"); // e contains the selected option
              if (e.code === "1") {
                // Use window.location.href to navigate
                window.location.href = `/${
                  window.contextPath
                }/employee/microplan/setup-microplan?key=${1}&preview=${true}&action=${false}&microplanId=${row.id}&campaignId=${
                  row.CampaignDetails.id
                }`;
              }
              if (e.code === "2") {
                // Use window.location.href to navigate
                window.location.href = `/${
                  window.contextPath
                }/employee/microplan/setup-microplan?key=${9}&preview=${true}&action=${false}&microplanId=${row.id}&campaignId=${
                  row.CampaignDetails.id
                }`;
              }
              if (e.code === "3") {
                // Use window.location.href to navigate
                window.location.href = `/${window.contextPath
                  }/employee/microplan/select-activity?microplanId=${row.id}&campaignId=${row.CampaignDetails.id
                  }`;
              }
            }}
            optionKey={"name"}
            selected={{ code: "1", name: "Actions" }}
          />
          // <p>$${value}</p>
        );
      }

      if (key === "Name of the Microplan") {
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
              <p>{value}</p>
            </div>
          );
        } else {
          return (
            <div>
              <p>NA</p>
            </div>
          );
        }
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
      if (key === "Actions") {
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
            default:
              console.log(value);
              break;
          }
        };
        // `/${window.contextPath}/employee/microplan/setup-microplan?key=${9}&preview=${true}&action=${false}`
        return row.status === "EXECUTION_TO_BE_DONE" ? (
          <Button
            label={t("START")}
            variation="secondary"
            icon={<ArrowForward styles={{ height: "1.25rem", width: "2.5rem" }} />}
            type="button"
            className="dm-workbench-download-template-btn dm-hover"
            onButtonClick={(e) => onActionSelect("START", row)}
          />
        ) : row.status === "RESOURCE_ESTIMATIONS_APPROVED" ? (
          <Button
            label={t("WBH_DOWNLOAD")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "2.5rem" }} />}
            type="button"
            className="dm-workbench-download-template-btn dm-hover"
            onButtonClick={(e) => onActionSelect("DOWNLOAD", row)}
          />
        ) : (
          <Button
            label={t("WBH_EDIT")}
            variation="secondary"
            icon={<EditIcon styles={{ height: "1.25rem", width: "2.5rem" }} />}
            type="button"
            className="dm-workbench-download-template-btn dm-hover"
            onButtonClick={(e) => onActionSelect("EDIT", row)}
          />
        );
      }

      if (key === "Name of the Microplan") {
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
              <p>{value}</p>
            </div>
          );
        } else {
          return (
            <div>
              <p>NA</p>
            </div>
          );
        }
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
      if(Object.keys(roleschosen).length === 0){
        for(const obj of additionalDetails["microplanData"]){

          roleschosen[obj["roleCode"]]=true;

        }
      }

      let rolesString = "";
      if (roleschosen) {
        rolesString = Object.keys(roleschosen)
          .filter((role) => roleschosen[role] === true)
          .join(",");
      }

      data.params.names = name;

      data.params.phone = phone;

      data.params.roles = rolesString;
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      cleanObject(data.params);
      delete data.params.roleschosen;
      delete data.params.name;

      return data;
    },

    rolesForFilter: (props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      return {
        params: {},
        url: "/mdms-v2/v2/_search", //mdms fetch from

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
      if (key === "Role") {
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
      const { facilityName, facilityType, residingVillage, status } = data?.state?.searchForm || {};
      data.body.PlanFacilitySearchCriteria = {};
      data.body.PlanFacilitySearchCriteria.limit = data?.state?.tableForm?.limit;
      data.body.PlanFacilitySearchCriteria.offset = data?.state?.tableForm?.offset;
      data.body.PlanFacilitySearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.PlanFacilitySearchCriteria.facilityName = facilityName;
      data.body.PlanFacilitySearchCriteria.facilityType = facilityType?.code;
      data.body.PlanFacilitySearchCriteria.status = status?.code;
      data.body.PlanFacilitySearchCriteria.residingVillage = residingVillage;
      const url = Digit.Hooks.useQueryParams();
      data.body.PlanFacilitySearchCriteria = {
        ...data.body.PlanFacilitySearchCriteria,
        planConfigurationId: url?.planConfigurationId,
      };
      cleanObject(data.body.PlanFacilitySearchCriteria);
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [showPopup, setShowPopup] = useState(false);

      switch (key) {
        case "MICROPLAN_FACILITY_ACTION":
          return (
            <>
              <ButtonNew
                className=""
                icon="ArrowForward"
                iconFill=""
                isSuffix
                label={t("MICROPLAN_ASSIGN")}
                onClick={
                  ()=>setShowPopup(true)
                }
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                title=""
                variation="secondary"
              />
              {showPopup && <FacilityPopUp details={row} onClose={()=>{setShowPopup(false)}}/>}
            </>
          );
        default:
          return null;
      }
    },
  },
};