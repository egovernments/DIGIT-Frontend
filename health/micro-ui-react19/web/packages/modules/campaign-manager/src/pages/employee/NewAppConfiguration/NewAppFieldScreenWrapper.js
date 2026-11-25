import React, { Fragment, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertCard, Button, Divider, LabelFieldPair, TextInput, Switch, Tag } from "@egovernments/digit-ui-components";
import { VisibilityNew, VisibilityOffNew } from "@egovernments/digit-ui-svg-components";
import { useSelector, useDispatch } from "react-redux";
import { deleteField, hideField, reorderFields, addSection, selectField, handleShowAddFieldPopup, updateHeaderProperty, setPreviewState } from "./redux/remoteConfigSlice";
import { getStateGroups, buildFieldStateIndex } from "./helpers/previewStateHelpers";
import { useCustomT, useCustomTranslate } from "./hooks/useCustomT";
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
  const [isEditing, setIsEditing] = useState(false);
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

  const typeLabel = `${labelMap[footerButtonConfig?.properties?.type] || ""} ${t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ACTION_BUTTON_LABEL)}`;

  return (
    // Same card anatomy as the PanelFieldDisplay rows in template pages' Buttons
    // sections: button label as the card title with a Button tag beneath it. The
    // label input only appears once the card is clicked, mirroring how field rows
    // open their editor on click instead of exposing inputs inline.
    <div className="draggableField-cont" key={`footer-${index}`} style={{ display: "flex", alignItems: "center" }}>
      <div
        className="app-config-field-wrapper"
        onClick={() => {
          if (!viewMode) setIsEditing(true);
        }}
      >
        <LabelFieldPair className="appConfigLabelField">
          <div className="appConfigLabelField-label-container" style={{ width: "100%" }}>
            <div className="appConfigLabelField-label">
              <span>{localValue || typeLabel}</span>
            </div>
            <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
              <Tag icon="" label={t("Button")} className="app-config-field-tag normal" showIcon={false} />
            </div>
          </div>
        </LabelFieldPair>
        {isEditing && !viewMode && (
          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "0.5rem" }}>
            <LabelFieldPair className="app-preview-app-config-drawer-action-button" removeMargin={true}>
              <div className="">
                <span>{typeLabel}</span>
              </div>
              <TextInput
                label={typeLabel}
                name={`footerLabel-${index}`}
                value={localValue}
                onChange={(event) => handleChange(event.target.value)}
                onBlur={() => {
                  handleBlur();
                  setIsEditing(false);
                }}
                autoFocus={true}
              />
            </LabelFieldPair>
          </div>
        )}
      </div>
    </div>
  );
});

function NewAppFieldScreenWrapper({viewMode}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // State group and state names are written in the config, so they are translated the same way
  // every other config-authored label is: out of the campaign's own localisation, not i18next.
  // i18next only carries the console's own modules, so a code seeded against the campaign would
  // never resolve there. Falls back to i18next so a console-owned code still works.
  const campaignT = useCustomTranslate();
  const stateLabel = (code) => (code ? campaignT(code) || t(code) : "");
  const { currentData, selectedPreviewStates, selectedStateGroup, selectedField } = useSelector((state) => state.remoteConfig);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  // A click in the preview already selects the field, but its row can be far down a long list.
  // A field inside a state group is marked on that group's card, so the card is what moves.
  // Keyed on names, so editing a field in the drawer does not scroll the panel as you type.
  const selectedFieldName = selectedField?.fieldName;
  useEffect(() => {
    // A button keeps its own row in the Buttons section even when it belongs to a state, so
    // its row is preferred; a tag has none and falls through to its group's card.
    const row =
      (selectedFieldName && document.querySelector(`[data-field-name="${selectedFieldName}"]`)) ||
      (selectedStateGroup && document.querySelector(`[data-state-group="${selectedStateGroup}"]`));
    // "nearest" leaves a row that is already on screen alone, so clicking in the panel never jumps
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedFieldName, selectedStateGroup]);

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
      // A group is one element to the author: list the node, but not the parts inside it.
      // Without this a count and its label become two rows with two switches, so the number
      // can be hidden while its label stays on screen.
      // Opt-in: a config without the flag is flattened exactly as before.
      if (node.groupAsSingleElement === true) {
        return [node];
      }

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
    // A group stands in for the fields it wraps, so it belongs in the panel whatever its own
    // format is. card, row and column are all editable:false in the field-type master - without
    // this the group row is dropped here, and its parts are already gone, so the element
    // disappears from the panel entirely.
    if (field?.groupAsSingleElement === true) return true;

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

  // True when the page already lists its buttons as rows, in the Buttons section. The plain label
  // inputs below are the fallback for a page whose buttons cannot be listed that way, and the two
  // must never show at once.
  const hasBodyButtonRows = (currentCard?.body || []).some((section) => {
    const sectionBodyFields = currentCard?.type === "template" ? extractTemplateFields(section?.fields) : (section?.fields || []);
    const sectionFooterFields = currentCard?.footer ? extractTemplateFields(currentCard.footer) : [];
    // Footer rows always join the Buttons section, whatever their format (qrScanner, actionPopup, …)
    return (
      sectionBodyFields.filter(isFieldEditable).some((f) => ["button", "actionPopup", "qrScanner"].includes(f?.format)) ||
      sectionFooterFields.filter(isFieldEditable).length > 0
    );
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
            maxLength={64}
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
            // A description is a sentence, so it gets more room than the heading above. The
            // shipped ones already run past 64, and editing one used to cut it short.
            maxLength={256}
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
                ariaLabel={t("INFO_CARD_TEXT")}
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

        // Action buttons are listed as field rows on both kinds of screen
        const footerFields = currentCard?.footer ? extractTemplateFields(currentCard.footer) : [];

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
        // several, the last visible one cannot be switched off either. On a form screen the action
        // buttons are not part of the field list, so none of them can be hidden.
        // Footer entries all render in the app's bottom action bar, so every footer row is an
        // action button regardless of format (qrScanner "Scan QR", actionPopup "Download IDs", …)
        // Popup-opening actions (actionPopup, qrScanner) render as buttons in the app,
        // so they belong in the Buttons section alongside plain buttons and footer rows
        const isButtonRow = (f, i) => f?.format === "button" || f?.format === "actionPopup" || f?.format === "qrScanner" || i >= bodyFieldsCount;
        const buttonFields = fields.filter((f, i) => isButtonRow(f, i));
        const visibleButtonCount = buttonFields.filter((f) => f?.hidden !== true).length;
        const isOnlyButton = buttonFields.length === 1;

        // Popups are listed apart from the buttons. A scanner stays with the buttons: it is one of
        // them on screen, even though it opens something. The counts above still take in both, so
        // the rule that a screen keeps one visible action is unchanged.
        const isPopupRow = (f) => f?.format === "actionPopup";
        const popupFields = buttonFields.filter(isPopupRow);
        const actionButtonFields = buttonFields.filter((f) => !isPopupRow(f));

        // Footer rows on a form screen, which are its action buttons
        const isFormActionButton = (i) => currentCard?.type !== "template" && i >= bodyFieldsCount;

        // A menu screen (e.g. Manage Stock) with every menu card hidden would be a dead end
        // in the app, so the last visible menu card cannot be switched off either
        const menuCardFields = fields.filter((f) => f?.format === "menu_card");
        const visibleMenuCardCount = menuCardFields.filter((f) => f?.hidden !== true).length;

        // A state group replaces the rows it owns with a single element card listing its states.
        // Which rows it owns has to come from the config tree, because `fields` above is flat and
        // a row nested inside a container can no longer tell which state it inherited.
        // A page declaring no states gets an empty index, so every row falls through unchanged.
        const stateGroups = getStateGroups(currentCard);
        const fieldStateIndex = new Map();
        if (stateGroups.length > 0) {
          buildFieldStateIndex(section?.fields, fieldStateIndex);
          buildFieldStateIndex(currentCard?.footer, fieldStateIndex);
        }

        const statesOfRow = (f) => fieldStateIndex.get(f?.fieldName) || [];
        const isStateRow = (f) => statesOfRow(f).length > 0;
        const isInSelectedState = (f, group) => statesOfRow(f).includes(selectedPreviewStates?.[group?.name]);
        const groupOfRow = (f) =>
          stateGroups.find((group) => (group?.states || []).some((st) => statesOfRow(f).includes(st?.name)));

        // Clicking a state opens the properties of the field it is made of. The states box is the
        // only way in now, since those fields are no longer listed as rows of their own.
        const fieldIndexForState = (stateName) =>
          fields.findIndex((f, i) => !isButtonRow(f, i) && statesOfRow(f).includes(stateName));

        // The group is drawn where its first row sat, so it keeps that place in the list.
        // Worked out up front to keep the render pass below a plain map.
        const firstRowOfGroup = new Map();
        fields.forEach((f, i) => {
          if (isButtonRow(f, i)) return;
          const group = groupOfRow(f);
          if (group && !firstRowOfGroup.has(group.name)) firstRowOfGroup.set(group.name, i);
        });

        // Buttons and popups stay in their own sections at the bottom rather than moving under a
        // state, so one that belongs to a state is hidden there instead when it is not showing.
        const isRowVisibleForStates = (f) => !isStateRow(f) || stateGroups.some((group) => isInSelectedState(f, group));

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
                          const isTurningOffLastMenuCard =
                            rest?.format === "menu_card" && rest?.hidden !== true && visibleMenuCardCount <= 1;
                          if (isTurningOffLastButton || isTurningOffLastMenuCard) {
                            if (typeof window.__appConfig_showToast === "function") {
                              window.__appConfig_showToast({
                                key: "error",
                                label: t(
                                  isTurningOffLastMenuCard
                                    ? I18N_KEYS.APP_CONFIGURATION.AT_LEAST_ONE_MENU_CARD_REQUIRED
                                    : I18N_KEYS.APP_CONFIGURATION.AT_LEAST_ONE_BUTTON_REQUIRED
                                ),
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
                  // Buttons sit in their own section and have no meaningful order,
                  // so they are not reorderable - which also drops their drag handle.
                  moveField={viewMode || isButtonRow(fieldEntry, i) ? null : type !== "template" ? moveField : null}
                  hideToggle={rest?.format === "panelCard" || rest?.format === "labelPairList" || (rest?.format === "button" && (isOnlyButton || isFormActionButton(i)))}
                  toggleResetKey={toggleResetKey}
                  fields={c}
                  isTemplate={currentCard?.type === "template"}
                // isFooterField={isFooterField}
                />
              );
            };

        // The state group is one element of this screen like any other: its name, its type, and
        // the situations it can be in nested inside it - the same shape every other element row has.
        const renderStateGroup = (group) => (
          <div
            className="draggableField-cont"
            key={`state-group-${group?.name}`}
            // The rows this group holds are not listed on their own, so a click on one of its
            // states in the preview brings this card into view instead
            data-state-group={group?.name}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className={`app-config-field-wrapper app-config-state-group-field${
                selectedStateGroup === group?.name ? " selected-state-group" : ""
              }`}
            >
              <LabelFieldPair className="appConfigLabelField">
                <div className="appConfigLabelField-label-container" style={{ width: "100%" }}>
                  <div className="appConfigLabelField-label">
                    <span>{stateLabel(group?.label)}</span>
                  </div>
                  {group?.typeLabel && (
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
                      <Tag
                        icon=""
                        label={stateLabel(group.typeLabel)}
                        className="app-config-field-tag normal"
                        labelStyle={{}}
                        showIcon={false}
                        style={{}}
                      />
                    </div>
                  )}
                </div>

                {/* Nested inside the element card, the way the states belong to this element
                    rather than sitting beside it */}
                <div className="app-config-state-group" role="group" aria-label={stateLabel(group?.label)}>
                  {group?.title && <div className="app-config-state-group-title">{stateLabel(group.title)}</div>}
                  {group?.description && (
                    // AlertCard always draws an icon and a heading, and with no label of its own
                    // that heading reads "Info" - a word that adds nothing here. The sentence is
                    // the whole point, so the header is hidden and only the text is left.
                    <AlertCard
                      className="app-config-state-group-alertcard"
                      variant="info"
                      label={stateLabel(group.description)}
                    />
                  )}
                  {(group?.states || []).map((appState) => {
                    const isPreviewing = selectedPreviewStates?.[group?.name] === appState?.name;
                    // Picking a state does both things at once: shows it in the preview, and opens
                    // the properties of the field it is made of. The preview is set first so the
                    // eye still turns on for a state whose field has nothing to edit.
                    const openState = () => {
                      dispatch(setPreviewState({ groupName: group?.name, stateName: appState?.name }));
                      const at = fieldIndexForState(appState?.name);
                      if (at < 0) return;
                      handleSelectField(fields[at], currentCard, card[index], index, at);
                    };
                    return (
                      // The row opens the properties of the field this state is made of; only the
                      // eye beside it changes what the preview is showing.
                      <div
                        key={`state-${group?.name}-${appState?.name}`}
                        className={`app-config-state-option${isPreviewing ? " previewing" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={openState}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openState();
                          }
                        }}
                      >
                        <span className="app-config-state-option-label">{stateLabel(appState?.label)}</span>
                        <button
                          type="button"
                          className="app-config-state-option-eye"
                          aria-pressed={isPreviewing}
                          title={t(
                            isPreviewing
                              ? I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_STOP_PREVIEWING
                              : I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_PREVIEW_STATE
                          )}
                          // The eye on its own only changes the preview, and clicking the state
                          // already showing returns the group to its placeholder
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setPreviewState({ groupName: group?.name, stateName: isPreviewing ? null : appState?.name }));
                          }}
                        >
                          {isPreviewing ? <VisibilityNew fill="#C84C0E" /> : <VisibilityOffNew fill="#505A5F" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </LabelFieldPair>
            </div>
          </div>
        );

        return (
          <Fragment key={`card-${index}`}>
            {/* Each pass walks the whole list and renders only the rows belonging to its section.
                The index has to stay the one the field holds in the list, since that is what an
                edit is written back by, so the rows are picked out here rather than beforehand. */}
            {fields?.map((fieldEntry, i, c) => {
              if (isButtonRow(fieldEntry, i)) return null;
              // A state group is one element of this screen like any other, so it is drawn in the
              // list, in the place its own fields held - not in a section of its own.
              const group = groupOfRow(fieldEntry);
              if (group) return firstRowOfGroup.get(group.name) === i ? renderStateGroup(group) : null;
              return renderFieldRow(fieldEntry, i, c);
            })}

            {/* Adding a field adds one to the list above, so it stays with that list rather than
                sitting under the popup and button sections that follow */}
            {currentCard?.type !== "template" && !viewMode && (
              <Button
                className={"app-config-drawer-button add-field"}
                type={"button"}
                size={"medium"}
                icon={"AddIcon"}
                variation="secondary"
                label={t(I18N_KEYS.APP_CONFIGURATION.ADD_FIELD)}
                title={t(I18N_KEYS.APP_CONFIGURATION.ADD_FIELD)}
                onClick={() => handleAddField(currentCard, card[index])}
                id={"app-config-screen-add-field-button"}
              />
            )}

            {/* A popup is set up on the screen but opened by a button, so it is listed on its own */}
            {popupFields.length > 0 && (
              <>
                <Divider className="app-config-drawer-action-divider" />
                <div className="app-config-drawer-subheader">
                  <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_POPUPS)}</div>
                  <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_POPUPS)} />
                </div>
              </>
            )}
            {fields?.map((fieldEntry, i, c) =>
              isButtonRow(fieldEntry, i) && isPopupRow(fieldEntry) && isRowVisibleForStates(fieldEntry)
                ? renderFieldRow(fieldEntry, i, c)
                : null
            )}

            {/* Body/template buttons get their own section, consistent with pages whose buttons live in the footer */}
            {actionButtonFields.length > 0 && (
              <>
                <Divider className="app-config-drawer-action-divider" />
                <div className="app-config-drawer-subheader">
                  <div>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_SUBHEAD_BUTTONS)}</div>
                  <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_SUBHEAD_BUTTONS)} />
                </div>
              </>
            )}
            {fields?.map((fieldEntry, i, c) =>
              isButtonRow(fieldEntry, i) && !isPopupRow(fieldEntry) && isRowVisibleForStates(fieldEntry)
                ? renderFieldRow(fieldEntry, i, c)
                : null
            )}
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
          ariaLabel={t(I18N_KEYS.APP_CONFIGURATION.PREVENT_SCREEN_CAPTURE)}
          isCheckedInitially={currentCard?.preventScreenCapture || false}
          onToggle={handleTogglePreventScreenCapture}
          disable={viewMode}
        />
      </div>
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
