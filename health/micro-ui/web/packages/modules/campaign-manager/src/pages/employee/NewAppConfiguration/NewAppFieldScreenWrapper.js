import React, { Fragment, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, LabelFieldPair, TextInput } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { deleteField, hideField, reorderFields, addSection, selectField, handleShowAddFieldPopup } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import NewDraggableField from "./NewDraggableField";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import HeaderFieldWrapper from "./HeaderFieldWrapper";
import NewNavigationLogicWrapper from "./NewNavigationLogicWrapper";

// Wrapper for footer label to avoid hook-in-loop violation
const FooterLabelField = React.memo(({ label, index, currentLocale, dispatch, t }) => {
  const localizedLabel = useCustomT(label);
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
        if (label) {
          dispatch(
            updateLocalizationEntry({
              code: label,
              locale: currentLocale || "en_IN",
              message: value,
            })
          );
        }
      }, 800);
    },
    [label, currentLocale, dispatch]
  );

  const handleBlur = useCallback(() => {
    // Force immediate dispatch on blur
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      if (label) {
        dispatch(
          updateLocalizationEntry({
            code: label,
            locale: currentLocale || "en_IN",
            message: localValue,
          })
        );
      }
    }
  }, [label, currentLocale, localValue, dispatch]);

  return (
    <LabelFieldPair key={`footer-${index}`} className="app-preview-app-config-drawer-action-button">
      <div className="">
        <span>{`${t("APP_CONFIG_ACTION_BUTTON_LABEL")}`}</span>
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

  const extractTemplateFields = (node) => {
    if (!node) return [];

    // If it's an array, flatten out recursively
    if (Array.isArray(node)) {
      return node.flatMap(extractTemplateFields);
    }

    // If it’s a template (like your fields), include it and also look inside for nested templates
    if (typeof node === "object" && node.type === "template") {
      return [
        node,
        ...extractTemplateFields(node.child),
        ...extractTemplateFields(node.children),
      ];
    }

    // If it has nested objects, scan through them for templates
    if (typeof node === "object") {
      return Object.values(node).flatMap(extractTemplateFields);
    }

    return [];
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
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_HEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_HEAD_FIELDS")} />
      </div>
      <Divider />
      {/* Heading Field */}
      <HeaderFieldWrapper
        key="header-heading"
        label="heading"
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
        label="description"
        type="text"
        value={currentCard?.description}
        currentCard={currentCard}
        index={1}
        cardIndex={0}
        fieldKey="description"
      />
      <Divider />
      <div className="app-config-drawer-subheader">
        <div> {t("APPCONFIG_SUBHEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
      </div>
      {currentCard?.body?.map((section, index, card) => {

        const fields =
          currentCard?.type === "template"
            ? extractTemplateFields(section?.fields)
            : section?.fields || [];


        return (
          <Fragment key={`card-${index}`}>
            {fields?.map(({ type, label, active, required, Mandatory, deleteFlag,fieldName, ...rest }, i, c) => {
              return (
                <NewDraggableField
                  type={type}
                  label={label}
                  active={active}
                  required={required}
                  isDelete={deleteFlag === true ? true : false}
                  onDelete={() => handleDeleteField(i, index)}
                  onHide={() => handleHideField(fieldName, index)}
                  onSelectField={() => handleSelectField(c[i], currentCard, card[index], index, i)}
                  config={c[i]}
                  Mandatory={Mandatory}
                  rest={rest}
                  index={i}
                  fieldIndex={i}
                  cardIndex={index}
                  indexOfCard={index}
                  moveField={type !== "template" ? moveField : null}
                  key={`field-${i}`}
                  fields={c}
                />
              );
            })}
            {currentCard?.type !== "template" && (<Button
              className={"app-config-drawer-button"}
              type={"button"}
              size={"medium"}
              icon={"AddIcon"}
              variation={"teritiary"}
              label={t("ADD_FIELD")}
              onClick={() => handleAddField(currentCard, card[index])}
            />)}
          </Fragment>
        );
      })}

      {currentCard?.type !== "template" && (
        <>
          <Divider className="app-config-drawer-action-divider" />
          <div className="app-config-drawer-subheader">
            <div>{t("NAVIGATION_LOGIC")}</div>
            <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_NAVIGATION_LOGIC")} />
          </div>
          <NewNavigationLogicWrapper t={t} />
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
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_SUBHEAD_BUTTONS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_BUTTONS")} />
      </div>
      {currentCard?.footer &&
        currentCard?.footer.length > 0 &&
        currentCard?.footer?.map(({ label }, index) => (
          <FooterLabelField key={`footer-${index}`} label={label} index={index} currentLocale={currentLocale} dispatch={dispatch} t={t} />
        ))}
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
