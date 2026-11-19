import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardText, Button, PopUp } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { isFieldSelected, renderTemplateComponent } from "./helpers/templateRendererHelpers";
import { getStateGroups, filterFieldsByState, withStatePlaceholders } from "./helpers/previewStateHelpers";
import { setShowPopupPreview, setSelectedStateGroup } from "./redux/remoteConfigSlice";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

/**
 * Render a section (body or footer)
 */
const renderSection = (section, sectionName, fieldTypeMasterData, selectedField, t, onFieldClick, data, onGroupClick, selectedStateGroup) => {
  if (!section || section.length === 0) return null;

  return (
    <>
      {section
        // `hidden` may hold a device-side expression ("{{fn:...}} == true"), which is a truthy
        // string here - only an explicit boolean true should hide a field in the preview.
        .filter((field) => field.hidden !== true)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((field, index) => {
          // A group with no state picked stands in for whatever the app will draw here. The
          // stand-in is a field from the config, so it renders through the same path as the
          // real elements; clicking anywhere on it points the panel at the group.
          if (field?.statePlaceholderFor) {
            const group = field.statePlaceholderFor;
            const isGroupSelected = selectedStateGroup === group?.name;
            const selectGroup = () => onGroupClick?.(group);
            return (
              <div
                key={`state-placeholder-${group?.name}`}
                // A stand-in written in the config paints its own card or tag, so the wrapper
                // stays bare; only the fallback draws a box of its own.
                className={`app-preview-state-placeholder${field?.format ? "" : " plain"}${
                  isGroupSelected ? " selected" : ""
                }`}
                onClick={selectGroup}
              >
                {field?.format ? (
                  renderTemplateComponent(field, fieldTypeMasterData, selectedField, t, selectGroup, data, sectionName, index)
                ) : (
                  <span className="app-preview-state-placeholder-text">{t(group?.label)}</span>
                )}
              </div>
            );
          }
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
  const { showPopupPreview, selectedPreviewStates, selectedStateGroup } = useSelector((state) => state.remoteConfig);
  const handleGroupClick = (group) => dispatch(setSelectedStateGroup(group?.name));
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  // A screen that declares states shows one of them at a time, the way the app would. Until one
  // is picked the group stands in as a placeholder, so the author is never shown a screen the
  // app cannot produce. Pages that declare no states are handed back their own arrays untouched.
  const stateGroups = getStateGroups(data);
  // Placeholders go in first, while the neutral group's fields are still there to mark the spot;
  // the filter then thins out the groups that do have a state picked.
  const bodyFields = filterFieldsByState(
    withStatePlaceholders(data?.body?.[0]?.fields, selectedPreviewStates, stateGroups),
    selectedPreviewStates,
    stateGroups
  );
  const footerFields = filterFieldsByState(data?.footer, selectedPreviewStates, stateGroups);

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
          // This card scrolls (overflow: auto below) but everything inside it is a preview, so it
          // held no focusable element and a keyboard user had no way to scroll it at all
          // (axe scrollable-region-focusable). The tab stop is the fix; the name stops it being an
          // unlabelled stop. role="group" is required for the name: aria-label is prohibited on a
          // role-less <div>, which axe reports as needs-review. Not role="region" - that is a
          // landmark, and two preview cards would then collide on landmark-unique.
          // None of this affects layout; Card spreads these after its own props.
          tabIndex={0}
          role="group"
          aria-label={t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_PREVIEW_REGION)}
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
              bodyFields &&
              renderSection(bodyFields, "body", fieldTypeMasterData, selectedField, t, onFieldClick, data, handleGroupClick, selectedStateGroup)}
        </Card>

        {/* FOOTER - sticky at bottom */}
        {footerFields?.length > 0 && (
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
            {footerFields.map((footerItem, index) => {
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
          description={popupConfig.type === "alert" ? undefined : t(popupConfig.description) || ""}
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
          iconFill={popupConfig?.titleIconFill}
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