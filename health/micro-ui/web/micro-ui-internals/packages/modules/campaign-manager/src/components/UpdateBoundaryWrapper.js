import React, { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { Card, HeaderComponent, AlertCard, PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import TagComponent from "./TagComponent";

const UpdateBoundaryWrapper = ({ onSelect, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const parentId = searchParams.get("parentId");
  const id = searchParams.get("id");
  const isDraft = searchParams.get("draft");
  const isDraftCampaign = searchParams.get("isDraftCampaign") === "true";
  // const hierarchyType = props?.props?.hierarchyType;
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${window.Digit.Utils.campaign.getModuleName()}')]`,
      },
    ],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  );
  const campaignName = searchParams.get("campaignName");
  const [hierarchyType, SetHierarchyType] = useState(props?.props?.hierarchyType);
  const [showPopUp, setShowPopUp] = useState(false);
  const [restrictSelection, setRestrictSelection] = useState(null);
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.find((item) => item.hierarchy === hierarchyType)?.lowestHierarchy;
  }, [HierarchySchema, hierarchyType]);

  const reqCriteriaCampaign = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        ids: [parentId],
        ...(isDraftCampaign && { status: ["drafted"] }),
      },
    },
  };

  const { data: CampaignData } = Digit.Hooks.useCustomAPIHook(reqCriteriaCampaign);

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

    const deliveryRulesData = Array.isArray(inputObj.deliveryRules)
      ? inputObj.deliveryRules.map((rule) => ({
          id: rule.id || "",
          code: rule.code || "",
          name: rule.name || "",
          group: rule.group || "",
          validMinAge: rule.validMinAge,
          validMaxAge: rule.validMaxAge,
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
    };
  }

  useEffect(() => {
    if (!id || isDraft) {
      setSelectedData(CampaignData?.CampaignDetails?.[0]?.boundaries);
      const rootOptions = {};
      CampaignData?.CampaignDetails?.[0]?.boundaries.forEach((item) => {
        if (item.isRoot) {
          if (!rootOptions[item.type]) {
            rootOptions[item.type] = {};
          }
          rootOptions[item.type][item.code] = null;
        }
      });

      setBoundaryOptions(rootOptions);
    }
    SetHierarchyType(CampaignData?.CampaignDetails?.[0]?.hierarchyType);
    // const tranformedManagerUploadData = transformCampaignData(CampaignData);
    // Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_UPLOAD_DATA", tranformedManagerUploadData);
  }, [CampaignData]);

  useEffect(() => {
    onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions, updateBoundary: !restrictSelection });
  }, [selectedData, boundaryOptions, restrictSelection]);

  useEffect(() => {
    if (props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType) {
      setSelectedData(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData);
      setBoundaryOptions(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData);
    }
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType]);

  useEffect(() => {
    if (
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0
    ) {
      setRestrictSelection(true);
    }
  }, [props?.props?.sessionData]);

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({ BOUNDARY_HIERARCHY_TYPE: hierarchyType, tenantId });

  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
    setRestrictSelection(value?.restrictSelection);
  };

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
      setRestrictSelection(true);
      return;
    }
  };

  return (
    <>
      <Card>
        <TagComponent campaignName={campaignName} />
        <HeaderComponent className={"update-boundary-header"}>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</HeaderComponent>
        <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
        {hierarchyData && (
          <Wrapper
            hierarchyType={hierarchyType}
            lowest={lowestHierarchy}
            isMultiSelect={"true"}
            frozenData={CampaignData?.CampaignDetails?.[0]?.boundaries}
            frozenType={"filter"}
            hierarchyData={hierarchyData}
            onSelect={(value) => {
              handleBoundaryChange(value);
            }}
            boundaryOptions={boundaryOptions}
            selectedData={selectedData}
            restrictSelection={restrictSelection}
          />
        )}
      </Card>
      <div style={{ marginTop: "1rem" }}>
        <AlertCard
          label="Info"
          text={t("CAMPAIGN_CANNOT_REMOVE_PREVIOUS_BOUNDARIES")}
          variant="default"
          style={{ margin: "0rem", maxWidth: "100%", marginTop: "1.5rem", marginBottom: "2rem" }}
        />
      </div>
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_HEADER")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_TEXT") + " "}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
              onClick={() => {
                checkDataPresent({ action: false });
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
              onClick={() => {
                checkDataPresent({ action: true });
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
    </>
  );
};

export default UpdateBoundaryWrapper;
