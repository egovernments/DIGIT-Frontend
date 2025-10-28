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
import NavigationLogicWrapper from "./NavigationLogicWrapper";

function AppFieldScreenWrapper({ parentState, tabState }) {
  const { state, dispatch, openAddFieldPopup } = useAppConfigContext();
  const { locState, updateLocalization } = useAppLocalisationContext();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const formId = searchParams.get("formId");
  const { t } = useTranslation();
  const useT = useCustomT();

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
      {currentCard?.cards?.map(({ fields, description, header, headerFields }, index, card) => {
        return (
          <>
            <div className="app-config-drawer-subheader">
              <div>{t("APPCONFIG_HEAD_FIELDS")}</div>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_HEAD_FIELDS")} />
            </div>
            <Divider />
            {headerFields?.map(({ type, label, active, required, value }, indx, cx) => (
              <AppFieldComposer
                type={type}
                label={label}
                active={active}
                required={required}
                value={useT(formId ? value : `${projectType}_${currentCard.parent}_${currentCard.name}_${label}`)}
                headerFields={true}
                onChange={(event) => {
                  dispatch({
                    type: "UPDATE_HEADER_FIELD",
                    payload: {
                      currentField: card[index],
                      currentScreen: currentCard,
                      field: cx[indx],
                      localisedCode: formId ? value : `${projectType}_${currentCard.parent}_${currentCard.name}_${label}`,
                      value: event.target.value,
                    },
                  });
                }}
              />
            ))}
            <Divider />
            <div className="app-config-drawer-subheader">
              <div> {t("APPCONFIG_SUBHEAD_FIELDS")}</div>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
            </div>
            {fields?.map(
              ({ type, label, active, required, Mandatory, helpText, infoText, innerLabel, dropDownOptions, deleteFlag, ...rest }, i, c) => {
                return (
                  <DraggableField
                    type={type}
                    label={useT(label)}
                    active={active}
                    required={required}
                    isDelete={deleteFlag === false ? false : true}
                    dropDownOptions={dropDownOptions}
                    onDelete={() => {
                      dispatch({
                        type: "DELETE_FIELD",
                        payload: {
                          currentScreen: currentCard,
                          currentCard: card[index],
                          currentField: c[i],
                        },
                      });
                      // return;
                    }}
                    onHide={(e) => {
                      dispatch({
                        type: "HIDE_FIELD",
                        payload: {
                          currentScreen: currentCard,
                          currentCard: card[index],
                          currentField: c[i],
                        },
                      });
                      // return;
                    }}
                    onSelectField={() => {
                      dispatch({
                        type: "SELECT_DRAWER_FIELD",
                        payload: {
                          currentScreen: currentCard,
                          currentCard: card[index],
                          drawerField: c[i],
                        },
                      });
                      // return;
                    }}
                    config={c[i]}
                    Mandatory={Mandatory}
                    helpText={useT(helpText)}
                    infoText={useT(infoText)}
                    innerLabel={useT(innerLabel)}
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
            )}
            {currentCard?.type !== "template" && currentCard?.config?.enableFieldAddition && (
              <Button
                className={"app-config-drawer-button"}
                type={"button"}
                size={"medium"}
                icon={"AddIcon"}
                variation={"teritiary"}
                label={t("ADD_FIELD")}
                onClick={() => {
                  openAddFieldPopup({
                    currentScreen: currentCard,
                    currentCard: card[index],
                  });
                  // dispatch({
                  //   type: "ADD_FIELD",
                  //   payload: {
                  //     currentScreen: currentCard,
                  //     currentCard: card[index],
                  //     isPopup: true,
                  //   },
                  // });
                  return;
                }}
              />
            )}
          </>
        );
      })}
      {currentCard?.type !== "template" && currentCard?.config?.enableSectionAddition && (
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
        />
      )}
      <Divider className="app-config-drawer-action-divider" />
        {currentCard?.type !== "template" && currentCard?.conditionalNavigateTo && (
        <>
          <div className="app-config-drawer-subheader">
            <div>{t("APPCONFIG_NAVIGATION_LOGIC")}</div>
            <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_NAVIGATION_LOGIC")} />
          </div>
          {currentCard?.conditionalNavigateTo && (<NavigationLogicWrapper
            t={t}
            parentState={parentState}
            tabState={tabState}
            currentState={currentCard}
            onConditionalNavigateChange={(data) => {
               dispatch({
                type: "PATCH_PAGE_CONDITIONAL_NAV",
                pageName: currentCard?.name, // optional but safer
                data,                        // array built by NavigationLogicWrapper on Submit
              });
            }}
          />)}
        </>
      )}
      {currentCard?.type !== "template" && currentCard?.conditionalNavigateTo && (<Divider className="app-config-drawer-action-divider" />)}
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
              // style={{ maxWidth: "40rem" }}
              name="name"
              value={useT(currentCard?.actionLabel)}
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
