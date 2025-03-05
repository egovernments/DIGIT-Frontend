import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useTranslation } from "react-i18next";
import { Button, Card, CardHeader, Divider, Stepper, Tab, ActionBar } from "@egovernments/digit-ui-components";
import AppFieldComposer from "./AppFieldComposer";
import _ from "lodash";
import { useCustomT } from "./useCustomT";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const FIELD_TYPE = "FIELD";

function AppFieldScreenWrapper({}) {
  const { state, dispatch } = useAppConfigContext();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const { t } = useTranslation();
  const ref = useRef(null);
  const dragRef = useRef(null);
  const [isDraggingField, setIsDraggingField] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: FIELD_TYPE,
    item: () => {
      setIsDraggingField(true);
      return field;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => setTimeout(() => setIsDraggingField(false), 200),
  });

  const [, drop] = useDrop({
    accept: FIELD_TYPE,
    hover: (draggedItem) => {
      console.log("kfjdk", draggedItem);
      // if (draggedItem.index !== index) {
      //   moveField(draggedItem.index, index);
      //   draggedItem.index = index;
      // }
    },
  });

  drop(ref);
  drag(dragRef);

  const currentCard = useMemo(() => {
    return state?.screenData?.[0];
  }, [
    state?.screenData,
    // , numberTabs, stepper, currentStep
  ]);

  const moveField = useCallback(
    (fromIndex, toIndex) => {
      dispatch({
        type: "REORDER_FIELDS",
        payload: { currentScreen: currentCard, fromIndex, toIndex },
      });
    },
    [dispatch, currentCard]
  );

  return (
    <React.Fragment>
      {currentCard?.cards?.map(({ fields, description, header, headerFields }, index, card) => {
        return (
          <Card className="appConfigScreenCard">
            {headerFields?.map(({ type, label, active, required, value }, indx, cx) => (
              <AppFieldComposer
                type={type}
                label={label}
                active={active}
                required={required}
                value={useCustomT(`${projectType}_${currentCard.parent}_${currentCard.name}_${label}`)}
                headerFields={true}
                onChange={(event) => {
                  dispatch({
                    type: "UPDATE_HEADER_FIELD",
                    payload: {
                      currentField: card[index],
                      currentScreen: currentCard,
                      field: cx[indx],
                      localisedCode: `${projectType}_${currentCard.parent}_${currentCard.name}_${label}`,
                      value: event.target.value,
                    },
                  });
                }}
              />
            ))}
            <Divider />
            {fields?.map(
              ({ type, label, active, required, Mandatory, helpText, infoText, innerLabel, dropDownOptions, deleteFlag, ...rest }, i, c) => (
                <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, display: "flex", alignItems: "center" }}>
                  <span ref={dragRef} style={{ cursor: "grab", marginRight: "8px" }}>
                    ☰
                  </span>
                  <AppFieldComposer
                    type={type}
                    label={useCustomT(label)}
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
                    Mandatory={Mandatory}
                    helpText={useCustomT(helpText)}
                    infoText={useCustomT(infoText)}
                    innerLabel={useCustomT(innerLabel)}
                    rest={rest}
                  />
                </div>
              )
            )}
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
    </React.Fragment>
  );
}

export default AppFieldScreenWrapper;
