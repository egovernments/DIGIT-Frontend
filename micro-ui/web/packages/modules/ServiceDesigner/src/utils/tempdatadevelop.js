import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Stepper,
  Tab,
  ActionBar,
  LabelFieldPair,
  TextInput,
  Tooltip,
  TooltipWrapper,
} from "@egovernments/digit-ui-components";
import AppFieldComposer from "./AppFieldComposer";
import _ from "lodash";
import { useCustomT } from "./useCustomT";
import DraggableField from "./DraggableField";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";
import ConsoleTooltip from "../../../components/ConsoleToolTip";

function AppFieldScreenWrapper() {
  const { state, dispatch, openAddFieldPopup } = useAppConfigContext();
  const { locState, updateLocalization } = useAppLocalisationContext();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const formId = searchParams.get("formId");
  const { t } = useTranslation();

  const currentCard = useMemo(() => {
    return state?.screenData?.[0];
  }, [
    state?.screenData,
    // , numberTabs, stepper, currentStep
  ]);

  const moveField = useCallback(
    (field, targetedField, fromIndex, toIndex, currentCard, cardIndex) => {
      dispatch({
        type: "REORDER_FIELDS",
        payload: { field, targetedField, fromIndex, toIndex, currentCard, cardIndex },
      });
    },
    [dispatch, currentCard]
  );

  return (
    <React.Fragment>
      {currentCard?.cards?.map((cardObj, index) => {
        const { fields, headerFields } = cardObj;
        // Find heading and description fields
        const headingField = headerFields?.find((f) => f.label === "SCREEN_HEADING");
        const descriptionField = headerFields?.find((f) => f.label === "SCREEN_DESCRIPTION");
        return (
          <div key={index} className="app-config-section-block" style={{ border: "1px solid #eee", borderRadius: 8, marginBottom: 24, padding: 16 }}>
            <div className="app-config-section-header" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{t("SECTION_HEADING")}</span>
                <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_SECTION_HEADING")}/>
              </div>
              <TextInput
                name="sectionHeading"
                value={useCustomT(headingField?.value || "")}
                placeholder={t("ENTER_SECTION_HEADING")}
                onChange={(event) => {
                  dispatch({
                    type: "UPDATE_HEADER_FIELD",
                    payload: {
                      currentField: cardObj,
                      currentScreen: currentCard,
                      field: headingField,
                      localisedCode: headingField?.value,
                      value: event.target.value,
                    },
                  });
                }}
                style={{ marginTop: 4, marginBottom: 8 }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ fontWeight: 600 }}>{t("SECTION_DESCRIPTION")}</span>
                <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_SECTION_DESCRIPTION")}/>
              </div>
              <TextInput
                name="sectionDescription"
                value={useCustomT(descriptionField?.value || "")}
                placeholder={t("ENTER_SECTION_DESCRIPTION")}
                onChange={(event) => {
                  dispatch({
                    type: "UPDATE_HEADER_FIELD",
                    payload: {
                      currentField: cardObj,
                      currentScreen: currentCard,
                      field: descriptionField,
                      localisedCode: descriptionField?.value,
                      value: event.target.value,
                    },
                  });
                }}
                style={{ marginTop: 4, marginBottom: 12 }}
              />
            </div>
            <Divider />
            <div className="app-config-drawer-subheader" style={{ marginTop: 12 }}>
              <div>{t("APPCONFIG_SUBHEAD_FIELDS")}</div>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
            </div>
            {fields?.map((field, i, c) => (
              <DraggableField
                key={field.jsonPath || i}
                type={field.type}
                label={useCustomT(field.label)}
                active={field.active}
                required={field.required}
                isDelete={field.deleteFlag === false ? false : true}
                dropDownOptions={field.dropDownOptions}
                onDelete={() => {
                  dispatch({
                    type: "DELETE_FIELD",
                    payload: {
                      currentScreen: currentCard,
                      currentCard: cardObj,
                      currentField: c[i],
                    },
                  });
                }}
                onHide={() => {
                  dispatch({
                    type: "HIDE_FIELD",
                    payload: {
                      currentScreen: currentCard,
                      currentCard: cardObj,
                      currentField: c[i],
                    },
                  });
                }}
                onSelectField={() => {
                  dispatch({
                    type: "SELECT_DRAWER_FIELD",
                    payload: {
                      currentScreen: currentCard,
                      currentCard: cardObj,
                      drawerField: c[i],
                    },
                  });
                }}
                config={c[i]}
                Mandatory={field.Mandatory}
                helpText={useCustomT(field.helpText)}
                infoText={useCustomT(field.infoText)}
                innerLabel={useCustomT(field.innerLabel)}
                rest={field.rest}
                index={i}
                fieldIndex={i}
                cardIndex={cardObj}
                indexOfCard={index}
                moveField={moveField}
                fields={c}
              />
            ))}
            {currentCard?.type !== "template" && currentCard?.config?.enableFieldAddition && (
              <Button
                className={"app-config-drawer-button"}
                type={"button"}
                size={"medium"}
                icon={"AddIcon"}
                variation={"teritiary"}
                label={t("ADD_FIELD")}
                style={{ marginTop: 12 }}
                onClick={() => {
                  openAddFieldPopup({
                    currentScreen: currentCard,
                    currentCard: cardObj,
                  });
                  return;
                }}
              />
            )}
          </div>
        );
      })}
      <Button
        className={"app-config-add-section"}
        type={"button"}
        size={"large"}
        variation={"primary"}
        label={t("ADD_SECTION")}
        onClick={() => {
          dispatch({
            type: "ADD_SECTION",
            payload: {
              currentScreen: currentCard,
            },
          });
          return;
        }}
        style={{ marginTop: 16, marginBottom: 16 }}
      />
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
            <TextInput
              name="name"
              value={useCustomT(currentCard?.actionLabel)}
              onChange={(event) => {
                updateLocalization(
                  currentCard?.actionLabel && currentCard?.actionLabel !== true
                    ? currentCard?.actionLabel
                    : `${currentCard?.parent}_${currentCard?.name}_ACTION_BUTTON_LABEL`,
                  Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                  event.target.value
                );
                dispatch({
                  type: "ADD_ACTION_LABEL",
                  payload: {
                    currentScreen: currentCard,
                    actionLabel:
                      currentCard?.actionLabel && currentCard?.actionLabel !== true
                        ? currentCard?.actionLabel
                        : `${currentCard?.parent}_${currentCard?.name}_ACTION_BUTTON_LABEL`,
                  },
                });
                return;
              }}
            />
          </LabelFieldPair>
        </>
      )}
    </React.Fragment>
  );
}

export default React.memo(AppFieldScreenWrapper);
