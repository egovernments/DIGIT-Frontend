import React, { Fragment, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, LabelFieldPair, TextInput, Switch } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { deleteField, hideField, reorderFields, addSection, selectField, handleShowAddFieldPopup, updateHeaderProperty } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import NewDraggableField from "./NewDraggableField";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import HeaderFieldWrapper from "./HeaderFieldWrapper";
import NewNavigationLogicWrapper from "./NewNavigationLogicWrapper";

// Wrapper for footer label to avoid hook-in-loop violation
const FooterLabelField = React.memo(({ footerButtonConfig, index, currentLocale, dispatch, t }) => {
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
    primary: t("Primary"),
    secondary: t("Secondary"),
    teritiary: t("Teritiary"),
    link: t("Link"),
  }

  return (
    <LabelFieldPair key={`footer-${index}`} className="app-preview-app-config-drawer-action-button">
      <div className="">
        <span>{`${labelMap[footerButtonConfig?.properties?.type] || ""} ${t("APP_CONFIG_ACTION_BUTTON_LABEL")}`}</span>
      </div>
      <TextInput
        name={`footerLabel-${index}`}
        value={localValue}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
      />
    </LabelFieldPair>
  );
});

function NewAppFieldScreenWrapper() {
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

  const handleHideField = useCallback(
    (fieldName, cardIndex) => {
      dispatch(hideField({ fieldName, cardIndex }));
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
    if (typeof node === "object" && node.type === "template") {
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
        <p>{t("APP_CONFIG_NO_CONFIGURATION_DATA_AVAILABLE")}</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_HEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_HEAD_FIELDS")} />
      </div>
      <Divider /> */}
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
      />
      <Divider />
      <div className="app-config-drawer-subheader">
        <div> {currentCard?.type === "template" ? t("APPCONFIG_SUBHEAD_FIELDS_TEMPLATE") : t("APPCONFIG_SUBHEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={currentCard?.type === "template" ? t("TIP_APPCONFIG_SUBHEAD_FIELDS_TEMPLATE") : t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
      </div>
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



        return (
          <Fragment key={`card-${index}`}>
            {fields?.map(({ type, label, active, required, Mandatory, deleteFlag, fieldName, id, ...rest }, i, c) => {
              const isFooterField = i >= bodyFieldsCount;
              const actualCardIndex = isFooterField ? -1 : index; // Use -1 for footer fields
              const actualFieldIndex = isFooterField ? i - bodyFieldsCount : i;
              // Use id if available (for newly added fields), otherwise fall back to fieldName
              const fieldKey = id || fieldName || `field-${actualCardIndex}-${actualFieldIndex}`;
              return (
                <NewDraggableField
                  key={`draggable-field-${fieldKey}`}
                  type={type}
                  label={label}
                  active={active}
                  required={required}
                  isDelete={deleteFlag === true ? true : false}
                  onDelete={() => handleDeleteField(actualFieldIndex, actualCardIndex)}
                  onHide={() => handleHideField(fieldName, actualCardIndex)}
                  onSelectField={rest?.hidden ? null : () => handleSelectField(c[i], currentCard, card[index], actualCardIndex, actualFieldIndex)}
                  config={c[i]}
                  Mandatory={Mandatory}
                  rest={{...rest, fieldName}}
                  index={i}
                  fieldIndex={actualFieldIndex}
                  cardIndex={actualCardIndex}
                  indexOfCard={index}
                  moveField={type !== "template" ? moveField : null}
                  fields={c}
                  isTemplate={currentCard?.type === "template"}
                // isFooterField={isFooterField}
                />
              );
            })}
            {currentCard?.type !== "template" && (<Button
              className={"app-config-drawer-button add-field"}
              type={"button"}
              size={"medium"}
              icon={"AddIcon"}
              variation="secondary"
              label={t("ADD_FIELD")}
              title={t("ADD_FIELD")}
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
            <div>{t("NAVIGATION_LOGIC")}</div>
            <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_NAVIGATION_LOGIC")} />
          </div>
          <NewNavigationLogicWrapper t={t} targetPages={currentCard?.conditionalNavigationProperties?.targetPages} />
        </>
      )}
      {currentCard?.type !== "template" && currentCard?.config?.enableSectionAddition && (
        <Button
          className={"app-config-add-section"}
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t("ADD_SECTION")}
          onClick={handleAddSection}
        />
      )}
      <Divider className="app-config-drawer-action-divider" />
      {currentCard?.footer?.length > 0 && (
        <div className="app-config-drawer-subheader">
          <div>{t("APPCONFIG_SUBHEAD_BUTTONS")}</div>
          <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_BUTTONS")} />
        </div>)}
      {currentCard?.footer &&
        currentCard?.footer.length > 0 &&
        currentCard?.footer?.map((footerButtonConfig, index) => (
          <FooterLabelField key={`footer-${index}`} footerButtonConfig={footerButtonConfig} index={index} currentLocale={currentLocale} dispatch={dispatch} t={t} />
        ))}
      <Divider />
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_PRIVACY_CONTROLS")}</div>
      </div>
      <div className="app-config-privacy-controls-container">
        <div className="app-config-privacy-controls-container-text">{t("PREVENT_SCREEN_CAPTURE")}</div>
        <Switch
          className={"app-config-drawer-subheader"}
          isLabelFirst={true}
          isCheckedInitially={currentCard?.preventScreenCapture || false}
          onToggle={handleTogglePreventScreenCapture}
        />
      </div>
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
