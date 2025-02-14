import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
// import { createComplaint } from "../redux/actions";
import { Dropdown, FormComposerV2 } from "@egovernments/digit-ui-components";
import { PGRConstants } from "../../utils/constants";

// import { createComplaint } from "@egovernments/digit-ui-module-pgr/dist/index";

export const CreateComplaint = ({ parentUrl }) => {
  const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const userInfo = Digit.UserService.getUser()?.info;
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const assignedProjects = Digit.SessionStorage.get("currentProject");
  const assignedProjectsDropDown = assignedProjects?.map((project, i ) => {
    return {
      id: project?.id,
      projectType: project?.projectType,
      projectTypeId: project?.projectTypeId,
      boundary: project?.address?.boundary,
      boundaryType: project?.address?.boundaryType,
      name: `${project?.name}_${project?.address?.boundary}`,
    }
  });
  const [selectedComplaintType, setSelectedComplaintType] = useState({});
  const [complainantName, setComplainantName] = useState("");
  const [complainantMobileNumber, setComplainantMobileNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(PGRConstants.INDIA_COUNTRY_CODE);
  const [supervisorCountryCode, setSupervisorCountryCode] = useState(PGRConstants.INDIA_COUNTRY_CODE);
  // const [flattenedLocation, setFlattenedLocations] = useState({});
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [complaintCreatedFor, setComplaintCreatedFor] = useState("");
  const [boundaryCode, setBoundaryCode] = useState(null);
//   const [boundaryChildren, setBoundaries] = useState([]);
  const [complaintDate, setComplaintDate] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const history = useHistory();
  const client = useQueryClient();

  const { isLoading: isServiceDefinitionsLoading, data: serviceDefinitionsMDMS } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "RAINMAKER-PGR",
    [{ name: "ServiceDefs" }],
    {
      cacheTime: Infinity,
      select: (data) => {
        const serviceDefs = data?.MdmsRes?.RAINMAKER_PGR?.ServiceDefs;
        return serviceDefs.map((serviceDef) => {
            return {
                i18nkey: serviceDef.code?.toString().toUpperCase(),
                name: serviceDef.name,
                serviceCode: serviceDef.serviceCode,
            };
        });
    },
},
    { schemaCode: "SERVICE_DEFINITIONS_MASTER_DATA" } //mdmsv2
  );

  
//   const { data: boundaries, isLoading, } = Digit.Hooks.useBoundarySearch(tenantId, selectedCampaign?.boundary, selectedCampaign?.boundaryType,
//     {
//       enabled: boundaryCode !== null,
//       select: (data) => {
//         const boundaryData = data?.TenantBoundary?.[0]?.boundary?.[0]?.children?.length > 0 
//         ? data?.TenantBoundary?.[0]?.boundary?.[0]?.children?.map((b, i) => {
//           return {
//             ...b,
//             name: b?.code
//           }
//         }) : [data?.TenantBoundary?.[0]?.boundary?.[0]];
//         return boundaryData;
//       }
//     });
 

//   useEffect(() => {
//     if (selectedCampaign?.boundary) {
//       setBoundaryCode(selectedCampaign.boundary);
//       setBoundaries(boundaries);
//     }
//   }, [selectedCampaign, boundaries]);

  useEffect(() => {
    if (selectedComplaintType?.key && selectedLocality?.code && complaintCreatedFor?.code && complainantName && complainantMobileNumber) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [selectedComplaintType, selectedLocality, complaintCreatedFor, complainantName, complainantMobileNumber]);

  // const flattenHierarchy = useCallback((locations, children = [], parent) => {
  //   if (children.length === 0) return;

  //   for (let child of children) {
  //     const existing = locations[child.label];

  //     if (existing) {
  //       let existingItems = existing.items;
  //       existingItems.push({
  //         parentName: parent.code,
  //         name: child.code,
  //         code: child.code,
  //       });
  //       if (!existing.child) {
  //         existing.child = child.children?.length ? child.children[0].code : null
  //       }
  //     } else {
  //       locations[child.label] = {
  //         parent: parent.code,
  //         child: child.children?.length ? child.children[0].code : null,
  //         items: [
  //           {
  //             parentName: parent.code,
  //             name: child.code,
  //             code: child.code,
  //           },
  //         ],
  //       };
  //     }

  //     flattenHierarchy(locations, child.children, child);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!tenantId) return;

  //   Digit.LocationService.getBoundariesByCode(tenantId).then((res) => {
  //     const boundary = res.TenantBoundary?.[0]?.boundary?.[0];

  //     let locations = {};
  //     flattenHierarchy(locations, boundary.children, boundary);
  //     setFlattenedLocations(locations);

  //     let items = {};
  //     Object.keys(locations).forEach((key, index) => {
  //       if (index === 0) {
  //         items = {
  //           ...items,
  //           [key]: {
  //             options: locations[key]?.items,
  //             value: "",
  //           },
  //         };
  //       } else {
  //         items = {
  //           ...items,
  //           [key]: {
  //             options: [], 
  //             value: "",
  //           },
  //         };
  //       }
  //     });

  //     setSelectedItems(items);
  //   });
  // }, [tenantId, flattenHierarchy]);

  const wrapperSubmit = (data) => {
    if (!canSubmit) return;

    setSubmitted(true);
    !submitted && onSubmit(data);
  };

  // add time to date object
  const addTimeToDate = (modifiedComplaintDate,currentDateWithTime)=>{
    modifiedComplaintDate.setHours(currentDateWithTime.getHours());
    modifiedComplaintDate.setMinutes(currentDateWithTime.getMinutes());
    modifiedComplaintDate.setSeconds(currentDateWithTime.getSeconds());
    modifiedComplaintDate.setMilliseconds(currentDateWithTime.getMilliseconds());
  }

  //On SUbmit
  const onSubmit = async (data) => {
    if (!canSubmit) return;

    const { name, description, mobileNumber, supervisorName, supervisorMobileNumber, landmark, buildingName, street, pincode } = data;
    await client.refetchQueries(["fetchInboxData"]);

    const userId = userInfo.uuid;
    const additionalDetail = { supervisorName : supervisorName?.trim()?.length > 0 ? supervisorName : null, supervisorContactNumber : supervisorMobileNumber?.trim()?.length > 0 ? supervisorMobileNumber : null };
    const currentDateWithTime = new Date()
    const modifiedComplaintDate = new Date(complaintDate);
    addTimeToDate(modifiedComplaintDate,currentDateWithTime);
    const epochTime = new Date(modifiedComplaintDate).getTime();


    const requestData = {
      service: {
        active: true,
        tenantId,
        serviceCode: selectedComplaintType?.key,
        description,
        applicationStatus: "CREATED",
        source: "web",
        user: userInfo,
        isDeleted: false,
        rowVersion: 1,
        address: {
          landmark,
          buildingName,
          street,
          pincode,
          locality: {
            code: selectedLocality.code,
            name: selectedLocality.i18nkey,
          },
          geoLocation: {},
        },
        additionalDetail : JSON.stringify(additionalDetail),
        auditDetails: {
          createdBy: userId,
          createdTime: epochTime,
          lastModifiedBy: userId,
          lastModifiedTime: epochTime,
        },
      },
      workflow: {
        action: "CREATE",
        assignes: [],
        hrmsAssignes: [],
        comments: "",
      },
    };
    
    // const response = await Digit.PGRService.create(requestData, tenantId);

    dispatch(createComplaint(response));

    history.push(parentUrl + "/response");
  };

  const config = [
    {
      head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
      body: [
        // {
        //   label: t("HR_NATIONAL_CAMPAIGN_NAME_LABEL"),
        //   isMandatory: true,
        //   type: "dropdown",
        //   populators: (
        //     <Dropdown
        //       option={assignedProjectsDropDown}
        //       optionKey="name"
        //       id="campaign"
        //       selected={selectedCampaign}
        //       select={(e) => {
        //         setSelectedCampaign(e);
        //       }}
        //       t={t}
        //     />
        //   ),
        // },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              option={serviceDefinitionsMDMS}
              optionKey="i18nkey"
              id="complaintType"
              selected={selectedComplaintType}
              select={(e) => {
                setSelectedComplaintType(e);
              }}
              t={t}
            />
          ),
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_DATE"),
          isMandatory: true,
          type: "date",
          populators: {
            name: "dateOfComplaint",
            validation: {
              required: true,
            },
            date: complaintDate,
            onChange: (e) => {
              setComplaintDate(e);
            },
            max: Digit.Utils.date.getDate(),
            defaultValue: Digit.Utils.date.getDate(),
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
            isRequired: true,
          },
        },
        // {
        //   label: t("WBH_MDMS_HCM_ADMIN_CONSOLE_BOUNDARY"),
        //   isMandatory: true,
        //   type: "dropdown",
        //   populators: (
        //     <Dropdown
        //       option={boundaryChildren}
        //       optionKey="name"
        //       selected={selectedLocality}
        //       select={(value) => {
        //         setSelectedLocality(value)}}
        //       t={t}
        //     /> ),
        //   },

        {
          label: t("ES_CREATECOMPLAINT_FOR"),
          isMandatory: true,
          type: "radio",
          populators: {
            name: "complaintCreatedFor",
            value: complaintCreatedFor,
            onChange: (e) => {
              setComplaintCreatedFor(e);
              if (e.code === "ONE") {
                setComplainantName(userInfo.name);
                setComplainantMobileNumber(userInfo.mobileNumber);
                setSelectedCountryCode((userInfo?.mobileNumber?.length === 9) ?
                    PGRConstants.MOZ_COUNTRY_CODE : PGRConstants.INDIA_COUNTRY_CODE);
              } else {
                setComplainantName("");
                setComplainantMobileNumber("");
              }
            },
            validation: {
              required: true,
            },
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
          },
        },
      ],
    },
    {
      head: t("ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS"),
      body: [
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "name",
            maxlength: 64,
            value: complainantName,
            onChange: (e) => {
              setComplainantName(e.target.value);
            },
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_MOBILE_NUMBER"),
          isMandatory: true,
          type: "number",
          populators: {
            name: "mobileNumber",
            maxlength: (selectedCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? 9 : 10,
            value: complainantMobileNumber,
            onChange: (e) => {
              setComplainantMobileNumber(e.target.value);
            },
            validation: {
              required: true,
              pattern: (selectedCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? /^[0-9]\d{8}$/ : /^[6-9]\d{9}$/,
            },
            componentInFront: <div className="citizen-card-input citizen-card-input--front">
              <select value={selectedCountryCode} onChange={(e) => {setSelectedCountryCode(e.target.value);setComplainantMobileNumber("")}}>
                <option value={PGRConstants.INDIA_COUNTRY_CODE}>{PGRConstants.INDIA_COUNTRY_CODE}</option>
                <option value={PGRConstants.MOZ_COUNTRY_CODE}>{PGRConstants.MOZ_COUNTRY_CODE}</option>
              </select>
            </div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_SUPERVISOR_NAME"),
          isMandatory: false,
          type: "text",
          populators: {
            name: "supervisorName",
            maxlength: 64,
            validation: {
              pattern: /^[A-Za-z]/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_SUPERVISOR_MOBILE_NUMBER"),
          isMandatory: false,
          type: "number",
          populators: {
            name: "supervisorMobileNumber",
            maxlength: (supervisorCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? 9 : 10,
            validation: {
              pattern: (supervisorCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? /^[0-9]\d{8}$/ : /^[6-9]\d{9}$/
            },
            componentInFront: <div className="citizen-card-input citizen-card-input--front">
              <select value={supervisorCountryCode} onChange={(e) => {setSupervisorCountryCode(e.target.value)}}>
                <option value={PGRConstants.INDIA_COUNTRY_CODE}>{PGRConstants.INDIA_COUNTRY_CODE}</option>
                <option value={PGRConstants.MOZ_COUNTRY_CODE}>{PGRConstants.MOZ_COUNTRY_CODE}</option>
              </select>
            </div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION"),
          isMandatory: true,
          type: "textarea",
          populators: {
            name: "description",
            maxLength: 1000,
            validation: {
              required: true,
            },
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_LOCATION_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDRESS_1_DETAILS"),
          type: "text",
          populators: {
            name: "buildingName",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_DETAILS_ADDRESS_2_DETAILS"),
          type: "text",
          populators: {
            name: "street",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_LANDMARK__DETAILS"),
          type: "text",
          populators: {
            name: "landmark",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_POSTALCODE__DETAILS"),
          type: "number",
          populators: {
            name: "pincode",
            maxlength: 6,
            validation: {
              pattern: /^[1-9][0-9]{5}$/i,
            },
          },
        },
      ],
    },
  ];

  return (
    <FormComposerV2
      heading={t("ES_CREATECOMPLAINT_NEW_COMPLAINT")}
      config={config}
      onSubmit={wrapperSubmit}
      isDisabled={!canSubmit && !submitted}
      label={t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")}
    />
  );
};
