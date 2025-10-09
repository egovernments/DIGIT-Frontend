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
    (fieldIndex, cardIndex) => {
      dispatch(hideField({ fieldIndex, cardIndex }));
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

  if (!currentCard) {
    return (
      <div style={{ padding: "16px" }}>
        <p>No configuration data available.</p>
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
      {currentCard?.headerFields?.map(({ label, type, value }, index) => {
        return (
          <HeaderFieldWrapper
            key={`header-${index}`}
            label={label}
            type={type}
            value={value}
            currentCard={currentCard}
            index={index}
            cardIndex={0}
          />
        );
      })}
      <Divider />
      <div className="app-config-drawer-subheader">
        <div> {t("APPCONFIG_SUBHEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
      </div>
      {currentCard?.cards?.map(({ fields }, index, card) => {
        return (
          <Fragment key={`card-${index}`}>
            {fields?.map(({ type, label, active, required, Mandatory, deleteFlag, ...rest }, i, c) => {
              return (
                <NewDraggableField
                  type={type}
                  label={label}
                  active={active}
                  required={required}
                  isDelete={deleteFlag === false ? false : true}
                  onDelete={() => handleDeleteField(i, index)}
                  onHide={() => handleHideField(i, index)}
                  onSelectField={() => handleSelectField(c[i], currentCard, card[index], index, i)}
                  config={c[i]}
                  Mandatory={Mandatory}
                  rest={rest}
                  index={i}
                  fieldIndex={i}
                  cardIndex={index}
                  indexOfCard={index}
                  moveField={moveField}
                  key={`field-${i}`}
                  fields={c}
                />
              );
            })}
            <Button
              className={"app-config-drawer-button"}
              type={"button"}
              size={"medium"}
              icon={"AddIcon"}
              variation={"teritiary"}
              label={t("ADD_FIELD")}
              onClick={() => handleAddField(currentCard, card[index])}
            />
          </Fragment>
        );
      })}
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
