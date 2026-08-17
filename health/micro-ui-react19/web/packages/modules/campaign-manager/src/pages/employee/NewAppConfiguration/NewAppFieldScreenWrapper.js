import React, { Fragment, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, LabelFieldPair, TextInput, Switch } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { deleteField, hideField, reorderFields, addSection, selectField, handleShowAddFieldPopup, updateHeaderProperty, setPreviewStateId } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import NewDraggableField from "./NewDraggableField";
import { derivePreviewScenarios, describeScenarioConditions } from "./helpers/visibilityEvaluator";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import HeaderFieldWrapper from "./HeaderFieldWrapper";
import NewNavigationLogicWrapper from "./NewNavigationLogicWrapper";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

// Wrapper for footer label to avoid hook-in-loop violation
const FooterLabelField = React.memo(({ footerButtonConfig, index, currentLocale, dispatch, t, viewMode }) => {
  const localizedLabel = useCustomT(footerButtonConfig?.label);
  const [localValue, setLocalValue] = useState(localizedLabel || "");
  const debounceTimerRef = useRef(null);

  // Sync local value when localizedLabel changes
  useEffect(() => {
    setLocalValue(localizedLabel || "");
  }, [localizedLabel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (value) => {
      setLocalValue(value);

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce dispatch
      debounceTimerRef.current = setTimeout(() => {
        if (footerButtonConfig?.label) {
          dispatch(
            updateLocalizationEntry({
              code: footerButtonConfig?.label,
              locale: currentLocale || "en_IN",
              message: value,
            })
          );
        }
      }, 800);
    },
    [footerButtonConfig?.label, currentLocale, dispatch]
  );

  const handleBlur = useCallback(() => {
    // Force immediate dispatch on blur
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      if (footerButtonConfig?.label) {
        dispatch(
          updateLocalizationEntry({
            code: footerButtonConfig?.label,
            locale: currentLocale || "en_IN",
            message: localValue,
          })
        );
      }
    }
  }, [footerButtonConfig?.label, currentLocale, localValue, dispatch]);

  const labelMap = {
    primary: t(I18N_KEYS.APP_CONFIGURATION.Primary),
    secondary: t(I18N_KEYS.APP_CONFIGURATION.Secondary),
    teritiary: t(I18N_KEYS.APP_CONFIGURATION.Teritiary),
    link: t(I18N_KEYS.APP_CONFIGURATION.Link),
  }

  return (
    <LabelFieldPair key={`footer-${index}`} className="app-preview-app-config-drawer-action-button" removeMargin={true}>
      <div className="">
        <span>{`${labelMap[footerButtonConfig?.properties?.type] || ""} ${t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ACTION_BUTTON_LABEL)}`}</span>
      </div>
      <TextInput
        name={`footerLabel-${index}`}
        value={localValue}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        disabled={viewMode}
      />
    </LabelFieldPair>
  );
});

function NewAppFieldScreenWrapper({viewMode}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData, previewStateId } = useSelector((state) => state.remoteConfig);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  const currentCard = currentData;
  const isTemplatePage = currentCard?.type === "template";

  // Status-tag states for the "View tag state" selector; changing it drives the
  // same simulated preview state as the stepper above the phone frame.
  const tagStates = useMemo(
    () => derivePreviewScenarios(currentCard, t).filter((scenario) => scenario.format === "tag"),
    [currentCard, t]
  );

  const moveField = useCallback(
    (fromIndex, toIndex, cardIndex) => {
      dispatch(reorderFields({ cardIndex, fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleDeleteField = useCallback(
    (fieldIndex, cardIndex) => {
      dispatch(deleteField({ fieldIndex, cardIndex }));
    },
    [dispatch]
  );

  // Bumped whenever a toggle is refused, so the Switch can be remounted and show the real state
  const [toggleResetKey, setToggleResetKey] = useState(0);

  const handleHideField = useCallback(
    (fieldName, cardIndex, role, key) => {
      dispatch(hideField({ fieldName, cardIndex, role, key }));
    },
    [dispatch]
  );

  const handleSelectField = useCallback(
    (field, screen, card, cardIndex, fieldIndex) => {
      dispatch(selectField({ field, screen, card, cardIndex, fieldIndex }));
    },
    [dispatch]
  );

  const handleAddField = useCallback(
    (currentCard, card) => {
      dispatch(handleShowAddFieldPopup({ currentCard, card }));
    },
    [dispatch]
  );

  const handleAddSection = useCallback(() => {
    dispatch(addSection());
  }, [dispatch]);

  const handleTogglePreventScreenCapture = useCallback((checked) => {
    dispatch(updateHeaderProperty({ fieldKey: 'preventScreenCapture', value: checked }));
  }, [dispatch]);

  const extractTemplateFields = (node) => {
    if (!node) return [];

    // If it's an array, flatten out recursively
    if (Array.isArray(node)) {
      return node.flatMap(extractTemplateFields);
    }

    // If it's a template (like your fields), include it and also look inside for nested templates
    if (typeof node === "object" && node.type?.trim() === "template") {
      const fields = [node];

      // Extract primaryAction and secondaryAction if they exist
      if (node.primaryAction && typeof node.primaryAction === "object") {
        fields.push(...extractTemplateFields(node.primaryAction));
      }
      if (node.secondaryAction && typeof node.secondaryAction === "object") {
        fields.push(...extractTemplateFields(node.secondaryAction));
      }

      // Continue with child and children
      fields.push(...extractTemplateFields(node.child));
      fields.push(...extractTemplateFields(node.children));

      return fields;
    }

    // If it has nested objects, scan through them for templates
    if (typeof node === "object") {
      return Object.values(node).flatMap(extractTemplateFields);
    }

    return [];
  };

  const isFieldEditable = (field) => {

    const fieldConfig = fieldTypeMaster?.fieldTypeMappingConfig?.find((item) => item.metadata.format === field.format && item.metadata.type === field.type);
    // If no config found, default to editable
    if (!fieldConfig) return true;

    // Check if editable is explicitly set to false
    return fieldConfig.editable !== false;
  };


  if (!currentCard) {
    return (
      <div style={{ padding: "16px" }}>
        <p>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_NO_CONFIGURATION_DATA_AVAILABLE)}</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* <div className="app-config-drawer-subheader">
        <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_HEAD_FIELDS)}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_HEAD_FIELDS)} />
      </div>
      <Divider /> */}
      <>
          {/* Heading Field */}
          <HeaderFieldWrapper
            key="header-heading"
            label={"PAGE_HEADING"}
            type="text"
            value={currentCard?.heading}
            currentCard={currentCard}
            index={0}
            cardIndex={0}
            fieldKey="heading"
            viewMode={viewMode}
          />
          {/* Description Field */}
          <HeaderFieldWrapper
            key="header-description"
            label={"PAGE_DESCRIPTION"}
            type="textarea"
            value={currentCard?.description}
            currentCard={currentCard}
            index={1}
            cardIndex={0}
            fieldKey="description"
            viewMode={viewMode}
          />
          <Divider />
          <div className="app-config-drawer-subheader">
            <div> {currentCard?.type === "template" ? t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_FIELDS_TEMPLATE) : t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_FIELDS)}</div>
            <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={currentCard?.type === "template" ? t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_FIELDS_TEMPLATE) : t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_FIELDS)} />
          </div>
      </>
      {currentCard?.body?.map((section, index, card) => {

        const bodyFields =
          currentCard?.type === "template"
            ? extractTemplateFields(section?.fields)
            : section?.fields || [];

        const footerFields =
          currentCard?.type === "template" && currentCard?.footer
            ? extractTemplateFields(currentCard.footer)
            : [];

        // Filter editable fields only
        const editableBodyFields = bodyFields.filter(isFieldEditable);
        const editableFooterFields = footerFields.filter(isFieldEditable);
        // Combine editable body and footer fields
        const fields = [...editableBodyFields, ...editableFooterFields];
        const bodyFieldsCount = editableBodyFields.length;

        // A panel card is the screen itself (e.g. "Stock recorded successfully"), so switching it off
        // would just blank the preview - it gets no visibility toggle. The actions it carries
        // (primary/secondary buttons, listed here as separate rows) keep theirs.

        // Every screen needs a CTA. A lone button therefore has no toggle at all, and where there are
        // several, the last visible one cannot be switched off either.
        const buttonFields = fields.filter((f) => f?.format === "button");
        const visibleButtonCount = buttonFields.filter((f) => f?.hidden !== true).length;
        const isOnlyButton = buttonFields.length === 1;



        const renderFieldRow = (fieldEntry, i, c) => {
              const { type, label, active, required, Mandatory, deleteFlag, fieldName, id, ...rest } = fieldEntry;
              const isFooterField = i >= bodyFieldsCount;
              const actualCardIndex = isFooterField ? -1 : index; // Use -1 for footer fields
              const actualFieldIndex = isFooterField ? i - bodyFieldsCount : i;
              // Use id if available (for newly added fields), otherwise fall back to fieldName
              // Include role in key for dropdownTemplate fields with same fieldName but different roles
              const fieldKey = id || (rest?.role ? `${fieldName}-${rest.role}` : fieldName) || `field-${actualCardIndex}-${actualFieldIndex}`;
              return (
                <NewDraggableField
                  key={`draggable-field-${fieldKey}`}
                  type={type}
                  label={label}
                  active={active}
                  required={required}
                  isDelete={deleteFlag === true ? true : false}
                  onDelete={viewMode ? null : () => handleDeleteField(actualFieldIndex, actualCardIndex)}
                  onHide={
                    viewMode
                      ? null
                      : () => {
                          const isTurningOffLastButton =
                            rest?.format === "button" && rest?.hidden !== true && visibleButtonCount <= 1;
                          if (isTurningOffLastButton) {
                            if (typeof window.__appConfig_showToast === "function") {
                              window.__appConfig_showToast({
                                key: "error",
                                label: t(I18N_KEYS.APP_CONFIGURATION.AT_LEAST_ONE_BUTTON_REQUIRED),
                              });
                            }
                            setToggleResetKey((n) => n + 1);
                            return;
                          }
                          handleHideField(fieldName, actualCardIndex, rest?.role, rest?.key);
                        }}                  
                  onSelectField={rest?.hidden ? null : () => handleSelectField(c[i], currentCard, card[index], actualCardIndex, actualFieldIndex)}                  config={c[i]}
                  Mandatory={Mandatory}
                  rest={{...rest, fieldName}}
                  index={i}
                  fieldIndex={actualFieldIndex}
                  cardIndex={actualCardIndex}
                  indexOfCard={index}
                  moveField={viewMode ? null : type !== "template" ? moveField : null}
                  hideToggle={rest?.format === "panelCard" || (rest?.format === "button" && isOnlyButton)}
                  toggleResetKey={toggleResetKey}
                  fields={c}
                  isTemplate={currentCard?.type === "template"}
                // isFooterField={isFooterField}
                />
              );
        };

        // Template pages group runtime-conditional items after the regular elements:
        // status tags (only one shows at a time on device) and action buttons/popups.
        if (isTemplatePage) {
          const isStatusTag = (f) => f?.format === "tag";
          const isActionField = (f) => f?.format === "button" || f?.format === "actionPopup";
          const tagIndexes = [];
          const actionIndexes = [];
          const elementIndexes = [];
          fields.forEach((f, i) => (isStatusTag(f) ? tagIndexes : isActionField(f) ? actionIndexes : elementIndexes).push(i));

          return (
            <Fragment key={`card-${index}`}>
              {elementIndexes.map((i) => renderFieldRow(fields[i], i, fields))}
              {elementIndexes.length > 0 && (tagIndexes.length > 0 || actionIndexes.length > 0) && (
                <Divider className="app-config-drawer-action-divider" />
              )}
              <>
                  {tagIndexes.length > 0 && (
                    <>
                      <div className="app-config-drawer-subheader">
                        <div>{`${t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_STATUS_TAGS)} (${tagIndexes.length})`}</div>
                        <ConsoleTooltip iconFill={"#0B4B66"} style={{ marginLeft: "0rem", top: "0rem" }} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_STATUS_TAGS)} />
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#505A5F", marginBottom: "0.5rem" }}>
                        {t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_STATUS_TAGS_NOTE)}
                      </div>
                      {tagStates.length > 0 && (
                        <div style={{ marginBottom: "0.75rem" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0B4B66", marginBottom: "0.375rem" }}>
                            {t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_VIEW_TAG_STATE)}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                            {[{ id: "__default__", displayLabel: "Default" }, ...tagStates].map((scenario) => {
                              const isActive = (previewStateId || "__default__") === scenario.id;
                              return (
                                <button
                                  key={scenario.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(setPreviewStateId(scenario.id));
                                  }}
                                  style={{
                                    border: `1px solid ${isActive ? "#C84C0E" : "#D6D5D4"}`,
                                    borderRadius: "1rem",
                                    padding: "0.125rem 0.625rem",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    backgroundColor: isActive ? "#C84C0E" : "#fff",
                                    color: isActive ? "#fff" : "#363636",
                                    fontWeight: isActive ? 600 : 400,
                                  }}
                                >
                                  {scenario.displayLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const activeTagState = tagStates.find((scenario) => scenario.id === previewStateId);
                        if (!activeTagState) return null;
                        return (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.75rem" }}>
                            <span style={{ color: "#505A5F" }}>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SHOWN_WHEN)}</span>
                            {describeScenarioConditions(activeTagState).map((cond, condIndex) => (
                              <Fragment key={condIndex}>
                                {condIndex > 0 && <span style={{ color: "#C84C0E", fontWeight: 600 }}>AND</span>}
                                <span style={{ border: "1px solid #D6D5D4", borderRadius: "1rem", padding: "0 0.375rem", backgroundColor: "#FAFAFA", color: "#363636" }}>
                                  {`${cond.label} ${cond.op} ${cond.value}`}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        );
                      })()}
                      {tagIndexes.map((i) => renderFieldRow(fields[i], i, fields))}
                    </>
                  )}
                  {tagIndexes.length > 0 && actionIndexes.length > 0 && <Divider className="app-config-drawer-action-divider" />}
                  {actionIndexes.length > 0 && (
                    <>
                      <div className="app-config-drawer-subheader">
                        <div>{`${t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_ACTION_BUTTONS)} (${actionIndexes.length})`}</div>
                        <ConsoleTooltip iconFill={"#0B4B66"} style={{ marginLeft: "0rem", top: "0rem" }} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_ACTION_BUTTONS)} />
                      </div>
                      {actionIndexes.map((i) => renderFieldRow(fields[i], i, fields))}
                    </>
                  )}
              </>
            </Fragment>
          );
        }

        return (
          <Fragment key={`card-${index}`}>
            {fields?.map((fieldEntry, i, c) => renderFieldRow(fieldEntry, i, c))}
            {!viewMode && (<Button
              className={"app-config-drawer-button add-field"}
              type={"button"}
              size={"medium"}
              icon={"AddIcon"}
              variation="secondary"
              label={t(I18N_KEYS.APP_CONFIGURATION.ADD_FIELD)}
              title={t(I18N_KEYS.APP_CONFIGURATION.ADD_FIELD)}
              onClick={() => handleAddField(currentCard, card[index])}
              id={"app-config-screen-add-field-button"}
            />)}
          </Fragment>
        );
      })}

      {currentCard?.type !== "template" && currentCard?.conditionalNavigateTo?.length > 0 && (
        <>
          <Divider className="app-config-drawer-action-divider" />
          <div className="app-config-drawer-subheader">
            <div>{t(I18N_KEYS.APP_CONFIGURATION.NAVIGATION_LOGIC)}</div>
            <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_NAVIGATION_LOGIC)} />
          </div>
          <NewNavigationLogicWrapper t={t} targetPages={currentCard?.conditionalNavigationProperties?.targetPages} viewMode={viewMode} />
        </>
      )}
      {currentCard?.type !== "template" && currentCard?.config?.enableSectionAddition && !viewMode && (
        <Button
          className={"app-config-add-section"}
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t(I18N_KEYS.APP_CONFIGURATION.ADD_SECTION)}
          onClick={handleAddSection}
        />
      )}
      <>
          {currentCard?.footer?.length > 0 && (<Divider className="app-config-drawer-action-divider" />)}
          {currentCard?.footer?.length > 0 && (
            <div className="app-config-drawer-subheader">
              <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_BUTTONS)}</div>
              <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_BUTTONS)} />
            </div>)}
          {currentCard?.footer &&
            currentCard?.footer.length > 0 &&
            currentCard?.footer?.map((footerButtonConfig, index) => (
              <FooterLabelField key={`footer-${index}`} footerButtonConfig={footerButtonConfig} index={index} currentLocale={currentLocale} dispatch={dispatch} t={t} viewMode={viewMode} />
          ))}
      </>
      <>
          <Divider />
          <div className="app-config-drawer-subheader">
            <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_PRIVACY_CONTROLS)}</div>
            <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_PREVENT_SCREEN_CAPTURE)} />
          </div>
          <div className="app-config-privacy-controls-container">
            <div className="app-config-privacy-controls-container-text">{t(I18N_KEYS.APP_CONFIGURATION.PREVENT_SCREEN_CAPTURE)}</div>
            <Switch
              className={"app-config-drawer-subheader"}
              isLabelFirst={true}
              isCheckedInitially={currentCard?.preventScreenCapture || false}
              onToggle={handleTogglePreventScreenCapture}
              disable={viewMode}
            />
          </div>
      </>
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
