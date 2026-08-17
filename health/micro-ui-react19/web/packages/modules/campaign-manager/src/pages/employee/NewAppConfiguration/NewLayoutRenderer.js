import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardText, Button, PopUp } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { isFieldSelected, renderTemplateComponent } from "./helpers/templateRendererHelpers";
import { derivePreviewScenarios } from "./helpers/visibilityEvaluator";
import { PreviewStateContext } from "./helpers/previewStateContext";
import { setShowPopupPreview } from "./redux/remoteConfigSlice";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";


/**
 * Render a section (body or footer)
 */
const renderSection = (section, sectionName, fieldTypeMasterData, selectedField, t, onFieldClick, data) => {
  if (!section || section.length === 0) return null;

  return (
    <>
      {section
        // `hidden` may hold a device-side expression ("{{fn:...}} == true"), which is a truthy
        // string here - only an explicit boolean true should hide a field in the preview.
        .filter((field) => field.hidden !== true)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((field, index) => {
          // Ensure field has an id for React keys
          const fieldWithId = {
            ...field,
            id: field.id || field.fieldName || `${sectionName}-${field.format}-${index}`,
          };

          return renderTemplateComponent(fieldWithId, fieldTypeMasterData, selectedField, t, onFieldClick, data, sectionName, index);
        })}
    </>
  );
};

/**
 * Main NewLayoutRenderer Component
 * Renders template-based layouts with components fetched from ComponentRegistryService
 */
const NewLayoutRenderer = ({ data = {}, selectedField, t, onFieldClick }) => {
  // Get field type master data from Redux
  const dispatch = useDispatch();
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { showPopupPreview } = useSelector((state) => state.remoteConfig);
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  // Get popup config from selected field if it's an actionPopup
  const popupConfig = selectedField?.properties?.popupConfig || {};

  // Simulated preview state: scenarios derived from the page's `visible` expressions.
  // The preview opens in the Default state (only always-visible elements); the nav
  // stepper walks through each condition-based state.
  const scenarios = useMemo(() => derivePreviewScenarios(data, t), [data, t]);
  const states = useMemo(
    () => (scenarios.length > 0 ? [{ id: "__default__", displayLabel: "Default", assignments: {}, terms: [] }, ...scenarios] : []),
    [scenarios]
  );
  const [stateIndex, setStateIndex] = useState(0);
  useEffect(() => setStateIndex(0), [data]);
  const safeIndex = states.length > 0 ? Math.min(stateIndex, states.length - 1) : 0;
  const activeScenario = states.length > 0 ? states[safeIndex] : null;

  const stepState = (delta) => setStateIndex((states.length + safeIndex + delta) % states.length);
  const navButtonStyle = {
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "50%",
    border: "1px solid #C84C0E",
    backgroundColor: "#fff",
    color: "#C84C0E",
    fontSize: "1rem",
    lineHeight: 1,
    cursor: "pointer",
  };

  return (
    <PreviewStateContext.Provider value={{ scenario: activeScenario }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      {states.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 20 }}>
          <button type="button" style={navButtonStyle} title="Previous state" onClick={() => stepState(-1)}>
            {"\u2039"}
          </button>
          <span style={{ fontWeight: 600, color: "#0B4B66", minWidth: "14rem", textAlign: "center" }}>
            {`${activeScenario?.displayLabel} (${safeIndex + 1}/${states.length})`}
          </span>
          <button type="button" style={navButtonStyle} title="Next state" onClick={() => stepState(1)}>
            {"\u203A"}
          </button>
        </div>
      )}
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          backgroundColor: "#eee",
          display: "flex",
          flexDirection: "column",
          height: "90%",
        }}
      >
        <Card
          className="app-preview-card"
          style={{
            padding: "1rem",
            backgroundColor: "#eee",
            boxShadow: "none",
            flex: 1,
            overflow: "auto",
          }}
        >
            {/* HEADER */}
            {data?.heading && (
              <CardHeader className="app-preview-card-header" styles={{fontSize: "2rem", fontWeight: 700 }}>
                {t(data.heading)}
              </CardHeader>
            )}
            {data?.description && (
              <CardText className="app-preview-sub-heading">
                {t(data.description)}
              </CardText>
            )}

            {/* BODY */}
            {data?.body &&
              data?.body?.[0]?.fields &&
              renderSection(data?.body?.[0]?.fields, "body", fieldTypeMasterData, selectedField, t, onFieldClick, data)}
        </Card>

        {/* FOOTER - sticky at bottom */}
        {data?.footer?.length > 0 && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #e0e0e0",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {data.footer.map((footerItem, index) => {
              return renderTemplateComponent(footerItem, fieldTypeMasterData, selectedField, t, onFieldClick, data, "footer", index);
            })}
          </div>
        )}
      </div>
      {/* Popup Preview for actionPopup fields */}
      {showPopupPreview && selectedField?.format === "actionPopup" && (
        <PopUp
          type={popupConfig.type || "default"}
          heading={t(popupConfig.title) || t(I18N_KEYS.APP_CONFIGURATION.DEFAULT_POPUP_HEADING)}
          alertHeading={t(popupConfig.title) || t(I18N_KEYS.APP_CONFIGURATION.DEFAULT_POPUP_HEADING)}
          alertMessage={t(popupConfig.description) || ""}
          onClose={() => {
            dispatch(setShowPopupPreview(false));
          }}
          onOverlayClick={() => {
            dispatch(setShowPopupPreview(false));
          }}
          style={{
            maxHeight: "90%",
            maxWidth: "90%",
          }}
          // footerChildren={popupConfig?.footerActions?.map((action, index) =>
          //   renderTemplateComponent(
          //     action,
          //     fieldTypeMasterData,
          //     selectedField,
          //     t,
          //     onFieldClick,
          //     data,
          //     "popupFooter",
          //     index
          //   )
          // )}
          footerChildren={popupConfig?.footerActions?.map((action, idx) => {
            return (
              <Button
                key={idx}
                type={action?.format || "button"}
                label={t(action.label) || ""}
                title={t(action.label) || ""}
                size={action.properties?.size || "medium"}
                variation={action.properties?.type || "primary"}
                onClick={() => {}}
              />
            );
          })}
          showIcon={!!popupConfig?.titleIcon}
          customIcon={popupConfig?.titleIcon}
        >
          {/* Popup Body */}
          {popupConfig?.body?.map((section, index) => (
            <Fragment key={index}>
              {renderTemplateComponent(section, fieldTypeMasterData, selectedField, t, null, data, "popupBody", index)}
            </Fragment>
          ))}
        </PopUp>
      )}
    </MobileBezelFrame>
    </div>
    </PreviewStateContext.Provider>
  );
};

export default NewLayoutRenderer;