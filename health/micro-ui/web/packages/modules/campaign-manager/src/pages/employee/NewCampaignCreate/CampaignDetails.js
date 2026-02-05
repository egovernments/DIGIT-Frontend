import { Button, HeaderComponent, Footer, Loader, Tag, Toast, PopUp } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { OutpatientMed, AdUnits, GlobeLocationPin, Groups, ListAltCheck, UploadCloud, Edit,Translate } from "@egovernments/digit-ui-svg-components";
import { transformUpdateCreateData } from "../../../utils/transformUpdateCreateData";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import { downloadExcelWithCustomName } from "../../../utils";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";
import QRButton from "../../../components/CreateCampaignComponents/QRButton";

function transformCampaignData(inputObj = {}) {
  const deliveryRule = inputObj.deliveryRules?.[0] || {};
  const deliveryResources = deliveryRule.resources || [];

  const cycleDataArray = inputObj.additionalDetails?.cycleData?.cycleData || [];
  const cycle = cycleDataArray?.[0] || {};
  const configure = inputObj.additionalDetails?.cycleData?.cycleConfgureDate || {};

  // Extract resource by type
  const resourceByType = (type) => inputObj.resources?.filter((r) => r.type === type) || [];

  const boundaryFiles = resourceByType("boundary");
  const facilityFiles = resourceByType("facility");
  const userFiles = resourceByType("user");
  const unifiedFiles = [...resourceByType("unified-console"), ...resourceByType("unified-console-resources")];

  const deliveryRulesData = Array.isArray(inputObj.deliveryRules)
    ? inputObj.deliveryRules.map((rule) => ({
        id: rule.id || "",
        code: rule.code || "",
        name: rule.name || "",
        group: rule.group || "",
        deliveryAddDisable: rule.deliveryAddDisable,
        IsCycleDisable: rule.IsCycleDisable,
        beneficiaryType: rule.beneficiaryType,
        productCountHide: rule.productCountHide,
        eligibilityCriteria: rule.eligibilityCriteria || [],
        taskProcedure: rule.taskProcedure || [],
        dashboardUrls: rule.dashboardUrls || {},
        cycles:
          rule.cycles?.map((cycle) => ({
            id: cycle.id,
            startDate: Digit.DateUtils.ConvertEpochToDate(cycle.startDate)?.split("/")?.reverse()?.join("-") || "",
            endDate: Digit.DateUtils.ConvertEpochToDate(cycle.endDate)?.split("/")?.reverse()?.join("-") || "",
            mandatoryWaitSinceLastCycleInDays: cycle.mandatoryWaitSinceLastCycleInDays,
            deliveries:
              cycle.deliveries?.map((delivery) => ({
                id: delivery.id,
                deliveryStrategy: delivery.deliveryStrategy,
                mandatoryWaitSinceLastDeliveryInDays: delivery.mandatoryWaitSinceLastDeliveryInDays,
                doseCriteria:
                  delivery.doseCriteria?.map((criteria) => ({
                    condition: criteria.condition,
                    ProductVariants: criteria.ProductVariants || [],
                  })) || [],
              })) || [],
          })) || [],
        resources:
          rule.resources?.map((r) => ({
            name: r?.name || "",
            productVariantId: r?.productVariantId || null,
            isBaseUnitVariant: r?.isBaseUnitVariant || false,
            quantity: r?.quantity,
          })) || [],
      }))
    : [];

  return {
    HCM_CAMPAIGN_TYPE: {
      projectType: {
        ...deliveryRule,
        resources: Array.isArray(deliveryResources)
          ? deliveryResources.map((r) => ({
              name: r?.name || "",
              productVariantId: r?.productVariantId || null,
              isBaseUnitVariant: r?.isBaseUnitVariant || false,
            }))
          : [],
      },
    },
    HCM_CAMPAIGN_NAME: {
      campaignName: inputObj?.campaignName || "",
    },
    HCM_CAMPAIGN_DATE: {
      campaignDates: {
        startDate: Digit.DateUtils.ConvertEpochToDate(inputObj?.startDate)?.split("/")?.reverse()?.join("-"),
        endDate: Digit.DateUtils.ConvertEpochToDate(inputObj?.endDate)?.split("/")?.reverse()?.join("-"),
      },
    },
    HCM_CAMPAIGN_CYCLE_CONFIGURE: {
      cycleConfigure: {
        cycleConfgureDate: configure,
        cycleData: cycleDataArray,
      },
    },
    HCM_CAMPAIGN_DELIVERY_DATA: {
      deliveryRule: deliveryRulesData,
    },
    HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA: {
      boundaryType: {
        selectedData: inputObj?.boundaries || [],
      },
    },
    HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: {
      uploadBoundary: {
        uploadedFile: boundaryFiles,
        isSuccess: boundaryFiles.length > 0,
      },
    },
    HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: {
      uploadFacility: {
        uploadedFile: facilityFiles,
        isSuccess: facilityFiles.length > 0,
      },
    },
    HCM_CAMPAIGN_UPLOAD_USER_DATA: {
      uploadUser: {
        uploadedFile: userFiles,
        isSuccess: userFiles.length > 0,
      },
    },
    HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA: {
      uploadUnified: {
        uploadedFile: unifiedFiles,
        isSuccess: unifiedFiles.length > 0,
      },
    },
  };
}

function formatIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";
  return dateStr.split("T")[0]; // returns "YYYY-MM-DD"
}

const CampaignDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isDraftCampaign = location.state?.isDraft;
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const [showToast, setShowToast] = useState(null);
  const isDraft = searchParams.get("draft");
  const [showQRPopUp, setShowQRPopUp] = useState(false);
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const url = getMDMSUrl(true);
  const moduleName = Digit.Utils.campaign.getModuleName();

  const { data: BOUNDARY_HIERARCHY_TYPE, isLoading: hierarchyTypeLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${moduleName}')]`,
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy;
      },
    },
    { schemaCode: "HierarchySchema" }
  );

  const hierarchyDefinitionReqCriteria = useMemo(() => {
    return {
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 2,
          offset: 0,
          hierarchyType: BOUNDARY_HIERARCHY_TYPE,
        },
      },
      config: {
        enabled: !!BOUNDARY_HIERARCHY_TYPE,
      },
    };
  }, [tenantId, BOUNDARY_HIERARCHY_TYPE]);

  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(hierarchyDefinitionReqCriteria);

  // useEffect(() => {
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_UPDATE_FORM_DATA");
  // }, []);

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
        isOverrideDatesFromProject: true,
      },
    },
    config: {
      enabled: !!campaignNumber,
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { isLoading, data: campaignData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // MDMS call for Form Config to check if all forms are configured
  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.FormConfig`;
  const { isLoading: isFormConfigLoading, data: formConfigData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {
        project: campaignData?.campaignNumber,
      },
      `MDMSDATA-${schemaCode}-${campaignData?.campaignNumber}`,
      {
        enabled: !!campaignData?.campaignNumber,
        cacheTime: 0,
        staleTime: 0,
      }
    )
  );

  // Check if at least one form config has version > 1
  const isFormConfigured = useMemo(() => {
    if (!formConfigData?.length > 0) return false;
    const formConfigs = formConfigData;
    return formConfigs?.length > 0 && formConfigs?.filter((flow) => flow?.data?.active)?.some((item) => item?.data?.version > 1);
  }, [formConfigData]);

  // Using the checklist search hook to check if any checklists are configured
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  const { data: checklistData } = Digit.Hooks.campaign.useMDMSServiceSearch({
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.ChecklistTemplates`,
        isActive: true,
        filters: {},
        limit: 1000,
      },
    },
    campaignName: campaignData?.campaignName,
    campaignType: campaignData?.projectType,
    serviceDefinitionLimit: 1,
    enabled: !!campaignData?.campaignName && !!campaignData?.projectType,
  });

  // Checking if any checklists are configured (have ServiceRequest in merged data)
  const isChecklistConfigured = useMemo(() => {
    return checklistData?.mdmsData?.some((item) => item?.ServiceRequest?.length > 0);
  }, [checklistData]);

  useEffect(() => {
    if (campaignData) {
      sessionStorage.setItem("HCM_CAMPAIGN_NUMBER", JSON.stringify({ id: campaignData?.id, campaignNumber: campaignNumber }));
    }
  }, [campaignData]);

  useEffect(() => {
    if (!campaignData) return;

    const cycleConfig = campaignData?.deliveryRules?.[0];
    const cycles = cycleConfig?.cycles || [];

    const formattedCycleData = cycles.map((cycle, idx) => {
      const startDate = cycle?.startDate ? new Date(cycle.startDate) : null;
      const endDate = cycle?.endDate ? new Date(cycle.endDate) : null;
      return {
        key: idx + 1,
        fromDate: startDate && !isNaN(startDate.getTime()) ? startDate.toISOString() : null,
        toDate: endDate && !isNaN(endDate.getTime()) ? endDate.toISOString() : null,
      };
    });

    const cycleConfgureDate = {
      cycle: cycles.length,
      deliveries: cycles?.[0]?.deliveries?.length || 0,
      isDisable: cycleConfig?.IsCycleDisable !== undefined ? cycleConfig.IsCycleDisable : false,
    };

    const campaignSessionData = {
      CampaignType: { code: campaignData?.projectType },
      CampaignName: campaignData?.campaignName,
      DateSelection: {
        startDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.startDate)?.split("/")?.reverse()?.join("-"),
        endDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.endDate)?.split("/")?.reverse()?.join("-"),
      },
      additionalDetails: {
        cycleData: formattedCycleData,
        cycleConfgureDate: cycleConfgureDate,
      },
      startDate: campaignData?.startDate,
      endDate: campaignData?.endDate,
      projectType: campaignData?.projectType,
      deliveryRules: campaignData?.deliveryRules,
      id: campaignData?.id,
    };

    const tranformedManagerUploadData = transformCampaignData(campaignData);
    const hierarchyData = {
      hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      hierarchy: hierarchyDefinition?.BoundaryHierarchy?.[0],
    };
    Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_DATA", campaignSessionData);
    Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_UPLOAD_DATA", tranformedManagerUploadData);
    Digit.SessionStorage.set("HCM_CAMPAIGN_MANAGER_UPLOAD_ID", hierarchyData);
    Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_SET_UP", tranformedManagerUploadData);
    // Update HCM_CAMPAIGN_MANAGER_FORM_DATA with fresh campaign dates for CycleConfiguration
    const existingFormData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA") || {};
    Digit.SessionStorage.set("HCM_CAMPAIGN_MANAGER_FORM_DATA", {
      ...existingFormData,
      HCM_CAMPAIGN_DATE: {
        campaignDates: {
          startDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.startDate)?.split("/")?.reverse()?.join("-"),
          endDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.endDate)?.split("/")?.reverse()?.join("-"),
        },
      },
      HCM_CAMPAIGN_TYPE: {
        projectType: { code: campaignData?.projectType },
      },
      HCM_CAMPAIGN_NAME: {
        campaignName: campaignData?.campaignName,
      },
    });
  }, [campaignData, BOUNDARY_HIERARCHY_TYPE, hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy]);

  const data = {
    cards: [
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_BOUNDARY_SELECT_HEADING"),
              desc: t("HCM_SELECT_BOUNDARY_DESC"),
              buttonId: campaignData?.boundaries?.length > 0 ? `campaign-details-page-button-edit-selecting-boundaries` : `campaign-details-page-button-selecting-boundaries`,
              buttonLabel:
                campaignData?.status === "created" || campaignData?.parentId
                  ? t("HCM_UPDATE_BOUNDARIES")
                  : campaignData?.boundaries?.length > 0
                  ? t("HCM_EDIT_BOUNDARY_BUTTON")
                  : t("HCM_SELECT_BOUNDARY_BUTTON"),
              navLink:
                campaignData?.status === "created" || campaignData?.parentId
                  ? `update-campaign?key=1&parentId=${campaignData?.id}&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}&isUnifiedCampaign=${campaignData?.additionalDetails?.isUnifiedCampaign} `
                  : `setup-campaign?key=5&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&draft=${isDraft}&isDraft=true`,
              type: campaignData?.boundaries?.length > 0 || campaignData?.parentId ? "secondary" : "primary",
              icon: <GlobeLocationPin fill={"#c84c0e"} />,
              isDraftCampaign: isDraftCampaign || campaignData?.status === "drafted",
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_DELIVERY_HEADING"),
              desc: t("HCM_DELIVERY_DESC"),
              buttonLabel:
                campaignData?.status === "created" || campaignData?.parentId
                  ? t("HCM_EDIT_DELIVERY_DATES")
                  : campaignData?.deliveryRules?.[0]?.cycles?.length > 0
                  ? t("HCM_EDIT_DELIVERY_BUTTON")
                  : t("HCM_DELIVERY_BUTTON"),
              buttonId:
                campaignData?.status === "created" || campaignData?.parentId
                  ? `campaign-details-page-button-edit-delivery-strategy`
                  : campaignData?.deliveryRules?.[0]?.cycles?.length > 0
                  ? `campaign-details-page-button-edit-delivery-strategy`
                  : `campaign-details-page-button-delivery-strategy`,
              navLink:
                campaignData?.status === "created" || campaignData?.parentId
                  ? `update-dates-boundary?id=${campaignData?.id}&campaignName=${campaignData?.campaignName}&projectId=${campaignData?.projectId}&campaignNumber=${campaignData?.campaignNumber}`
                  : `setup-campaign?key=7&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&draft=${isDraft}&isDraft=true&projectType=${campaignData?.projectType}`,
              type: campaignData?.deliveryRules?.[0]?.cycles?.length > 0 ? "secondary" : "primary",
              icon: <OutpatientMed />,
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_MOBILE_APP_HEADING"),
              desc: t("HCM_MOBILE_APP_DESC"),
              buttonLabel: isFormConfigured ? t("HCM_EDIT_MOBILE_APP_BUTTON") : t("HCM_MOBILE_APP_BUTTON"),
              buttonId: isFormConfigured ? `campaign-details-page-button-edit-mobile-app` : `campaign-details-page-button-setup-mobile-app`,
              type: isFormConfigured ? "secondary" : "primary",
              navLink: `new-app-modules?projectType=${campaignData?.projectType}&campaignNumber=${campaignData?.campaignNumber}&tenantId=${tenantId}`,
              icon: (
                <AdUnits
                  fill={
                    campaignData?.status === "created" &&
                    campaignData?.startDate < Date.now()
                      ? "#c5c5c5"
                      : "#C84C0E"
                  }
                />
              ),
              disabled:
                (campaignData?.status === "created" ||
                  campaignData?.parentId) &&
                campaignData?.startDate < Date.now(),
            },
          },
        ],
      },
      ...(campaignData?.additionalDetails?.isUnifiedCampaign
        ? [
            {
              noCardStyle: true,
              sections: [
                {
                  type: "COMPONENT",
                  component: "ViewDetailComponent",
                  noCardStyle: true,
                  props: {
                    headingName: t("HCM_UPLOAD_UNIFIED_DATA_HEADING"),
                    desc: t("HCM_UPLOAD_UNIFIED_DATA_DESC"),
                    buttonLabel: campaignData?.resources?.some(
                      (r) => r.type === "unified-console" || r.type === "unified-console-resources"
                    )
                      ? t("HCM_EDIT_UPLOAD_DATA_BUTTON")
                      : t("HCM_UPLOAD_DATA_BUTTON"),
                    buttonId: campaignData?.resources?.some(
                      (r) => r.type === "unified-console" || r.type === "unified-console-resources"
                    )
                      ? `campaign-details-page-button-unified-console-data-edit`
                      : `campaign-details-page-button-unified-console-data-upload`,
                    navLink: `unified-upload-screen?key=1&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`,
                    type: campaignData?.resources?.some((r) => r.type === "unified-console" || r.type === "unified-console-resources")
                      ? "secondary"
                      : "primary",
                    icon: (
                      <UploadCloud
                        fill={campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" ? "#c5c5c5" : "#C84C0E"}
                      />
                    ),
                    disabled: campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" || campaignData?.parentId,
                  },
                },
              ],
            },
          ]
        : [
            {
              noCardStyle: true,
              sections: [
                {
                  type: "COMPONENT",
                  component: "ViewDetailComponent",
                  noCardStyle: true,
                  props: {
                    headingName: t("HCM_UPLOAD_DATA_HEADING"),
                    desc: t("HCM_UPLOAD_DATA_DESC"),
                    buttonLabel: campaignData?.resources?.length > 0 ? t("HCM_EDIT_UPLOAD_DATA_BUTTON") : t("HCM_UPLOAD_DATA_BUTTON"),
                    buttonId: campaignData?.resources?.length > 0 ? `campaign-details-page-button-edit-data` : `campaign-details-page-button-upload-data`,
                    navLink: `upload-screen?key=1&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`,
                    type: campaignData?.resources?.length > 0 ? "secondary" : "primary",
                    icon: (
                      <UploadCloud
                        fill={campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" ? "#c5c5c5" : "#C84C0E"}
                      />
                    ),
                    disabled: campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" || campaignData?.parentId,
                  },
                },
              ],
            },
          ]),
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_UPLOAD_LOCALIZATION_DATA_HEADING"),
              desc: t("HCM_UPLOAD_LOCALIZATION_DATA_DESC"),
              buttonLabel: t("HCM_UPLOAD_LOCALIZATIONS_DATA_BUTTON"),
              buttonId: `campaign-details-page-button-localizations-data-upload`,
              navLink: `localization-add?campaignNumber=${campaignData?.campaignNumber}&campaignName=${campaignData?.campaignName}`,
              navLink: `localization-add?campaignNumber=${campaignData?.campaignNumber}&campaignName=${campaignData?.campaignName}`,
              type: "primary",
              type: "primary",
              icon: <Translate fill={"#C84C0E"} width={"40px"} height={"40px"}/>,
              disabled: false,
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_CHECKLIST_HEADING"),
              desc: t("HCM_CHECKLIST_DESC"),
              buttonLabel: isChecklistConfigured ? t("HCM_EDIT_CHECKLIST_BUTTON") : t("HCM_CHECKLIST_BUTTON"),
              buttonId: isChecklistConfigured ? `campaign-details-page-button-edit-checklist` : `campaign-details-page-button-checklist`,
              type: isChecklistConfigured ? "secondary" : "primary",
              navLink: `checklist/search?name=${campaignData?.campaignName}&campaignId=${campaignData?.id}&projectType=${campaignData?.projectType}&campaignNumber=${campaignData?.campaignNumber}`,
              icon: <ListAltCheck />,
            },
          },
        ],
      },
    ],
  };

  const reqUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  const validateCampaignDates = (cycles, campaignData) => {
    const sortedCycles = [...cycles].sort((a, b) => a.startDate - b.startDate);

    const firstCycleStart = new Date(sortedCycles[0]?.startDate);
    const lastCycleEnd = new Date(sortedCycles[sortedCycles.length - 1]?.endDate);

    const campaignStart = new Date(campaignData?.startDate);
    const campaignEnd = new Date(campaignData?.endDate);

    // Normalize all dates to remove the time portion
    const toDateOnly = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const first = toDateOnly(firstCycleStart);
    const last = toDateOnly(lastCycleEnd);
    const campaignS = toDateOnly(campaignStart);
    const campaignE = toDateOnly(campaignEnd);
    return campaignS <= first && campaignE >= last;
  };

  const onsubmit = async () => {
    const valideDates = validateCampaignDates(campaignData?.deliveryRules?.[0]?.cycles, campaignData);
    if (!valideDates) {
      setShowToast({ key: "error", label: "INVALID_DATES" });
      return;
    }
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: transformUpdateCreateData({ campaignData }),
        config: {
          enabled: true,
        },
      },
      {
        onSuccess: async (data) => {
          navigate(
            `/${window.contextPath}/employee/campaign/response?isSuccess=${true}&campaignId=${data?.CampaignDetails?.campaignNumber}`,
            {
              state: {
                message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
                text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
                info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
                actionLabel: "BACK_TO__CAMPAIGN_HOME",
                actionLink: `/${window.contextPath}/employee`,
                secondaryActionLabel: "GO_TO_MY_CAMPAIGNS",
                secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign-new`,
              },
            }
          );
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.code;
          setShowToast({ key: "error", label: errorCode ? t(errorCode) : t("ERROR_CREATE_CAMPAIGN") });
        },
      }
    );
  };

  const onDownloadCredentails = async (data) => {
    try {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const responseTemp = await Digit.CustomService.getResponse({
        url: `/project-factory/v1/data/_download`,
        params: {
          tenantId: tenantId,
          campaignId: campaignData?.id,
          type: "userCredential",
          hierarchyType: campaignData?.hierarchyType,
        },
      });

      const response = responseTemp?.GeneratedResource?.map((i) => i?.fileStoreid);

      if (response?.[0]) {
        downloadExcelWithCustomName({
          fileStoreId: response[0],
          customName: "userCredential",
        });
      } else {
        console.error("No file store ID found for user credentials");
      }
    } catch (error) {
      console.error("Error downloading user credentials:", error);
    }
  };

  const onDownloadApp = () => {
    setShowQRPopUp(true);
  };

  if (isLoading || isFormConfigLoading || hierarchyTypeLoading ) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const week = `${convertEpochToNewDateFormat(campaignData?.startDate)} - ${convertEpochToNewDateFormat(campaignData?.endDate)}`;

  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <>
      <div className="campaign-details-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <HeaderComponent className={"date-header"}>{campaignData?.campaignName}</HeaderComponent>
          {campaignData?.status !== "created" && (
            <div
              className="hover"
              id={"campaign-details-edit-campaign-name"}
              onClick={() => {
                navigate(
                  `/${window.contextPath}/employee/campaign/create-campaign?key=2&editName=${true}&id=${campaignData?.id}&draft=${isDraft}`
                );
              }}
            >
              <Edit />
            </div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <Tag label={t(campaignData?.projectType)} showIcon={false} className={"campaign-view-tag"} type={"warning"} stroke={true}></Tag>
          {campaignData?.deliveryRules?.[0]?.cycles?.length >= 1 && (
            <Tag
              label={campaignData?.deliveryRules?.[0]?.cycles?.length > 1 ? t("HCM_MULTIROUND") : t("HCM_SINGLE_ROUND")}
              showIcon={false}
              className={"campaign-view-tag"}
              type={"monochrome"}
              stroke={true}
            />
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem"}}>
        <div className="dates">{week}</div>
        <div
          className="hover"
          style={{
            height: "20px",
            width: "20px",
            alignSelf: "self-end",
          }}
          onClick={() => {
            if (campaignData?.status === "created") {
              navigate(
                `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${campaignData?.id}&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`
              );
            } else {
              navigate(
                `/${window.contextPath}/employee/campaign/create-campaign?key=3&editName=${true}&id=${campaignData?.id}&draft=${isDraft}`
              );
            }
          }}
          id={"campaign-details-edit-campaign-dates"}
        >
          <Edit width={"18"} height={"18"} />
        </div>
      </div>
      <div className="detail-desc">{t("HCM_VIEW_DETAILS_DESCRIPTION")}</div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
      <Footer
        actionFields={
          campaignData?.status !== "created" && !campaignData?.parentId
            ? [
                <Button
                  icon="CheckCircleOutline"
                  id={"campaign-details-page-final-save-campaign"}
                  label={t("HCM_CREATE_CAMPAIGN")}
                  title={t("HCM_CREATE_CAMPAIGN")}
                  onClick={onsubmit}
                  isDisabled={
                    campaignData?.boundaries?.length === 0 ||
                    campaignData?.deliveryRules?.length === 0 ||
                    campaignData?.deliveryRules?.some((rule) => rule?.cycles?.length === 0) ||
                    campaignData?.resources?.length === 0
                  }
                  type="button"
                  variation="primary"
                />,
              ]
            : [
                <Button
                  icon="CloudDownload"
                  label={t("HCM_DOWNLOAD_CREDENTIALS")}
                  title={t("HCM_DOWNLOAD_CREDENTIALS")}
                  onClick={() => onDownloadCredentails(campaignData)}
                  type="button"
                  variation="primary"
                  id={"campaign-details-page-final-download-credentials"}
                />,
                <Button icon="CloudDownload" label={t("HCM_DOWNLOAD_APP")} title={t("HCM_DOWNLOAD_APP")} onClick={onDownloadApp} type="button" variation="primary" id={"campaign-details-page-final-download-app"}/>,
              ]
        }
        maxActionFieldsAllowed={5}
        setactionFieldsToRight={true}
      />
      {showQRPopUp && <QRButton setShowQRPopUp={setShowQRPopUp} />}
      {showToast && (
        <Toast
          type={
            showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"
          }
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default CampaignDetails;
