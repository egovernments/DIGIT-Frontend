import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardText, Button, PopUp } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { isFieldSelected, renderTemplateComponent } from "./helpers/templateRendererHelpers";
import { setShowPopupPreview } from "./redux/remoteConfigSlice";

/**
 * Render a section (body or footer)
 */
const renderSection = (section, sectionName, fieldTypeMasterData, selectedField, t, onFieldClick, data) => {
  if (!section || section.length === 0) return null;

  return (
    <>
      {section
        .filter((field) => !field.hidden)
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
  return (
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#eee",
        }}
      >
        <Card
          type="secondary"
          className="app-card template-layout-card"
          style={{
            flex: 1,
            boxShadow: "none",
            overflow: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            position: "relative",
            zIndex: 0,
            isolation: "isolate",
          }}
        >
          {/* HEADER */}
          {data?.heading && <CardHeader className="app-preview-card-header">{t(data.heading)}</CardHeader>}
          {data?.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

          {/* BODY */}
          {data?.body &&
            data?.body?.[0]?.fields &&
            renderSection(data?.body?.[0]?.fields, "body", fieldTypeMasterData, selectedField, t, onFieldClick, data)}
        </Card>

        {/* FOOTER */}
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
          heading={t(popupConfig.title) || t("DEFAULT_POPUP_HEADING")}
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
