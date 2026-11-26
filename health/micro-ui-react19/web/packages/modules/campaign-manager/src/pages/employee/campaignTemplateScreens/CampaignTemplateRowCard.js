import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { useNavigate } from "react-router-dom";
import { Tag, Button, CardText, Card, Toast } from "@egovernments/digit-ui-components";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import useCampaignStore from "../../../hooks/useCampaignStore";
import { getTemplateCycles } from "../../../utils/campaignTemplate";

/**
 * The round type a template sets up, in the form the round-type step would have recorded.
 *
 * That step is skipped when a template is used, so the answer comes from how many cycles the
 * template declares, kept within what the campaign type allows - the same limit the step itself
 * applies. A template with no cycles says nothing, and the campaign is saved with no round type,
 * exactly as it is today.
 */
const resolveRoundType = (templateCycles, projectTypeRecord) => {
  if (!Array.isArray(templateCycles) || templateCycles.length === 0) return "";
  const allowed = projectTypeRecord?.roundTypes;
  const offers = (code) => !Array.isArray(allowed) || allowed.length === 0 || allowed.includes(code);
  if (templateCycles.length > 1) return offers("MULTI_ROUND") ? "HCM_MULTI_ROUND" : "HCM_SINGLE_ROUND";
  return offers("SINGLE_ROUND") ? "HCM_SINGLE_ROUND" : "HCM_MULTI_ROUND";
};

const CampaignTemplateRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams, clearParams] = useCampaignStore("HCM_ADMIN_CONSOLE_DATA", {});
  const [showToast, setShowToast] = useState(null);

  const templateName = rowData?.data?.name || "NA";
  const description = rowData?.data?.description || "NA";
  const modules = rowData?.data?.modules || [];
  const projectTypeCode = rowData?.data?.projectTypeCode || "";
  const disease = rowData?.data?.disease || "";

  // Fetch project types from MDMS to get full project type data
  const reqCriteria = useMemo(() => ({
    url: `${getMDMSUrl(true)}/v1/_search`,
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
    changeQueryName: `projectTypes_${projectTypeCode}`,
  }), [tenantId, projectTypeCode]);

  const { data: projectTypesData } = Digit.Hooks.useCustomAPIHook({
    ...reqCriteria,
    config: {
      enabled: !!projectTypeCode,
    },
  });

  // Find the matching project type from MDMS data
  const projectTypeData = useMemo(() => {
    const projectTypes = projectTypesData?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes || [];
    return projectTypes.find((pt) => pt.code === projectTypeCode);
  }, [projectTypesData, projectTypeCode]);

  // A template's rounds are the cycles of the campaign type it carries, so the chip reads them
  // from there. A separate list of its own could disagree with what the template actually sets up.
  const deliveryCycles = getTemplateCycles(rowData?.data);
  const duration = deliveryCycles.length > 0
    ? `${deliveryCycles.length} ${deliveryCycles.length > 1 ? t(I18N_KEYS.COMPONENTS.ROUND_PLURAL) : t(I18N_KEYS.COMPONENTS.ROUND_SINGLE)} | ${deliveryCycles[0]?.durationInDays || 0} ${t(I18N_KEYS.COMPONENTS.DAYS)}`
    : "NA";

  const createdBy = rowData?.data?.partnerName || "NA";
  const usedIn = rowData?.data?.usedIn || "NA";
  const imageUrl = rowData?.data?.imageDetails?.url || "";
  const imageAlt = rowData?.data?.imageDetails?.altText || templateName;

  return (
    <Card className="campaign-template-row-card">
      {/* Left side - Image */}
      <div className="campaign-template-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className="campaign-template-image" />
        ) : (
          <div className="campaign-template-no-image">{t(I18N_KEYS.COMPONENTS.NO_IMAGE)}</div>
        )}
      </div>

      {/* Middle - Content */}
      <div className="campaign-template-content">
        <div className="campaign-template-content-tag-button">
          {/* Tags above title */}
          <div className="campaign-template-tags">
            {projectTypeCode && (
              <Tag
                label={t(projectTypeCode)}
                showIcon={false}
                type="error"
                stroke={false}
              />
            )}
            {disease && (
              <Tag
                label={t(disease)}
                showIcon={false}
                type="monochrome"
                stroke={false}
              />
            )}
          </div>
          {/* Right side - Button */}
          <div className="campaign-template-action">
            <Button
              label={t(I18N_KEYS.COMPONENTS.USE_TEMPLATE)}
              title={t(I18N_KEYS.COMPONENTS.USE_TEMPLATE)}
              id={`campaign-use-template-action-${rowData?.data?.id}`}
              variation="secondary"
              size="large"
              className={"use-template-button"}
              onClick={() => {
                // Check if project type data is loaded
                if (!projectTypesData) {
                  setShowToast({ key: "warning", label: t(I18N_KEYS.COMPONENTS.HCM_PROJECT_TYPE_LOADING) });
                  return;
                }

                // Get project types from the API response
                const projectTypes = projectTypesData?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes || [];
                const matchedProjectType = projectTypes.find((pt) => pt.code === projectTypeCode);

                // Check if the project type from template exists in available options
                if (!matchedProjectType) {
                  setShowToast({
                    key: "error",
                    label: t("HCM_PROJECT_TYPE_NOT_FOUND", { projectType: projectTypeCode })
                  });
                  return;
                }

                // Generate campaign name similar to normal flow: projectType_month_year
                const formattedDate = new Date()
                  .toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/ /g, "_")
                  .toLowerCase();
                const campaignName = `${projectTypeCode}_${formattedDate}`;

                // Set the full campaign type from template (overwrites existing data)
                //
                // The campaign type comes from MDMS, not from the template's own copy of it: that
                // is what the type dropdown and the create payload read, and it keeps the
                // template's cycles out of session state, which is persisted.
                //
                // `templateId` is what carries the choice forward. It is saved onto the campaign
                // at create time, and the delivery screens look the template up again from there.
                const sessionData = {
                  CampaignType: matchedProjectType,
                  CampaignName: campaignName,
                  DateSelection: {
                    startDate: "",
                    endDate: "",
                  },
                  // Step 1 is skipped here, so the round type comes from the cycles the template
                  // sets up - see resolveRoundType above. Left empty, the campaign would say
                  // nothing about its rounds while the template gave it several cycles.
                  CycleSelection: resolveRoundType(deliveryCycles, matchedProjectType),
                  templateId: rowData?.data?.id || rowData?.uniqueIdentifier,
                };

                // Set data via Redux store (persisted via store subscriber)
                setParams(sessionData);

                // Navigate to campaign create flow - step 2 (campaign name), skipping step 1 (type selection)
                // fromTemplate=true ensures the campaign type is disabled when going back to step 1
                navigate(`/${window.contextPath}/employee/campaign/create-campaign?key=2&fromTemplate=true`);
              }}
            />
          </div>

        </div>

<div className="campaign-template-tit-des-wrap">
        {/* Title */}
        <div className="typography heading-m campaign-template-title">{t(templateName)}</div>

        {/* Description */}
        <CardText className="typography body-xs campaign-template-description">
          {t(description) || t(I18N_KEYS.COMPONENTS.DEFAULT_DESCRIPTION)}
        </CardText>

        {/* Modules */}
        {modules.length > 0 && (
          <div className="campaign-template-modules">
            <span className="typography heading-xs campaign-template-modules-label">
              {t(I18N_KEYS.COMPONENTS.MODULES)}:
            </span>
            <span className="typography heading-xs campaign-template-modules-text">
              {modules.map((module) => t(module)).join(" | ")}
            </span>
          </div>
        )}
</div>


        {/* Details Row */}
        <div className="campaign-template-details">
          <div className="campaign-template-detail-item">
            <span className="campaign-template-detail-label">{t(I18N_KEYS.COMPONENTS.DURATION)}</span>
            <CardText className="campaign-template-detail-value">{duration}</CardText>
          </div>
          <div className="campaign-template-detail-item">
            <span className="campaign-template-detail-label">{t(I18N_KEYS.COMPONENTS.CREATED_BY)}</span>
            <CardText className="campaign-template-detail-value">{t(createdBy)}</CardText>
          </div>
          <div className="campaign-template-detail-item">
            <span className="campaign-template-detail-label">{t(I18N_KEYS.COMPONENTS.USED_IN)}</span>
            <CardText className="campaign-template-detail-value">{usedIn}</CardText>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={showToast?.key === "error" ? "error" : showToast?.key === "warning" ? "warning" : "success"}
          label={showToast?.label}
          onClose={() => setShowToast(null)}
        />
      )}
    </Card>
  );
};

export default CampaignTemplateRowCard;
