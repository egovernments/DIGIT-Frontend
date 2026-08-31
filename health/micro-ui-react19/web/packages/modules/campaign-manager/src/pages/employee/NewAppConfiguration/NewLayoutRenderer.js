import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardText, Button, PopUp } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { isFieldSelected, renderTemplateComponent } from "./helpers/templateRendererHelpers";
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

          const rendered = renderTemplateComponent(fieldWithId, fieldTypeMasterData, selectedField, t, onFieldClick, data, sectionName, index);

          // The app wraps a field in a grey card only when conditions.wrapInCard is set
          // (visibilityCondition alone renders flat in the app) - mirror exactly that
          const isDependent = field?.conditions?.wrapInCard === true;
          if (isDependent) {
            return (
              <div
                key={`dependent-${fieldWithId.id}`}
                className="app-preview-dependent-field"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #d6d5d4",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                {rendered}
              </div>
            );
          }
          return rendered;
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
  return (
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
          className={`app-preview-card ${
            data?.flow === "CHECKLIST" || /checklist/i.test(t(data?.heading || "")) ? "checklist-preview" : ""
          }`}
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
              borderTop: "1px solid #D6D5D4",
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
          description={t(popupConfig.description) || ""}
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
  );
};

export default NewLayoutRenderer;