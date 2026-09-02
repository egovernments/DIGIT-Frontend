import React, { Fragment, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, LabelFieldPair, TextInput, Switch, Tag } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { deleteField, hideField, reorderFields, addSection, selectField, handleShowAddFieldPopup, updateHeaderProperty } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import NewDraggableField from "./NewDraggableField";
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
  const { currentData } = useSelector((state) => state.remoteConfig);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  const currentCard = currentData;

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

  // True when a body section renders its own Buttons subheader (button-format rows) — the footer
  // label inputs then join that section instead of opening a second "Buttons" heading
  const hasBodyButtonRows = (currentCard?.body || []).some((section) => {
    const sectionBodyFields = currentCard?.type === "template" ? extractTemplateFields(section?.fields) : (section?.fields || []);
    const sectionFooterFields = currentCard?.type === "template" && currentCard?.footer ? extractTemplateFields(currentCard.footer) : [];
    return [...sectionBodyFields, ...sectionFooterFields].filter(isFieldEditable).some((f) => f?.format === "button");
  });

  return (
    <React.Fragment>
      {/* <div className="app-config-drawer-subheader">
        <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_HEAD_FIELDS)}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_HEAD_FIELDS)} />
      </div>
      <Divider /> */}
      {!(currentCard?.isSuccessorErrorScreen) && (
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
            maxLength={64}
          />
         <Divider />
        </>
      )}
      <div className="app-config-drawer-subheader">
        <div> {currentCard?.type === "template" ? t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_FIELDS_TEMPLATE) : t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_FIELDS)}</div>
        <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={currentCard?.type === "template" ? t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_FIELDS_TEMPLATE) : t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_FIELDS)} />
      </div>
      {/* Page-level info card (conditions.infoCardText) presented as an element with an
          Infocard tag and a show/hide toggle, consistent with body infoCard fields on
          template screens. Toggling off stashes the localisation code in
          conditions.infoCardTextDisabled and nulls infoCardText — the app only renders
          the card when infoCardText is present. */}
      {(currentCard?.conditions?.infoCardText || currentCard?.conditions?.infoCardTextDisabled) && (
        <div
          className="draggableField-cont app-config-field-wrapper"
          style={currentCard?.conditions?.infoCardText ? { cursor: "pointer" } : {}}
          onClick={() => {
            if (!currentCard?.conditions?.infoCardText) return; // hidden card: nothing to edit
            // Pseudo-field: opens the regular Field-properties view; its message edits go
            // through the localisation slice like any other field, config shape untouched
            dispatch(
              selectField({
                field: {
                  fieldName: "pageInfoCard",
                  type: "template",
                  format: "infoCard",
                  label: null,
                  description: currentCard?.conditions?.infoCardText,
                  __pageInfoCard: true,
                },
                screen: currentCard,
                card: null,
                cardIndex: -1,
              })
            );
          }}
        >
          <LabelFieldPair className={`appConfigLabelField`}>
            <div className={`appConfigLabelField-label-container toggle`} style={{ width: "70%" }}>
              <div className={`appConfigLabelField-label toggle`}>
                <span>{t("INFO_CARD_TEXT")}</span>
              </div>
              <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
                <Tag icon="" label={t("Infocard")} className="app-config-field-tag normal" labelStyle={{}} showIcon={false} style={{}} />
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                key={currentCard?.conditions?.infoCardText ? "infocard-on" : "infocard-off"}
                label=""
                isCheckedInitially={!!currentCard?.conditions?.infoCardText}
                disable={viewMode}
                shapeOnOff
                onToggle={() => {
                  const cond = { ...(currentCard?.conditions || {}) };
                  if (cond.infoCardText) {
                    cond.infoCardTextDisabled = cond.infoCardText;
                    cond.infoCardText = null;
                  } else {
                    cond.infoCardText = cond.infoCardTextDisabled || null;
                    cond.infoCardTextDisabled = null;
                  }
                  dispatch(updateHeaderProperty({ fieldKey: "conditions", value: cond }));
                }}
              />
            </div>
          </LabelFieldPair>
        </div>
      )}
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



        // Render one field row; `i` stays the index in the combined body+footer list so the
        // existing card/field index math is unchanged by the section grouping below
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
                  hideToggle={rest?.format === "panelCard" || rest?.format === "labelPairList" || (rest?.format === "button" && isOnlyButton)}
                  toggleResetKey={toggleResetKey}
                  fields={c}
                  isTemplate={currentCard?.type === "template"}
                // isFooterField={isFooterField}
                />
              );
            };

        return (
          <Fragment key={`card-${index}`}>
            {fields?.map((fieldEntry, i, c) => (fieldEntry?.format === "button" ? null : renderFieldRow(fieldEntry, i, c)))}
            {/* Body/template buttons get their own section, consistent with pages whose buttons live in the footer */}
            {buttonFields.length > 0 && (
              <>
                <Divider className="app-config-drawer-action-divider" />
                <div className="app-config-drawer-subheader">
                  <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_BUTTONS)}</div>
                  <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_BUTTONS)} />
                </div>
              </>
            )}
            {fields?.map((fieldEntry, i, c) => (fieldEntry?.format === "button" ? renderFieldRow(fieldEntry, i, c) : null))}
            {currentCard?.type !== "template" && !viewMode && (<Button
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
      {currentCard?.footer?.length > 0 && !hasBodyButtonRows && (<Divider className="app-config-drawer-action-divider" />)}
      {currentCard?.footer?.length > 0 && !hasBodyButtonRows && (
        <div className="app-config-drawer-subheader">
          <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_BUTTONS)}</div>
          <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_BUTTONS)} />
        </div>)}
      {/* When footer buttons already render as element rows in the Buttons section, the
          per-footer label inputs would duplicate that editing affordance — rows win */}
      {currentCard?.footer &&
        currentCard?.footer.length > 0 &&
        !hasBodyButtonRows &&
        currentCard?.footer?.map((footerButtonConfig, index) => (
          <FooterLabelField key={`footer-${index}`} footerButtonConfig={footerButtonConfig} index={index} currentLocale={currentLocale} dispatch={dispatch} t={t} viewMode={viewMode} />
      ))}
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
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
