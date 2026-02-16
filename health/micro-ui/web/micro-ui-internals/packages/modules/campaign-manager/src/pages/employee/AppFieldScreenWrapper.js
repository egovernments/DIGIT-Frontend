import React, { useEffect, useMemo, useState } from "react";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useTranslation } from "react-i18next";
import { Button, Card, CardHeader, Divider, Stepper, Tab, ActionBar } from "@egovernments/digit-ui-components";
import AppFieldComposer from "./AppFieldComposer";
import _ from "lodash";

const Tabs = ({ numberTabs, onTabChange }) => {
  const { state, dispatch } = useAppConfigContext();
  const { t } = useTranslation();
  return (
    <div className="campaign-tabs">
      {numberTabs.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`campaign-tab-head ${_.active === true ? "active" : ""} hover`}
          onClick={() => onTabChange(_, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0 .1rem" }}>{t(_.parent)}</p>
        </button>
      ))}
    </div>
  );
};

function AppFieldScreenWrapper() {
  const { state, dispatch } = useAppConfigContext();
  const { t } = useTranslation();
  // const appTemplate = state?.["MASTER_DATA"]?.AppScreenConfigTemplateSchema;
  const appTemplate = state?.screenData;
  const [numberTabs, setNumberTabs] = useState(
    [...new Set(appTemplate?.map((i) => i?.parent))].map((i, index) => {
      return { parent: i, active: index === 0 ? true : false, code: index + 1 };
    })
  );

  const [stepper, setStepper] = useState(
    appTemplate
      ?.filter((i) => i.parent === numberTabs.find((j) => j.active)?.parent)
      .sort((a, b) => a.order - b.order)
      ?.map((k, j, t) => ({
        name: k.name,
        isLast: j === t.length - 1 ? true : false,
        isFirst: j === 0 ? true : false,
        active: j === 0 ? true : false,
      }))
  );

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // if (currentStep) {
    setStepper((prev) => {
      return prev.map((i, c) => {
        if (c === currentStep - 1) {
          return {
            ...i,
            active: true,
          };
        }
        return {
          ...i,
          active: false,
        };
      });
    });
    dispatch({
      type: "UNSELECT_DRAWER_FIELD",
    });
    // }
  }, [currentStep]);

  const currentCard = useMemo(() => {
    return state?.screenData
      ?.filter((i) => i.parent === numberTabs.find((j) => j.active)?.parent)
      ?.sort((a, b) => a.order - b.order)
      ?.filter((k) => k.name === stepper.find((l) => l.active)?.name)?.[0];
  }, [state?.screenData, numberTabs, stepper, currentStep]);

  return (
    <React.Fragment>
      <Tabs
        numberTabs={numberTabs}
        onTabChange={(tab, index) => {
          setNumberTabs((prev) => {
            return prev.map((j) => {
              if (j.parent === tab.parent) {
                return {
                  ...j,
                  active: true,
                };
              }
              return {
                ...j,
                active: false,
              };
            });
          });
        }}
      />
      <Stepper
        customSteps={[...stepper?.map((i) => i.name)]}
        currentStep={currentStep}
        onStepClick={() => {}}
        activeSteps={0}
        className={"appConfig-flow-stepper"}
      />
      {currentCard?.cards?.map(({ fields, description, header, headerFields }, index, card) => {
        return (
          <Card className="appConfigScreenCard">
            {headerFields?.map(({ type, label, active, required }) => (
              <AppFieldComposer type={type} label={label} active={active} required={required} headerFields={true} />
            ))}
            <Divider />
            {fields?.map(({ type, label, active, required, dropDownOptions, deleteFlag }, i, c) => (
              <AppFieldComposer
                type={type}
                label={label}
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
              />
            ))}
            {currentCard?.config?.enableFieldAddition && (
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("ADD_FIELD")}
                onClick={() => {
                  dispatch({
                    type: "ADD_FIELD",
                    payload: {
                      currentScreen: currentCard,
                      currentCard: card[index],
                    },
                  });
                  return;
                }}
              />
            )}
          </Card>
        );
      })}
      {currentCard?.config?.enableSectionAddition && (
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
      {stepper && (
        <ActionBar className="app-config-actionBar">
          {!stepper?.find((i) => i.active)?.isFirst && (
            <Button
              className="previous-button"
              variation="secondary"
              label={t("BACK")}
              title={t("BACK")}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            />
          )}
          {!stepper?.find((i) => i.active)?.isLast && (
            <Button
              className="previous-button"
              variation="primary"
              label={t("NEXT")}
              title={t("NEXT")}
              onClick={() => setCurrentStep((prev) => prev + 1)}
            />
          )}
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default AppFieldScreenWrapper;
