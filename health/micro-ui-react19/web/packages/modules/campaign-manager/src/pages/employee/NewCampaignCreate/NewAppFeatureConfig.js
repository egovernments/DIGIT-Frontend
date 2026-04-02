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
  Toast,
} from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const MDMS_CONTEXT_PATH =
  window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

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
      {/* Gap #4: use I18N_KEYS constants */}
      {isSelected && tagType && (
        <Tag
          label={tagType === "setup" ? t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_REQUIRES_SETUP) : t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_READY_TO_USE)}
          type={tagType === "setup" ? "warning" : "success"}
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
          {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE)} *
        </span>
        <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE_DESC)}
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
            {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS)} *
          </span>
          <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS_DESC)}
          </span>
        </div>
        <NumberStepper
          value={config?.dailyPhotoCount ?? 0}
          onChange={(val) => onConfigChange({ ...config, dailyPhotoCount: val })}
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
          <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: "114%", color: "#0B4B66" }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.SESSION_TIMINGS)} *
          </span>
          <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.SESSION_TIMINGS_DESC)}
          </span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <LabelFieldPair style={{ width: "15.3125rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: "19px", color: "#0B0C0C" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.START_TIME)}
            </span>
            <TextInput
              type="time"
              value={config?.startTime || ""}
              onChange={(e) => onConfigChange({ ...config, startTime: e.target.value })}
            />
          </LabelFieldPair>
          <LabelFieldPair style={{ width: "15.3125rem" }}>
            <span style={{ fontSize: "1rem", lineHeight: "19px", color: "#0B0C0C" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.END_TIME)}
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

/* Gap #1 fix: Separate config component for Signature Verification */
const SignatureVerificationConfig = ({ config, onConfigChange }) => {
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
          {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_SIGNATURE_VERIFICATION)} *
        </span>
        <span style={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: "114%", color: "#787878" }}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_SIGNATURE_VERIFICATION_DESC)}
        </span>
      </div>
      <Switch
        isCheckedInitially={config?.enableSignature ?? true}
        onToggle={(val) => onConfigChange({ ...config, enableSignature: val })}
      />
    </Card>
  );
};

/* Gap #1 fix: Reordered matching — signature before photo, removed "verification" from photo branch */
const ConfigPanelRenderer = ({ feature, config, onConfigChange }) => {
  const { t } = useTranslation();

  const renderConfigFields = () => {
    const code = feature?.code?.toLowerCase?.() || feature?.format?.toLowerCase?.() || "";
    if (code.includes("qr") || code.includes("scanner")) {
      return <QRCodeConfig config={config} onConfigChange={onConfigChange} />;
    }
    if (code.includes("signature")) {
      return <SignatureVerificationConfig config={config} onConfigChange={onConfigChange} />;
    }
    if (code.includes("photo")) {
      return <PhotoVerificationConfig config={config} onConfigChange={onConfigChange} />;
    }
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

/* Gap #2 fix: MDMS persistence helper */
const saveFeatureConfigToMDMS = async ({
  tenantId,
  campaignNumber,
  projectType,
  moduleName,
  selectedFeatures,
  featureConfigs,
}) => {
  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.FeatureConfig`;
  const payload = {
    Mdms: {
      tenantId,
      schemaCode,
      isActive: true,
      data: {
        project: campaignNumber,
        projectType,
        module: moduleName,
        selectedFeatures,
        featureConfigs,
      },
    },
  };

  const searchResponse = await Digit.CustomService.getResponse({
    url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode,
        isActive: true,
        filters: {
          project: campaignNumber,
          module: moduleName,
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
            selectedFeatures,
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

  const resolvedTenantId = tenantId || Digit?.ULBService?.getCurrentTenantId();
  const featureCodes = useMemo(() => featureParam?.split(",").filter(Boolean) || [], [featureParam]);
  const currentStep = parseInt(step || "0", 10);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [featureConfigs, setFeatureConfigs] = useState({});
  /* Gap #7 fix: saving + error state */
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const { isLoading, data: moduleSchemas } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV1Criteria(
      resolvedTenantId,
      CONSOLE_MDMS_MODULENAME,
      [{ name: "AppModuleSchema" }],
      "MDMSDATA-AppModuleSchema-FeatureConfig",
      Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "AppModuleSchema")
    )
  );

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

  /* Gap #3 fix: navigate to existing route */
  const handleBack = useCallback(() => {
    navigate(
      `/${window.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&projectType=${projectType}&tenantId=${resolvedTenantId}`
    );
  }, [navigate, campaignNumber, projectType, resolvedTenantId]);

  /* Gap #2 + #7 fix: persist to MDMS before navigating */
  const handleNext = useCallback(async () => {
    if (!isLastFeature) {
      setSelectedFeatureIndex((prev) => prev + 1);
      return;
    }
    setIsSaving(true);
    try {
      await saveFeatureConfigToMDMS({
        tenantId: resolvedTenantId,
        campaignNumber,
        projectType,
        moduleName,
        selectedFeatures: featureCodes,
        featureConfigs,
      });
      navigate(
        `/${window.contextPath}/employee/campaign/new-app-feature-success?campaignNumber=${campaignNumber}&projectType=${projectType}&tenantId=${resolvedTenantId}&moduleName=${moduleName}`
      );
    } catch (error) {
      console.error("Error saving feature config:", error);
      setShowToast({
        key: "error",
        label: t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_CONFIG_SAVE_ERROR),
      });
    } finally {
      setIsSaving(false);
    }
  }, [navigate, isLastFeature, campaignNumber, projectType, resolvedTenantId, moduleName, featureConfigs, featureCodes, t]);

  if (isLoading) {
    return (
      <Loader
        page={true}
        variant="OverlayLoader"
        loaderText={t(I18N_KEYS.CAMPAIGN_CREATE.LOADING)}
      />
    );
  }

  /* Gap #6 fix: empty state when no features found */
  if (!isLoading && allFeatures.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", padding: "1.5rem", gap: "1.5rem" }}>
        <HeaderComponent style={{ fontSize: "2rem", color: "#0B4B66", margin: 0 }}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_YOUR_FEATURES)}
        </HeaderComponent>
        <TextBlock
          body={t(I18N_KEYS.CAMPAIGN_CREATE.NO_FEATURES_FOUND)}
          bodyStyle={{ color: "#787878", fontSize: "1rem", margin: 0 }}
        />
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
          ]}
        />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", borderRadius: "0.75rem" }}>
        {/* Gap #7 fix: saving overlay */}
        {isSaving && (
          <Loader
            page={true}
            variant="OverlayLoader"
            loaderText={t(I18N_KEYS.CAMPAIGN_CREATE.SAVING_FEATURES_CONFIG_IN_SERVER)}
          />
        )}

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

          {/* Gap #4 fix: use I18N_KEYS constants */}
          <HeaderComponent style={{ fontSize: "2rem", lineHeight: "114%", color: "#0B4B66", margin: 0 }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_YOUR_FEATURES)}
          </HeaderComponent>

          <TextBlock
            body={t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_FEATURES_DESCRIPTION)}
            bodyStyle={{ color: "#787878", fontSize: "1rem", lineHeight: "137%", margin: 0 }}
          />

          <div style={{ display: "flex", gap: "4.25rem", alignItems: "flex-start" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "11.5rem",
                flexShrink: 0,
              }}
            >
              {/* Gap #5 fix: use disabled field from MDMS instead of requiresSetup */}
              {allFeatures.map((feature, index) => (
                <SidebarTab
                  key={feature?.code || index}
                  label={feature?.code}
                  tagType={feature?.disabled === false ? "setup" : "ready"}
                  isSelected={index === selectedFeatureIndex}
                  isFirst={index === 0}
                  isLast={index === allFeatures.length - 1}
                  onClick={() => setSelectedFeatureIndex(index)}
                />
              ))}
            </div>

            {selectedFeature && (
              <ConfigPanelRenderer
                feature={selectedFeature}
                config={featureConfigs[selectedFeature?.code] || {}}
                onConfigChange={handleConfigChange}
              />
            )}
          </div>
        </div>

        <Footer
          actionFields={[
            <Button
              key="back"
              label={t(I18N_KEYS.COMMON.GO_BACK)}
              title={t(I18N_KEYS.COMMON.GO_BACK)}
              variation="secondary"
              onClick={handleBack}
              isDisabled={isSaving}
              style={{ minWidth: "15.0625rem" }}
            />,
            <Button
              key="next-save"
              label={isLastFeature ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE) : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
              title={isLastFeature ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE) : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
              variation="primary"
              onClick={handleNext}
              isDisabled={isSaving}
              style={{ minWidth: "15.0625rem" }}
            />,
          ]}
        />
      </div>
      {/* Gap #7 fix: error toast */}
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

export default NewAppFeatureConfig;