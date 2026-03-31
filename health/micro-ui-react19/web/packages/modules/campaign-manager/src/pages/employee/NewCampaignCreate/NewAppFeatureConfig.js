import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  HeaderComponent,
  Button,
  Footer,
  Loader,
  SVG,
  TextBlock,
  Tag,
  Switch,
  TextInput,
  LabelFieldPair,
} from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";



const ProgressStepper = ({ currentStep, totalSteps = 3 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
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
};


const SidebarTab = ({ label, tagType, isSelected, isFirst, isLast, onClick }) => {
  const { t } = useTranslation();

  const borderRadius = isSelected
    ? "0px 0.5rem 0.5rem 0px"
    : isFirst
    ? "0.5rem 0.5rem 0 0"
    : isLast
    ? "0 0 0.5rem 0.5rem"
    : "0";

  return (
    <div
      onClick={onClick}
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isSelected ? "2rem 1.5rem" : "1.5rem",
        gap: "0.625rem",
        background: isSelected ? "#FFFFFF" : "#FAFAFA",
        border: isSelected ? "1px solid #C84C0E" : "1px solid #D6D5D4",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
        // width: isSelected ? "11.5rem" : "10.4375rem",
        borderRadius,
      }}
    >
      <span
        style={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 700,
          fontSize: isSelected ? "1.25rem" : "1rem",
          lineHeight: "114%",
          textAlign: "center",
          color: "#0B4B66",
        }}
      >
        {t(label)}
      </span>
      {isSelected && tagType && (
        <Tag
          label={tagType === "ready" ? t("FEATURE_READY_TO_USE") : t("FEATURE_REQUIRES_SETUP")}
          type={tagType === "ready" ? "success" : "warning"}
          showIcon={false}
        />
      )}
    </div>
  );
};



const NumberStepper = ({ value, onChange, min = 0, max = 99 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "12.0625rem", height: "2.5rem" }}>
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
        -
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
};


const QRCodeConfig = ({ config, onConfigChange }) => {
  const { t } = useTranslation();

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
        <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: "114%", color: "#0B4B66" }}>
          {t("ENABLE_DYNAMIC_QR_CODE")} *
        </span>
        <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
          {t("ENABLE_DYNAMIC_QR_CODE_DESC")}
        </span>
      </div>
      <Switch
        isCheckedInitially={config?.enableDynamicQR ?? true}
        onToggle={(val) => onConfigChange({ ...config, enableDynamicQR: val })}
      />
    </Card>
  );
};


const PhotoVerificationConfig = ({ config, onConfigChange }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Number of Daily Photos */}
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
          <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: "114%", color: "#0B4B66" }}>
            {t("NUMBER_OF_DAILY_PHOTOS")} *
          </span>
          <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
            {t("NUMBER_OF_DAILY_PHOTOS_DESC")}
          </span>
        </div>
        <NumberStepper
          value={config?.dailyPhotoCount ?? 0}
          onChange={(val) => onConfigChange({ ...config, dailyPhotoCount: val })}
        />
      </Card>

      {/* Session Timings */}
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
          <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: "114%", color: "#0B4B66" }}>
            {t("SESSION_TIMINGS")} *
          </span>
          <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
            {t("SESSION_TIMINGS_DESC")}
          </span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <LabelFieldPair style={{ width: "15.3125rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: "19px", color: "#0B0C0C" }}>
              {t("START_TIME")}
            </span>
            <TextInput
              type="time"
              value={config?.startTime || ""}
              onChange={(e) => onConfigChange({ ...config, startTime: e.target.value })}
            />
          </LabelFieldPair>
          <LabelFieldPair style={{ width: "15.3125rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: "19px", color: "#0B0C0C" }}>
              {t("END_TIME")}
            </span>
            <TextInput
              type="time"
              value={config?.endTime || ""}
              onChange={(e) => onConfigChange({ ...config, endTime: e.target.value })}
            />
          </LabelFieldPair>
        </div>
      </Card>
    </div>
  );
};


const ConfigPanelRenderer = ({ feature, config, onConfigChange }) => {
  const { t } = useTranslation();

  const renderConfigFields = () => {
    const code = feature?.code?.toLowerCase?.() || feature?.format?.toLowerCase?.() || "";
    if (code.includes("qr") || code.includes("scanner")) {
      return <QRCodeConfig config={config} onConfigChange={onConfigChange} />;
    }
    if (code.includes("photo") || code.includes("verification")) {
      return <PhotoVerificationConfig config={config} onConfigChange={onConfigChange} />;
    }
    // Ready-to-use features (offline mode, map view, etc.) — no config needed
    return null;
  };

  return (
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
        alignItems: "flex-end",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        <HeaderComponent style={{ fontSize: "1.5rem", lineHeight: "114%", color: "#0B4B66", margin: 0 }}>
          {t(feature?.code)}
        </HeaderComponent>
        <TextBlock
          body={t(feature?.description || `${feature?.code}_DESCRIPTION`)}
          bodyStyle={{ color: "#787878", fontSize: "1rem", lineHeight: "137%", margin: 0 }}
        />
      </div>
      {renderConfigFields()}
    </Card>
  );
};


const NewAppFeatureConfig = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    campaignNumber,
    projectType,
    tenantId,
    moduleName,
    features: featureParam,
    step,
  } = Digit.Hooks.useQueryParams();

  const featureCodes = useMemo(() => featureParam?.split(",") || [], [featureParam]);
  const currentStep = parseInt(step || "0", 10);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [featureConfigs, setFeatureConfigs] = useState({});

  // Fetch module schemas to get feature details
  const { isLoading, data: moduleSchemas } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [{ name: "AppModuleSchema" }],
      "MDMSDATA-AppModuleSchema-FeatureConfig",
      Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "AppModuleSchema")
    )
  );

  // Extract features matching selected codes from the module schema
  const allFeatures = useMemo(() => {
    const moduleFeatures = moduleSchemas?.find((mod) => mod?.code === moduleName)?.features || [];
    return moduleFeatures.filter(
      (f) => featureCodes.includes(f?.code) || featureCodes.includes(f?.format)
    );
  }, [moduleSchemas, moduleName, featureCodes]);

  const selectedFeature = allFeatures[selectedFeatureIndex];
  const isLastFeature = selectedFeatureIndex === allFeatures.length - 1;

  const handleConfigChange = useCallback(
    (newConfig) => {
      if (!selectedFeature?.code) return;
      setFeatureConfigs((prev) => ({
        ...prev,
        [selectedFeature.code]: newConfig,
      }));
    },
    [selectedFeature]
  );

  const handleBack = useCallback(() => {
    navigate(
      `/${window.contextPath}/employee/campaign/new-app-module-features?campaignNumber=${campaignNumber}&projectType=${projectType}&tenantId=${tenantId}&moduleName=${moduleName}`
    );
  }, [navigate, campaignNumber, projectType, tenantId, moduleName]);

  const handleNext = useCallback(() => {
    if (!isLastFeature) {
      setSelectedFeatureIndex((prev) => prev + 1);
      return;
    }
    // All features configured — navigate to success screen
    navigate(
      `/${window.contextPath}/employee/campaign/new-app-feature-success?campaignNumber=${campaignNumber}&projectType=${projectType}&tenantId=${tenantId}&moduleName=${moduleName}`,
      {
        state: {
          featureConfigs,
          features: featureCodes,
        },
      }
    );
  }, [navigate, isLastFeature, campaignNumber, projectType, tenantId, moduleName, featureConfigs, featureCodes]);

  if (isLoading) {
    return (
      <Loader
        page={true}
        variant="OverlayLoader"
        loaderText={t(I18N_KEYS.CAMPAIGN_CREATE.LOADING)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: "0.75rem" }}>
      {/* Main Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem",
          gap: "1.5rem",
          background: "#FFFFFF",
          borderRadius: "0.75rem 0.75rem 0 0",
        }}
      >
        {/* Progress Stepper + Close */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <ProgressStepper currentStep={currentStep} totalSteps={3} />
          <SVG.Close
            fill="#0B0C0C"
            width="1.5rem"
            height="1.5rem"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={handleBack}
          />
        </div>

        {/* Heading */}
        <HeaderComponent style={{ fontSize: "2rem", lineHeight: "114%", color: "#0B4B66", margin: 0 }}>
          {t("CUSTOMIZE_YOUR_FEATURES")}
        </HeaderComponent>

        {/* Subheading */}
        <TextBlock
          body={t("CUSTOMIZE_FEATURES_DESCRIPTION")}
          bodyStyle={{ color: "#787878", fontSize: "1rem", lineHeight: "137%", margin: 0 }}
        />

        {/* Sidebar + Config Panel */}
        <div style={{ display: "flex", gap: "4.25rem", alignItems: "flex-start" }}>
          {/* Left Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "11.5rem",
              flexShrink: 0,
            }}
          >
            {allFeatures.map((feature, index) => (
              <SidebarTab
                key={feature?.code || index}
                label={feature?.code}
                tagType={feature?.requiresSetup ? "setup" : "ready"}
                isSelected={index === selectedFeatureIndex}
                isFirst={index === 0}
                isLast={index === allFeatures.length - 1}
                onClick={() => setSelectedFeatureIndex(index)}
              />
            ))}
          </div>

          {/* Right Config Panel */}
          {selectedFeature && (
            <ConfigPanelRenderer
              feature={selectedFeature}
              config={featureConfigs[selectedFeature?.code] || {}}
              onConfigChange={handleConfigChange}
            />
          )}
        </div>
      </div>

      {/* Footer with Back / Next|Save */}
      <Footer
        actionFields={[
          <Button
            key="back"
            label={t(I18N_KEYS.COMMON.GO_BACK)}
            title={t(I18N_KEYS.COMMON.GO_BACK)}
            variation="secondary"
            onClick={handleBack}
            style={{ minWidth: "15.0625rem" }}
          />,
          <Button
            key="next-save"
            label={isLastFeature ? t("SAVE") : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
            title={isLastFeature ? t("SAVE") : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
            variation="primary"
            onClick={handleNext}
            style={{ minWidth: "15.0625rem" }}
          />,
        ]}
      />
    </div>
  );
};

export default NewAppFeatureConfig;