import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Card,
  HeaderComponent,
  Button,
  PopUp,
  Tag,
  Switch,
  TextInput,
  LabelFieldPair,
  TextBlock,
  PanelCard,
  SVG,
  Loader,
  Toast,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { HCMCONSOLE_APPCONFIG_MODULENAME } from "./CampaignDetails";

const MDMS_CONTEXT_PATH =
  window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/* ─── Shared Sub-components ────────────────────────────────────────────────── */

const FeatureTag = ({ isSetup }) => {
  const { t } = useTranslation();
  return (
    <Tag
      label={

        isSetup
          ? t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_REQUIRES_SETUP)
          : t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_READY_TO_USE)
      }
      type={isSetup ? "warning" : "success"}
      showIcon={false}
    />
  );
};

const ProgressStepper = ({ currentStep, totalSteps = 3 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: "0.5rem",
          borderRadius: "5rem",
          background: i <= currentStep ? "#C84C0E" : "#FFFFFF",
          border: i <= currentStep ? "none" : "1px solid #C84C0E",
          boxSizing: "border-box",
        }}
      />
    ))}
  </div>
);

const NumberStepper = ({ value, onChange, min = 0, max = 99 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "12.0625rem",
      height: "2.5rem",
    }}
  >
    <div
      onClick={() => onChange(Math.max(min, value - 1))}
      style={{
        width: "2.5rem",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEEEEE",
        border: "1px solid #505A5F",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "1.5rem",
        color: "#505A5F",
        userSelect: "none",
      }}
    >
      −
    </div>
    <div
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid #505A5F",
        borderBottom: "1px solid #505A5F",
        fontFamily: "Roboto, sans-serif",
        fontSize: "1rem",
        color: "#0B0C0C",
      }}
    >
      {String(value).padStart(2, "0")}
    </div>
    <div
      onClick={() => onChange(Math.min(max, value + 1))}
      style={{
        width: "2.5rem",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEEEEE",
        border: "1px solid #505A5F",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "1.5rem",
        color: "#505A5F",
        userSelect: "none",
      }}
    >
      +
    </div>
  </div>
);

/* ─── Step 1: Feature Selection Grid ───────────────────────────────────────── */

const FeatureSelectionStep = ({
  features,
  selectedFeatures,
  onToggleFeature,
  onSkip,
  onNext,
  onClose,
}) => {
  const { t } = useTranslation();

  const featureRows = [];
  for (let i = 0; i < features.length; i += 3) {
    featureRows.push(features.slice(i, i + 3));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "2rem",
        background: "#FFFFFF",
        borderRadius: "0.75rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flex: 1,
          }}
        >
          <HeaderComponent
            style={{
              fontSize: "2rem",
              lineHeight: "114%",
              color: "#0B4B66",
              margin: 0,
            }}
          >
            {t(I18N_KEYS.CAMPAIGN_CREATE.MODULE_FEATURES)}
          </HeaderComponent>
          <TextBlock
            body={t(I18N_KEYS.CAMPAIGN_CREATE.MODULE_FEATURES_DESCRIPTION)}
            bodyStyle={{
              color: "#787878",
              fontSize: "1rem",
              lineHeight: "137%",
              margin: 0,
            }}
          />
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {featureRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "1.5rem" }}>
            {row.map((feature) => {
              const isSelected = selectedFeatures.includes(feature.format);
              const isDisabled = feature.disabled;
              return (
                <Card
                  key={feature.code}
                  className={`module-card ${isSelected ? "selected-card" : ""}`}
                  onClick={() =>  onToggleFeature(feature.format)}
                  style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
                    position: "relative",
                    width: "319px",
                    border: isSelected
                      ? "2.5px solid #C84C0E"
                      : "1px solid #787878",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    filter: isSelected
                      ? "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16))"
                      : "none",
                    background: "#FFFFFF",
                    height: "206px",
                  }}
                >
                  {isSelected ? (
                    <SVG.CheckCircle
                      fill="#C84C0E"
                      width="1.25rem"
                      height="1.25rem"
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "1rem",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "1rem",
                        width: "1.5rem",
                        height: "1.5rem",
                        background: "#D9D9D9",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <HeaderComponent
                      style={{
                        fontSize: "1.25rem",
                        lineHeight: "114%",
                        color: "#0B4B66",
                        margin: 0,
                      }}
                    >
                      {t(feature.code)}
                    </HeaderComponent>
                    <FeatureTag isSetup={feature.requiresSetup} />
                    <p
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        lineHeight: "137%",
                        color: "#787878",
                        margin: 0,
                      }}
                    >
                      {t(feature.description)}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 400,
                          fontSize: "1rem",
                          lineHeight: "137%",
                          textDecoration: "underline",
                          color: "#C84C0E",
                        }}
                      >
                        {t(I18N_KEYS.CAMPAIGN_CREATE.VIEW_FEATURE_DETAILS)}
                      </span>
                      <SVG.ArrowForward
                        fill="#C84C0E"
                        width="1.5rem"
                        height="1.5rem"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", gap: "1.25rem" }}
      >
        <Button
          label={t(I18N_KEYS.CAMPAIGN_CREATE.SKIP)}
          title={t(I18N_KEYS.CAMPAIGN_CREATE.SKIP)}
          variation="secondary"
          onClick={onSkip}
          style={{ minWidth: "15.0625rem", height: "2.5rem" }}
        />
        <Button
          label={t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
          title={t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
          variation="primary"
          onClick={onNext}
          isDisabled={selectedFeatures.length === 0}
          style={{ minWidth: "15.0625rem", height: "2.5rem" }}
        />
      </div>
    </div>
  );
};

/* ─── Step 2: Feature Configuration ────────────────────────────────────────── */

const FeatureConfigStep = ({
  features,
  currentStep,
  onBack,
  onNextOrSave,
  onClose,
  featureConfigs,
  setFeatureConfigs,
  isSaving,
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];
  const isLast = activeIndex === features.length - 1;

  const handleConfigChange = useCallback(
    (newConfig) => {
      setFeatureConfigs((prev) => ({
        ...prev,
        [activeFeature.code]: newConfig,
      }));
    },
    [activeFeature, setFeatureConfigs]
  );

  const handleLocalNext = () => {
    if (!isLast) {
      setActiveIndex((prev) => prev + 1);
    } else {
      onNextOrSave();
    }
  };

  const renderConfigPanel = () => {
    const format = activeFeature?.format || "";
    const config = featureConfigs[activeFeature?.code] || {};

    if (format === "scanner") {
      return (
        <Card
          style={{
            border: "1px solid #D6D5D4",
            borderRadius: "0.75rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE)} 
            </span>
            <span style={{ fontWeight: 400, fontSize: "0.875rem", color: "#787878" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE_DESC)}
            </span>
          </div>
          <Switch
            isCheckedInitially={config?.enableDynamicQR ?? true}
            onToggle={(val) => handleConfigChange({ ...config, enableDynamicQR: val })}
          />
        </Card>
      );
    }

    if (format === "photoVerification") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card
            style={{
              border: "1px solid #D6D5D4",
              borderRadius: "0.75rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}>
                {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS)} 
              </span>
              <span style={{ fontWeight: 400, fontSize: "0.875rem", color: "#787878" }}>
                {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS_DESC)}
              </span>
            </div>
            <NumberStepper
              value={config?.dailyPhotoCount ?? 0}
              onChange={(val) => handleConfigChange({ ...config, dailyPhotoCount: val })}
            />
          </Card>
          <Card
            style={{
              border: "1px solid #D6D5D4",
              borderRadius: "0.75rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}>
                {t(I18N_KEYS.CAMPAIGN_CREATE.SESSION_TIMINGS)} 
              </span>
              <span style={{ fontWeight: 400, fontSize: "0.875rem", color: "#787878" }}>
                {t(I18N_KEYS.CAMPAIGN_CREATE.SESSION_TIMINGS_DESC)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <LabelFieldPair style={{ width: "15.3125rem" }}>
                <span style={{ fontSize: "1rem", color: "#0B0C0C" }}>
                  {t(I18N_KEYS.CAMPAIGN_CREATE.START_TIME)}
                </span>
                <TextInput
                  type="time"
                  value={config?.startTime || ""}
                  onChange={(e) => handleConfigChange({ ...config, startTime: e.target.value })}
                />
              </LabelFieldPair>
              <LabelFieldPair style={{ width: "15.3125rem" }}>
                <span style={{ fontSize: "1rem", color: "#0B0C0C" }}>
                  {t(I18N_KEYS.CAMPAIGN_CREATE.END_TIME)}
                </span>
                <TextInput
                  type="time"
                  value={config?.endTime || ""}
                  onChange={(e) => handleConfigChange({ ...config, endTime: e.target.value })}
                />
              </LabelFieldPair>
            </div>
          </Card>
        </div>
      );
    }

    if (format === "signatureVerification") {
      return (
        <Card
          style={{
            border: "1px solid #D6D5D4",
            borderRadius: "0.75rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_SIGNATURE_VERIFICATION)} *
            </span>
            <span style={{ fontWeight: 400, fontSize: "0.875rem", color: "#787878" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_SIGNATURE_VERIFICATION_DESC)}
            </span>
          </div>
          <Switch
            isCheckedInitially={config?.enableSignature ?? true}
            onToggle={(val) => handleConfigChange({ ...config, enableSignature: val })}
          />
        </Card>
      );
    }

    // Ready-to-use features (map, offlineMode) — no config panel
    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        borderRadius: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem",
          gap: "1.5rem",
          background: "#FFFFFF",
          borderRadius: "0.75rem 0.75rem 0 0",
          overflow: "auto",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <ProgressStepper currentStep={currentStep} totalSteps={3} />
        </div>

        <HeaderComponent
          style={{ fontSize: "2rem", lineHeight: "114%", color: "#0B4B66", margin: 0 }}
        >
          {t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_YOUR_FEATURES)}
        </HeaderComponent>
        <TextBlock
          body={t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_FEATURES_DESCRIPTION)}
          bodyStyle={{ color: "#787878", fontSize: "1rem", margin: 0 }}
        />

        <div style={{ display: "flex", gap: "4.25rem", alignItems: "flex-start" }}>
          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
            {features.map((feature, index) => {
              const isActive = index === activeIndex;
              const isFirst = index === 0;
              const isLastTab = index === features.length - 1;
              return (
                <div
                  key={feature.code}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: isActive ? "2rem 1.5rem" : "1.5rem",
                    gap: "0.625rem",
                    background: isActive ? "#FFFFFF" : "#FAFAFA",
                    border: isActive ? "1px solid #C84C0E" : "1px solid #D6D5D4",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                    borderRadius: isActive
                      ? "0px 0.5rem 0.5rem 0px"
                      : isFirst
                      ? "0.5rem 0.5rem 0 0"
                      : isLastTab
                      ? "0 0 0.5rem 0.5rem"
                      : "0",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: isActive ? "1.25rem" : "1rem",
                      lineHeight: "114%",
                      textAlign: "center",
                      color: "#0B4B66",
                    }}
                  >
                    {t(feature.code)}
                  </span>
                  {isActive && <FeatureTag isSetup={feature.requiresSetup} />}
                </div>
              );
            })}
          </div>

          {/* Config Panel */}
          <Card
            style={{
              flex: 1,
              background: "#FAFAFA",
              border: "2px solid #EEEEEE",
              borderRadius: "0.5rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
              <HeaderComponent
                style={{ fontSize: "1.5rem", lineHeight: "114%", color: "#0B4B66", margin: 0 }}
              >
                {t(activeFeature?.code)}
              </HeaderComponent>
              <TextBlock
                body={t(activeFeature?.description || "")}
                bodyStyle={{ color: "#787878", fontSize: "1rem", margin: 0 }}
              />
            </div>
            {renderConfigPanel()}
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1.5rem",
          gap: "1.25rem",
          background: "#FFFFFF",
          boxShadow: "0px -1px 10.4px rgba(0, 0, 0, 0.15)",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
      >
        <Button
          label={t(I18N_KEYS.COMMON.GO_BACK)}
          title={t(I18N_KEYS.COMMON.GO_BACK)}
          variation="secondary"
          onClick={onBack}
          style={{ minWidth: "15.0625rem", height: "2.5rem" }}
        />
        <Button
          label={isLast ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE) : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
          title={isLast ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE) : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
          variation="primary"
          onClick={handleLocalNext}
          isDisabled={isSaving}
          style={{ minWidth: "15.0625rem", height: "2.5rem" }}
        />
      </div>
    </div>
  );
};

/* ─── Step 3: Success Panel ────────────────────────────────────────────────── */

const SuccessStep = ({ onContinue }) => {
  const { t } = useTranslation();

  return (
    <div>
      <PanelCard
        type="success"
        message={t(I18N_KEYS.CAMPAIGN_CREATE.GREAT_YOU_ARE_ALL_SET)}
        info=""
        response=""
        children={[
          <div key="desc" style={{ margin: 0 }}>
            <p
              style={{
                margin: 0,
                color: "#505A5F",
                fontSize: "0.875rem",
                lineHeight: "137%",
              }}
            >
              {t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_CONFIG_SUCCESS_DESCRIPTION)}
            </p>
          </div>,
        ]}
        footerChildren={[
          <Button
            key="continue"
            label={t(I18N_KEYS.CAMPAIGN_CREATE.START_APPLICATION_CONFIGURATION)}
            title={t(I18N_KEYS.CAMPAIGN_CREATE.START_APPLICATION_CONFIGURATION)}
            variation="primary"
            onClick={onContinue}
            style={{ width: "100%" }}
          />,
        ]}
      />
    </div>
  );
};

/* ─── MDMS Helpers ─────────────────────────────────────────────────────────── */

/**
 * Creates FormConfig for ATTENDANCE from FormConfigTemplate if it doesn't exist.
 * Mirrors what AppModule.js does for other modules.
 */
const ensureFormConfigExists = async ({ tenantId, campaignNumber, projectType }) => {
  const formConfigSchemaCode = `${CONSOLE_MDMS_MODULENAME}.${HCMCONSOLE_APPCONFIG_MODULENAME}`;

  // Check if FormConfig already exists for this campaign + ATTENDANCE
  const existingResponse = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: formConfigSchemaCode,
        isActive: true,
        filters: {
          project: campaignNumber,
          name: "ATTENDANCE",
        },
      },
    },
    useCache: false,
  });

  if (existingResponse?.mdms && existingResponse.mdms.length > 0) {
    // Already exists — return it
    return existingResponse.mdms[0];
  }

  // Fetch the ATTENDANCE template for the project type
  const templateSchemaCode = `${CONSOLE_MDMS_MODULENAME}.FormConfigTemplate`;
  const templateResponse = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: templateSchemaCode,
        isActive: true,
        filters: {
          name: "ATTENDANCE",
          project: projectType,
        },
      },
    },
    useCache: false,
  });

  if (!templateResponse?.mdms || templateResponse.mdms.length === 0) {
    throw new Error("No ATTENDANCE FormConfigTemplate found for project type: " + projectType);
  }

  const templateData = templateResponse.mdms[0].data;

  // Create FormConfig from template, scoped to this campaign
  const formConfigData = {
    ...templateData,
    project: campaignNumber,
    isSelected: true,
    active: true,
    version: 1,
  };

  const createResponse = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_create/${formConfigSchemaCode}`,
    body: {
      Mdms: {
        tenantId,
        schemaCode: formConfigSchemaCode,
        data: formConfigData,
        isActive: true,
      },
    },
    useCache: false,
  });

  return createResponse?.mdms;
};

/**
 * Updates hidden flags in FormConfig based on selected features.
 * Same logic as useUpdateAppConfigForFeatures but inline for the popup flow.
 */
const updateFormConfigFeatureFlags = async ({
  tenantId,
  campaignNumber,
  selectedFormats,
  availableFeatures,
}) => {
  const formConfigSchemaCode = `${CONSOLE_MDMS_MODULENAME}.${HCMCONSOLE_APPCONFIG_MODULENAME}`;

  // Fetch the FormConfig for ATTENDANCE
  const response = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: formConfigSchemaCode,
        isActive: true,
        filters: {
          project: campaignNumber,
          name: "ATTENDANCE",
        },
      },
    },
    useCache: false,
  });

  if (!response?.mdms || response.mdms.length === 0) {
    throw new Error("No FormConfig found for ATTENDANCE");
  }

  const record = response.mdms[0];

  // All available feature formats for ATTENDANCE
  const featureFormats = availableFeatures
    .filter((f) => !f.disabled)
    .map((f) => f.format);

  // Update hidden flags on pages → properties based on format match
  const updatedFlows = record.data.flows.map((flow) => {
    if (!flow.pages) return flow;

    return {
      ...flow,
      pages: flow.pages.map((page) => ({
        ...page,
        properties: page.properties?.map((property) => {
          let hidden = property.hidden;

          // Check if field is required (always visible)
          const isRequired = property.validations?.some(
            (rule) => rule.type === "required" && rule.value
          );

          if (isRequired) {
            hidden = false;
          } else if (featureFormats.includes(property.format)) {
            // Toggle hidden based on whether this format was selected
            hidden = !selectedFormats.includes(property.format);
          }

          return { ...property, hidden };
        }),
      })),
    };
  });

  // Update MDMS record
  return Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_update/${formConfigSchemaCode}`,
    body: {
      Mdms: {
        ...record,
        data: {
          ...record.data,
          flows: updatedFlows,
        },
      },
    },
    useCache: false,
  });
};

/**
 * Saves additional feature configuration (photo count, session timings, etc.)
 * to a separate MDMS schema.
 */
const saveFeatureConfigToMDMS = async ({
  tenantId,
  campaignNumber,
  projectType,
  selectedFormats,
  featureConfigs,
}) => {
  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.AttendanceFeatureConfig`;
  const payload = {
    Mdms: {
      tenantId,
      schemaCode,
      isActive: true,
      data: {
        project: campaignNumber,
        projectType,
        module: "ATTENDANCE",
        selectedFormats,
        featureConfigs,
      },
    },
  };

  // Check if a record already exists
  const searchResponse = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode,
        isActive: true,
        filters: {
          project: campaignNumber,
          module: "ATTENDANCE",
        },
      },
    },
    useCache: false,
  });

  if (searchResponse?.mdms && searchResponse.mdms.length > 0) {
    const existing = searchResponse.mdms[0];
    return Digit.CustomService.getResponse({
      url: `/${MDMS_CONTEXT_PATH}/v2/_update/${schemaCode}`,
      body: {
        Mdms: {
          ...existing,
          data: {
            ...existing.data,
            selectedFormats,
            featureConfigs,
          },
        },
      },
      useCache: false,
    });
  }

  return Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_create/${schemaCode}`,
    body: payload,
    useCache: false,
  });
};

/* ─── Main Popup Orchestrator ──────────────────────────────────────────────── */

const AttendanceFeatureFlowPopup = ({
  onClose,
  campaignNumber,
  projectType,
  tenantId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [flowStep, setFlowStep] = useState(0); // 0=select, 1=configure, 2=success
  const [selectedFormats, setSelectedFormats] = useState([]); // stores format values, not codes
  const [featureConfigs, setFeatureConfigs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const resolvedTenantId = tenantId || Digit?.ULBService?.getCurrentTenantId();

  // Fetch features from AppModuleSchema instead of hardcoded data
  const { isLoading: isModuleSchemaLoading, data: moduleSchemaData } =
    Digit.Hooks.useCustomAPIHook(
      Digit.Utils.campaign.getMDMSV1Criteria(
        resolvedTenantId,
        CONSOLE_MDMS_MODULENAME,
        [{ name: "AppModuleSchema" }],
        "MDMSDATA-AppModuleSchema-ATTENDANCE",
        Digit.Utils.campaign.getMDMSV1Selector(
          CONSOLE_MDMS_MODULENAME,
          "AppModuleSchema"
        )
      )
    );

  // Extract ATTENDANCE features from AppModuleSchema
  const attendanceFeatures = useMemo(() => {
    if (!moduleSchemaData) return [];
    const attendanceModule = moduleSchemaData.find(
      (mod) => mod.code === "ATTENDANCE"
    );
    return attendanceModule?.features || [];
  }, [moduleSchemaData]);

  // Only show features that can be configured (not disabled)
  const configurableFeatures = useMemo(
    () => attendanceFeatures.filter((f) => !f.disabled),
    [attendanceFeatures]
  );

  // Features selected by format for config step
  const selectedFeatureObjects = useMemo(
    () => attendanceFeatures.filter((f) => selectedFormats.includes(f.format)),
    [selectedFormats, attendanceFeatures]
  );

  // Only configurable features among selected (for config step sidebar)
  const selectedConfigurableFeatures = useMemo(
    () => selectedFeatureObjects.filter((f) => !f.disabled),
    [selectedFeatureObjects]
  );

  const handleToggleFeature = useCallback((format) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  }, []);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContinueToConfig = useCallback(() => {
    if (selectedFormats.length > 0) {
      setFlowStep(1);
    }
  }, [selectedFormats]);

  const handleBackToSelection = useCallback(() => {
    setFlowStep(0);
  }, []);

  const handleSaveConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      // Step 1: Ensure FormConfig exists for ATTENDANCE (create from template if needed)
      await ensureFormConfigExists({
        tenantId: resolvedTenantId,
        campaignNumber,
        projectType,
      });

      // Step 2: Update hidden flags in FormConfig based on selected features
      await updateFormConfigFeatureFlags({
        tenantId: resolvedTenantId,
        campaignNumber,
        selectedFormats,
        availableFeatures: attendanceFeatures,
      });

      // Step 3: Save additional feature config (photo count, session timings, etc.)
      await saveFeatureConfigToMDMS({
        tenantId: resolvedTenantId,
        campaignNumber,
        projectType,
        selectedFormats,
        featureConfigs,
      });

      setFlowStep(2);
    } catch (error) {
      console.error("Error saving attendance feature config:", error);
      setShowToast({
        key: "error",
        label: t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_CONFIG_SAVE_ERROR),
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    resolvedTenantId,
    campaignNumber,
    projectType,
    selectedFormats,
    featureConfigs,
    attendanceFeatures,
    t,
  ]);

  const handleFinalContinue = useCallback(() => {
    onClose();
    navigate(
      `/${window.contextPath}/employee/campaign/app-config-init?campaignNumber=${campaignNumber}&flow=ATTENDANCE&version=1`
    );
  }, [onClose, navigate, campaignNumber]);

  if (isModuleSchemaLoading) {
    return (
      <PopUp
        style={{ maxWidth: "70rem", width: "100%", padding: 0 }}
        type="default"
        className="attendance-feature-flow-popup"
        onOverlayClick={onClose}
        onClose={onClose}
        heading=""
        children={[<Loader key="loader" page={false} />]}
        sortFooterChildren={false}
      />
    );
  }

  return (
    <>
      <PopUp
        style={{ maxWidth: "70rem", width: "100%", padding: 0 }}
        type="default"
        className="attendance-feature-flow-popup"
        onOverlayClick={onClose}
        onClose={onClose}
        heading=""
        children={[
          <div key="flow-content">
            {isSaving && (
              <Loader
                page={true}
                variant="OverlayLoader"
                loaderText={t(
                  I18N_KEYS.CAMPAIGN_CREATE.SAVING_FEATURES_CONFIG_IN_SERVER
                )}
              />
            )}
            {flowStep === 0 && (
              <FeatureSelectionStep
                features={attendanceFeatures}
                selectedFeatures={selectedFormats}
                onToggleFeature={handleToggleFeature}
                onSkip={handleSkip}
                onNext={handleContinueToConfig}
                onClose={onClose}
              />
            )}
            {flowStep === 1 && (
              <FeatureConfigStep
                features={selectedConfigurableFeatures}
                currentStep={1}
                onBack={handleBackToSelection}
                onNextOrSave={handleSaveConfig}
                onClose={onClose}
                featureConfigs={featureConfigs}
                setFeatureConfigs={setFeatureConfigs}
                isSaving={isSaving}
              />
            )}
            {flowStep === 2 && (
              <SuccessStep onContinue={handleFinalContinue} />
            )}
          </div>,
        ]}
        sortFooterChildren={false}
      />
      {showToast && (
        <Toast
          type="error"
          label={showToast.label}
          onClose={() => setShowToast(null)}
        />
      )}
    </>
  );
};

export default AttendanceFeatureFlowPopup;