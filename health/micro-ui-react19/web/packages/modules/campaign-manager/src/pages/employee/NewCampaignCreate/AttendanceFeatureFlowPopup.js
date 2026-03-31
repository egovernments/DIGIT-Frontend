import { useState, useMemo, useCallback } from "react";
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
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

/**
 * Dummy feature data for the Attendance module.
 * In production, replace with MDMS fetch.
 */
const ATTENDANCE_FEATURES = [
  {
    code: "QR_CODE_SCANNING",
    description:
      "Quickly scan and verify resources being delivered to beneficiaries.",
    requiresSetup: true,
  },
  {
    code: "PHOTO_VERIFICATION",
    description:
      "Quickly scan and verify resources being delivered to beneficiaries.",
    requiresSetup: true,
  },
  {
    code: "SIGNATURE_VERIFICATION",
    description:
      "Quickly scan and verify resources being delivered to beneficiaries.",
    requiresSetup: true,
  },
  {
    code: "MAP_VIEW",
    description:
      "Quickly scan and verify resources being delivered to beneficiaries.",
    requiresSetup: false,
  },
  {
    code: "OFFLINE_MODE",
    description:
      "Quickly scan and verify resources being delivered to beneficiaries.",
    requiresSetup: false,
  },
];

/* ─── Shared Sub-components ────────────────────────────────────────────────── */

const FeatureTag = ({ requiresSetup }) => {
  const { t } = useTranslation();
  return (
    <Tag
      label={
        requiresSetup
          ? t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_REQUIRES_SETUP)
          : t(I18N_KEYS.CAMPAIGN_CREATE.FEATURE_READY_TO_USE)
      }
      type={requiresSetup ? "warning" : "success"}
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

/* ─── Step 1: Feature Selection Grid (Screens 2-3) ────────────────────────── */

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
        maxHeight: "80vh",
        overflow: "auto",
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
        {/* <SVG.Close fill="#0B0C0C" width="1.5rem" height="1.5rem" style={{ cursor: "pointer", flexShrink: 0 }} onClick={onClose} /> */}
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {featureRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "1.5rem" }}>
            {row.map((feature) => {
              const isSelected = selectedFeatures.includes(feature.code);
              return (
                <Card
                  key={feature.code}
                  className={`module-card ${isSelected ? "selected-card" : ""}`}
                  onClick={() => onToggleFeature(feature.code)}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    width: "19.9375rem",
                    border: isSelected
                      ? "2.5px solid #C84C0E"
                      : "1px solid #787878",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    filter: isSelected
                      ? "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16))"
                      : "none",
                    background: "#FFFFFF",
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
                    <FeatureTag requiresSetup={feature.requiresSetup} />
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

/* ─── Step 2: Feature Configuration (Screens 4-5-6) ───────────────────────── */

const FeatureConfigStep = ({
  features,
  currentStep,
  onBack,
  onNextOrSave,
  onClose,
  featureConfigs,
  setFeatureConfigs,
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
    [activeFeature, setFeatureConfigs],
  );

  const handleLocalNext = () => {
    if (!isLast) {
      setActiveIndex((prev) => prev + 1);
    } else {
      onNextOrSave();
    }
  };

  const renderConfigPanel = () => {
    const code = activeFeature?.code?.toLowerCase() || "";
    const config = featureConfigs[activeFeature?.code] || {};

    if (code.includes("qr") || code.includes("scanner")) {
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              flex: 1,
            }}
          >
            <span
              style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}
            >
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE)} *
            </span>
            <span
              style={{
                fontWeight: 400,
                fontSize: "0.875rem",
                color: "#787878",
              }}
            >
              {t(I18N_KEYS.CAMPAIGN_CREATE.ENABLE_DYNAMIC_QR_CODE_DESC)}
            </span>
          </div>
          <Switch
            isCheckedInitially={config?.enableDynamicQR ?? true}
            onToggle={(val) =>
              handleConfigChange({ ...config, enableDynamicQR: val })
            }
          />
        </Card>
      );
    }

    if (code.includes("photo")) {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}
              >
                {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS)} *
              </span>
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  color: "#787878",
                }}
              >
                {t(I18N_KEYS.CAMPAIGN_CREATE.NUMBER_OF_DAILY_PHOTOS_DESC)}
              </span>
            </div>
            <NumberStepper
              value={config?.dailyPhotoCount ?? 0}
              onChange={(val) =>
                handleConfigChange({ ...config, dailyPhotoCount: val })
              }
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{ fontWeight: 700, fontSize: "1rem", color: "#0B4B66" }}
              >
                {t(I18N_KEYS.CAMPAIGN_CREATE.SESSION_TIMINGS)} *
              </span>
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  color: "#787878",
                }}
              >
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
                  onChange={(e) =>
                    handleConfigChange({ ...config, startTime: e.target.value })
                  }
                />
              </LabelFieldPair>
              <LabelFieldPair style={{ width: "15.3125rem" }}>
                <span style={{ fontSize: "1rem", color: "#0B0C0C" }}>
                  {t(I18N_KEYS.CAMPAIGN_CREATE.END_TIME)}
                </span>
                <TextInput
                  type="time"
                  value={config?.endTime || ""}
                  onChange={(e) =>
                    handleConfigChange({ ...config, endTime: e.target.value })
                  }
                />
              </LabelFieldPair>
            </div>
          </Card>
        </div>
      );
    }

    // Ready-to-use features — no config panel needed
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
      {/* Body */}
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
        {/* Stepper + Close */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <ProgressStepper currentStep={currentStep} totalSteps={3} />
          {/* <SVG.Close fill="#0B0C0C" width="1.5rem" height="1.5rem" style={{ cursor: "pointer", flexShrink: 0 }} onClick={onClose} /> */}
        </div>

        <HeaderComponent
          style={{
            fontSize: "2rem",
            lineHeight: "114%",
            color: "#0B4B66",
            margin: 0,
          }}
        >
          {t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_YOUR_FEATURES)}
        </HeaderComponent>
        <TextBlock
          body={t(I18N_KEYS.CAMPAIGN_CREATE.CUSTOMIZE_FEATURES_DESCRIPTION)}
          bodyStyle={{ color: "#787878", fontSize: "1rem", margin: 0 }}
        />

        {/* Sidebar + Panel */}
        <div
          style={{ display: "flex", gap: "4.25rem", alignItems: "flex-start" }}
        >
          {/* Left Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}
          >
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
                    border: isActive
                      ? "1px solid #C84C0E"
                      : "1px solid #D6D5D4",
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
                  {isActive && (
                    <FeatureTag requiresSetup={feature.requiresSetup} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Panel */}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              <HeaderComponent
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "114%",
                  color: "#0B4B66",
                  margin: 0,
                }}
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
          label={
            isLast
              ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE)
              : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)
          }
          title={
            isLast
              ? t(I18N_KEYS.CAMPAIGN_CREATE.SAVE)
              : t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)
          }
          variation="primary"
          onClick={handleLocalNext}
          style={{ minWidth: "15.0625rem", height: "2.5rem" }}
        />
      </div>
    </div>
  );
};

/* ─── Step 3: Success Panel (Screen 7) ─────────────────────────────────────── */

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
            label={t(I18N_KEYS.CAMPAIGN_CREATE.CONTINUE_TO_APP_CONFIGURATION)}
            title={t(I18N_KEYS.CAMPAIGN_CREATE.CONTINUE_TO_APP_CONFIGURATION)}
            variation="primary"
            onClick={onContinue}
            style={{ width: "100%" }}
          />,
        ]}
        showAsSvg={true}
      />
    </div>
  );
};

/* ─── Main Popup Orchestrator ──────────────────────────────────────────────── */

const AttendanceFeatureFlowPopup = ({
  onClose,
  campaignNumber,
  projectType,
  tenantId,
}) => {
  const navigate = useNavigate();
  const [flowStep, setFlowStep] = useState(0); // 0=select, 1=configure, 2=success
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureConfigs, setFeatureConfigs] = useState({});

  const selectedFeatureObjects = useMemo(
    () => ATTENDANCE_FEATURES.filter((f) => selectedFeatures.includes(f.code)),
    [selectedFeatures],
  );

  const handleToggleFeature = useCallback((code) => {
    setSelectedFeatures((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const handleSkip = useCallback(() => {
    onClose();
    // navigate(
    //   `/${window.contextPath}/employee/campaign/app-config-init?campaignNumber=${campaignNumber}&flow=ATTENDANCE&version=1`,
    // );
  }, [onClose, navigate, campaignNumber]);

  const handleContinueToConfig = useCallback(() => {
    if (selectedFeatures.length > 0) {
      setFlowStep(1);
    }
  }, [selectedFeatures]);

  const handleBackToSelection = useCallback(() => {
    setFlowStep(0);
  }, []);

  const handleSaveConfig = useCallback(() => {
    setFlowStep(2);
  }, []);

  const handleFinalContinue = useCallback(() => {
    onClose();
    navigate(
      `/${window.contextPath}/employee/campaign/app-config-init?campaignNumber=${campaignNumber}&flow=ATTENDANCE&version=1`,
    );
  }, [onClose, navigate, campaignNumber]);

  /** Portal so the popup escapes side panels and fills the viewport layer */
  function BodyPortal({ children }) {
    if (typeof document === "undefined") return null; // SSR guard
    return ReactDOM.createPortal(children, document.body);
  }

  return (
    // <BodyPortal>
      <PopUp
        style={{ maxWidth: "70rem", width: "100%", padding: 0 }}
        type="default"
        className="attendance-feature-flow-popup"
        onOverlayClick={onClose}
        onClose={onClose}
        heading=""
        children={[
          <div key="flow-content">
            {flowStep === 0 && (
              <FeatureSelectionStep
                features={ATTENDANCE_FEATURES}
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
                onSkip={handleSkip}
                onNext={handleContinueToConfig}
                onClose={onClose}
              />
            )}
            {flowStep === 1 && (
              <FeatureConfigStep
                features={selectedFeatureObjects}
                currentStep={1}
                onBack={handleBackToSelection}
                onNextOrSave={handleSaveConfig}
                onClose={onClose}
                featureConfigs={featureConfigs}
                setFeatureConfigs={setFeatureConfigs}
              />
            )}
            {flowStep === 2 && <SuccessStep onContinue={handleFinalContinue} />}
          </div>,
        ]}
        sortFooterChildren={false}
      />
    // </BodyPortal>
  );
};

export default AttendanceFeatureFlowPopup;
