import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, LabelFieldPair, TextInput, PopUp, Dropdown } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteField,
  hideField,
  reorderFields,
  addSection,
  updateHeaderField,
  updateActionLabel,
  selectField,
  handleShowAddFieldPopup,
} from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";

// Wrapper component to handle useCustomT calls outside of loops
const LocalizedHeaderField = React.memo(({ type, label, active, value, formId, currentCard, onChange }) => {
  const localizedValue = useCustomT(value ? value : `${projectType}_${currentCard.parent}_${currentCard.name}_${label}`);

  return <NewAppFieldComposer type={type} label={label} active={active} value={localizedValue} headerFields={true} onChange={onChange} />;
});

// Wrapper component for draggable fields with localization
const LocalizedDraggableField = React.memo(
  ({
    type,
    label,
    active,
    required,
    Mandatory,
    helpText,
    infoText,
    innerLabel,
    dropDownOptions,
    deleteFlag,
    rest,
    i,
    c,
    index,
    handleDeleteField,
    handleHideField,
    handleSelectField,
    currentCard,
    card,
    moveField,
  }) => {
    const localizedLabel = useCustomT(label);
    const localizedHelpText = useCustomT(helpText);
    const localizedInfoText = useCustomT(infoText);
    const localizedInnerLabel = useCustomT(innerLabel);

    return (
      <NewDraggableField
        type={type}
        label={localizedLabel}
        active={active}
        required={required}
        isDelete={deleteFlag === false ? false : true}
        dropDownOptions={dropDownOptions}
        onDelete={() => handleDeleteField(i, index)}
        onHide={() => handleHideField(i, index)}
        onSelectField={() => handleSelectField(c[i], currentCard, card[index])}
        config={c[i]}
        Mandatory={Mandatory}
        helpText={localizedHelpText}
        infoText={localizedInfoText}
        innerLabel={localizedInnerLabel}
        rest={rest}
        index={i}
        fieldIndex={i}
        cardIndex={card[index]}
        indexOfCard={index}
        moveField={moveField}
        fields={c}
      />
    );
  }
);

// Wrapper for action label
const LocalizedActionLabel = React.memo(({ currentCard, onChange }) => {
  const localizedValue = useCustomT(currentCard?.actionLabel);

  return <TextInput name="actionLabel" value={localizedValue} onChange={onChange} />;
});
import NewAppFieldComposer from "./NewAppFieldComposer";
import NewDraggableField from "./NewDraggableField";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { updateLocalizationEntry } from "./redux/localizationSlice";

function NewAppFieldScreenWrapper() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData } = useSelector((state) => state.remoteConfig);
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  // Popup state for adding new fields - managed by Redux
  // Removed unused state variables

  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const formId = searchParams.get("formId");

  const currentCard = useMemo(() => {
    return currentData;
  }, [currentData]);

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
    (field, screen, card) => {
      dispatch(selectField({ field, screen, card }));
    },
    [dispatch]
  );

  const handleAddField = useCallback((currentCard, card) => {
    dispatch(handleShowAddFieldPopup({ currentCard, card }));
  }, []);

  const handleAddSection = useCallback(() => {
    dispatch(addSection());
  }, [dispatch]);

  const handleUpdateHeaderField = useCallback(
    (value, fieldIndex, cardIndex) => {
      dispatch(updateHeaderField({ cardIndex, fieldIndex, value }));
    },
    [dispatch]
  );

  const handleUpdateActionLabel = useCallback(
    (value) => {
      dispatch(updateActionLabel({ value }));
    },
    [dispatch]
  );

  if (!currentCard) {
    return (
      <div style={{ padding: "16px" }}>
        <p>No configuration data available.</p>
      </div>
    );
  }

  console.log("currentCardcurrentCardcurrentCard", currentCard);
  return (
    <React.Fragment>
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_HEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_HEAD_FIELDS")} />
      </div>
      <Divider />
      {currentCard?.headerFields?.map(({ label, type, value }, index, field) => {
        return (
          <Fragment key={`card-${index}`}>
            <LocalizedHeaderField
              key={`header-field-${index}`}
              type={type}
              label={label}
              active={true}
              // required={required}
              value={value}
              formId={formId}
              projectType={projectType}
              currentCard={currentCard}
              onChange={(event) => {
                if (value) {
                  dispatch(
                    updateLocalizationEntry({
                      code: value,
                      locale: currentLocale || "en_IN",
                      message: event.target.value,
                    })
                  );
                } else {
                  dispatch(
                    updateLocalizationEntry({
                      code: "SKJSKSJSKJSKJsksk",
                      locale: currentLocale || "en_IN",
                      message: event.target.value,
                    })
                  );
                }
                handleUpdateHeaderField(label, index);
              }}
            />
          </Fragment>
        );
      })}
      <Divider />
      <div className="app-config-drawer-subheader">
        <div> {t("APPCONFIG_SUBHEAD_FIELDS")}</div>
        <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
      </div>
      {currentCard?.cards?.map(({ fields, headerFields }, index, card) => {
        return (
          <Fragment key={`card-${index}`}>
            <div className="app-config-drawer-subheader">
              <div> {t("APPCONFIG_SUBHEAD_FIELDS")}</div>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
            </div>
            {fields?.map(
              (
                { type, label, active, required, Mandatory, helpText, infoText, innerLabel, dropDownOptions, deleteFlag, ...rest },
                i,
                c
              ) => {
                return (
                  <LocalizedDraggableField
                    key={`field-${i}`}
                    type={type}
                    label={label}
                    active={active}
                    required={required}
                    Mandatory={Mandatory}
                    helpText={helpText}
                    infoText={infoText}
                    innerLabel={innerLabel}
                    dropDownOptions={dropDownOptions}
                    deleteFlag={deleteFlag}
                    rest={rest}
                    i={i}
                    c={c}
                    index={index}
                    handleDeleteField={handleDeleteField}
                    handleHideField={handleHideField}
                    handleSelectField={handleSelectField}
                    currentCard={currentCard}
                    card={card}
                    moveField={moveField}
                  />
                );
              }
            )}
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
      {currentCard?.type !== "template" && (
        <>
          <div className="app-config-drawer-subheader">
            <div>{t("APPCONFIG_SUBHEAD_BUTTONS")}</div>
            <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_BUTTONS")} />
          </div>
          <LabelFieldPair className="app-preview-app-config-drawer-action-button">
            <div className="">
              <span>{`${t("APP_CONFIG_ACTION_BUTTON_LABEL")}`}</span>
            </div>
            <LocalizedActionLabel
              currentCard={currentCard}
              onChange={(event) => {
                if (currentCard?.actionLabel) {
                  dispatch(
                    updateLocalizationEntry({
                      code: currentCard?.actionLabel,
                      locale: currentLocale || "en_IN",
                      message: event.target.value,
                    })
                  );
                } else {
                  dispatch(
                    updateLocalizationEntry({
                      code: "SKJSKSJSKJSKJ",
                      locale: currentLocale || "en_IN",
                      message: event.target.value,
                    })
                  );
                }
                handleUpdateActionLabel(currentCard?.actionLabel);
              }}
            />
          </LabelFieldPair>
        </>
      )}
    </React.Fragment>
  );
}

export default React.memo(NewAppFieldScreenWrapper);
