import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Loader, HeaderComponent } from "@egovernments/digit-ui-components";
import TagComponent from "./TagComponent";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

function boundaryDataGrp(boundaryData, hierarchyDefinition) {
  if (!hierarchyDefinition || !boundaryData) return [];

  const groupedData = {};

  function getOrderedBoundaryTypes(hierarchy) {
    const result = [];
    let currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find((item) => item.parentBoundaryType === null);

    while (currentItem) {
      result.push(currentItem.boundaryType);
      currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find(
        (item) => item.parentBoundaryType === currentItem.boundaryType
      );
    }
    return result;
  }

  const orderedBoundaryTypes = getOrderedBoundaryTypes(hierarchyDefinition);

  boundaryData?.forEach((item) => {
    const { type } = item;
    if (!groupedData[type]) groupedData[type] = [];
    groupedData[type].push(item);
  });

  return orderedBoundaryTypes
    .map((type) => ({
      type,
      boundaries: groupedData[type] || [],
    }))
    .filter((entry) => entry.boundaries.length > 0);
}

const CampaignUpdateSummary = ({ formData, props, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const campaignName = searchParams.get("campaignName");
  const noAction = searchParams.get("action");
  const parentId = searchParams.get("parentId");
  const isPreview = searchParams.get("preview");
  const isUnifiedCampaign = searchParams.get("isUnifiedCampaign") === "true";

  const [showToast, setShowToast] = useState(null);

  // Get data from props passed through config
  const sessionData = props?.sessionData || {};
  const campaignData = props?.campaignData;
  const summaryErrors = props?.summaryErrors || {};

  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const hierarchyType = params?.hierarchyType || campaignData?.CampaignDetails?.[0]?.hierarchyType;

  const hierarchyReq = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
    config: {
      enabled: !!hierarchyType,
    },
  };

  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(hierarchyReq);

  const { data: campaignDetails, isLoading } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId,
    filter: { ids: [id] },
    config: {
      select: (response) => {
        return response?.[0] || null;
      },
      enabled: !!id,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  // Use parent campaign data if available
  const parentCampaign = campaignData?.CampaignDetails?.[0];

  // Build boundary data
  const boundaryData = useMemo(() => {
    const boundaries =
      sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData ||
      campaignDetails?.boundaries ||
      parentCampaign?.boundaries ||
      [];
    return boundaryDataGrp(boundaries, hierarchyDefinition);
  }, [sessionData, campaignDetails, parentCampaign, hierarchyDefinition]);

  // Get uploaded files from session data
  const facilityFiles =
    sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile ||
    campaignDetails?.resources?.filter((i) => i?.type === "facility") ||
    [];
  const userFiles =
    sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile ||
    campaignDetails?.resources?.filter((i) => i?.type === "user") ||
    [];
  const targetFiles =
    sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile ||
    campaignDetails?.resources?.filter((i) => i?.type === "boundary") ||
    [];
  const unifiedFiles =
    sessionData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile ||
    campaignDetails?.resources?.filter((i) => i?.type === "unified-console" || i?.type === "unified-console-resources") ||
    [];

  // Build cards structure for ViewComposer
  const viewComposerData = useMemo(() => {
    const mainCampaign = parentCampaign || campaignDetails;
    if (!mainCampaign) return { cards: [] };

    const cards = [
      // Campaign Details Card
      {
        navigationKey: "card1",
        sections: [
          {
            type: "DATA",
            cardHeader: { value: t(I18N_KEYS.COMPONENTS.CAMPAIGN_DETAILS), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
            values: [
              {
                key: "CAMPAIGN_TYPE",
                value: mainCampaign?.projectType
                  ? t(`CAMPAIGN_PROJECT_${mainCampaign?.projectType?.toUpperCase()}`)
                  : t(I18N_KEYS.COMPONENTS.CAMPAIGN_SUMMARY_NA),
              },
              {
                key: "CAMPAIGN_NAME",
                value: mainCampaign?.campaignName || campaignName || t(I18N_KEYS.COMPONENTS.CAMPAIGN_SUMMARY_NA),
              },
              {
                key: "CAMPAIGN_START_DATE",
                value: mainCampaign?.startDate ? Digit.Utils.date.convertEpochToDate(mainCampaign?.startDate) : t(I18N_KEYS.COMPONENTS.CAMPAIGN_SUMMARY_NA),
              },
              {
                key: "CAMPAIGN_END_DATE",
                value: mainCampaign?.endDate ? Digit.Utils.date.convertEpochToDate(mainCampaign?.endDate) : t(I18N_KEYS.COMPONENTS.CAMPAIGN_SUMMARY_NA),
              },
            ],
          },
        ],
      },
    ];

    // Add Boundary Cards
    if (boundaryData && boundaryData.length > 0) {
      boundaryData.forEach((item, index) => {
        cards.push({
          navigationKey: "card2",
          name: `HIERARCHY_${index + 1}`,
          sections: [
            {
              name: `HIERARCHY_${index + 1}`,
              type: "COMPONENT",
              cardHeader: {
                value: `${t((hierarchyType + "_" + item?.type).toUpperCase())}`,
                inlineStyles: { color: "#0B4B66" },
              },
              component: "BoundaryDetailsSummary",
              props: {
                boundaries: item,
                hierarchyType: hierarchyType,
              },
            },
          ],
        });
      });
    }

    // Add Upload Data Cards based on campaign type
    if (isUnifiedCampaign) {
      // Unified Campaign - show unified file card
      cards.push({
        navigationKey: "card3",
        sections: [
          {
            name: "unified",
            type: "COMPONENT",
            component: "CampaignDocumentsPreview",
            props: {
              documents: unifiedFiles,
              showAsButton:true
            },
            cardHeader: { value: t(I18N_KEYS.COMPONENTS.UNIFIED_DATA_DETAILS), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
            ...(summaryErrors?.unified?.length > 0 && {
              cardSecondaryAction: <span style={{ color: "red" }}>{summaryErrors.unified[0].error}</span>,
            }),
          },
        ],
      });
    } else {
      // Non-unified Campaign - show individual file cards
      cards.push({
        navigationKey: "card3",
        sections: [
          {
            name: "facility",
            type: "COMPONENT",
            component: "CampaignDocumentsPreview",
            props: {
              documents: facilityFiles,
              showAsButton:true
            },
            cardHeader: { value: t(I18N_KEYS.COMPONENTS.FACILITY_DETAILS), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
            ...(summaryErrors?.facility?.length > 0 && {
              cardSecondaryAction: <span style={{ color: "red" }}>{summaryErrors.facility[0].error}</span>,
            }),
          },
        ],
      });

      cards.push({
        navigationKey: "card3",
        sections: [
          {
            name: "user",
            type: "COMPONENT",
            component: "CampaignDocumentsPreview",
            props: {
              documents: userFiles,
              showAsButton:true
            },
            cardHeader: { value: t(I18N_KEYS.COMPONENTS.USER_DETAILS), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
            ...(summaryErrors?.user?.length > 0 && {
              cardSecondaryAction: <span style={{ color: "red" }}>{summaryErrors.user[0].error}</span>,
            }),
          },
        ],
      });

      cards.push({
        navigationKey: "card3",
        sections: [
          {
            name: "target",
            type: "COMPONENT",
            component: "CampaignDocumentsPreview",
            props: {
              documents: targetFiles,
              showAsButton:true
            },
            cardHeader: { value: t(I18N_KEYS.COMPONENTS.TARGET_DETAILS), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
            ...(summaryErrors?.target?.length > 0 && {
              cardSecondaryAction: <span style={{ color: "red" }}>{summaryErrors.target[0].error}</span>,
            }),
          },
        ],
      });
    }

    return {
      cards,
      horizontalNav: {
        showNav: true,
        configNavItems: [
          {
            name: "card1",
            active: true,
            code: t(I18N_KEYS.COMPONENTS.HCM_CAMPAIGN_SETUP_DETAILS),
          },
          {
            name: "card2",
            active: true,
            code: t(I18N_KEYS.COMPONENTS.HCM_BOUNDARY_DETAILS),
          },
          {
            name: "card3",
            active: true,
            code: t(I18N_KEYS.COMPONENTS.HCM_DATA_UPLOAD),
          },
        ],
        activeByDefault: "card1",
      },
    };
  }, [
    parentCampaign,
    campaignDetails,
    boundaryData,
    hierarchyType,
    facilityFiles,
    userFiles,
    targetFiles,
    unifiedFiles,
    summaryErrors,
    isUnifiedCampaign,
    t,
    campaignName,
  ]);

  useEffect(() => {
    if (!isLoading && campaignDetails) {
      if (campaignDetails.status === "failed" && campaignDetails?.additionalDetails?.error) {
        setShowToast({ label: campaignDetails.additionalDetails.error, key: "error" });
      }

      if (campaignDetails.status === "creating") {
        setShowToast({ label: "CAMPAIGN_STATUS_CREATING_MESSAGE", key: "info" });
      }
    }
  }, [campaignDetails, isLoading]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isLoading) return <Loader page={true} variant="PageLoader" />;

  return (
    <>
      <TagComponent campaignName={campaignName || parentCampaign?.campaignName} />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-1.5rem", marginTop: "1.5rem" }}>
        <HeaderComponent className="summary-header">{t(I18N_KEYS.COMPONENTS.ES_TQM_SUMMARY_HEADING)}</HeaderComponent>
      </div>

      <div className="campaign-summary-container campaign-update-summary">
        <ViewComposer data={viewComposerData} cardErrors={summaryErrors} />

        {showToast && (
          <Toast
            type={showToast.key === "error" ? "error" : showToast.key === "info" ? "info" : "success"}
            label={t(showToast.label)}
            onClose={() => setShowToast(null)}
          />
        )}
      </div>
    </>
  );
};

export default CampaignUpdateSummary;
