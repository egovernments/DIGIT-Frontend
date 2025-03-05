import { Button, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import Switch from "../../../components/Switch";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";

const whenToShow = (panelItem, drawerState) => {
  switch (panelItem?.label) {
    case "infoText":
    case "label":
    case "helpText":
    case "innerLabel":
      return "text";
      break;
    case "min":
    case "max":
    case "numberLength":
      return "number";
    case "startDate":
    case "endDate":
      return "date";
    case "countryPrefix":
      return "prefix";
    default:
      return false;
      break;
  }
};

const RenderField = ({ state, panelItem, drawerState, setDrawerState, updateLocalization }) => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  switch (panelItem?.fieldType) {
    case "toggle":
      return (
        <>
          <Switch
            label={t(panelItem?.label)}
            onToggle={(value) =>
              setDrawerState((prev) => ({
                ...prev,
                [panelItem.label]: value,
              }))
            }
            isCheckedInitially={drawerState?.[panelItem.label] ? true : false}
            shapeOnOff
          />
          {whenToShow(panelItem, drawerState) === "text" && (
            <TextInput
              isRequired={true}
              className=""
              type={"text"}
              name="title"
              value={useCustomT(drawerState?.[panelItem.label])}
              onChange={(event) => {
                updateLocalization(
                  `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem.label}_${
                    drawerState?.jsonPath || drawerState?.id
                  }`,
                  Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN",
                  event.target.value
                );
                setDrawerState((prev) => ({
                  ...prev,
                  [panelItem.label]: `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem.label}_${
                    drawerState?.jsonPath || drawerState?.id
                  }`,
                }));
              }}
              placeholder={""}
            />
          )}

          {whenToShow(panelItem, drawerState) === "number" && (
            <TextInput
              isRequired={true}
              className=""
              type={"number"}
              name="title"
              value={drawerState?.[panelItem.label]}
              onChange={(event) => {
                setDrawerState((prev) => ({
                  ...prev,
                  [panelItem.label]: event.target.value,
                }));
              }}
              placeholder={""}
            >
              {console.log("panelItem", panelItem, drawerState)}
            </TextInput>
          )}

          {whenToShow(panelItem, drawerState) === "date" && (
            <TextInput
              isRequired={true}
              className=""
              type={"date"}
              name="title"
              value={drawerState?.[panelItem.label]}
              onChange={(event) => {
                if (event.target.value) {
                  setDrawerState((prev) => ({
                    ...prev,
                    [panelItem.label]: event.target.value,
                  }));
                }
              }}
              placeholder={""}
            />
          )}

          {whenToShow(panelItem, drawerState) === "prefix" && (
            <TextInput
              isRequired={true}
              className=""
              type={"text"}
              name="title"
              value={drawerState?.[panelItem.label]}
              onChange={(event) => {
                setDrawerState((prev) => ({
                  ...prev,
                  [panelItem.label]: event.target.value,
                }));
              }}
              placeholder={""}
            />
          )}
        </>
      );
    case "dropdown":
      return (
        <Dropdown
          // style={}
          variant={""}
          t={t}
          option={state?.MASTER_DATA?.AppFieldType}
          optionKey={"type"}
          selected={state?.MASTER_DATA?.AppFieldType?.find((i) => i.type === drawerState?.type)}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              type: value?.type,
            }));
          }}
        />
      );
    default:
      return null;
      break;
  }
};

function DrawerFieldComposer() {
  const { t } = useTranslation();
  const { locState, updateLocalization } = useAppLocalisationContext();
  const { state, dispatch } = useAppConfigContext();
  const [drawerState, setDrawerState] = useState({
    ...state?.drawerField,
  });

  useEffect(() => {
    if (state?.drawerField) {
      setDrawerState(state?.drawerField);
    }
  }, [state?.drawerField]);
  useEffect(() => {
    dispatch({
      type: "UPDATE_DRAWER_FIELD",
      payload: {
        updatedState: drawerState,
      },
    });
  }, [drawerState]);

  const isFieldVisible = (field) => {
    // If visibilityEnabledFor is empty, the field is always visible
    if (field?.visibilityEnabledFor?.length === 0) return true;
    return field?.visibilityEnabledFor?.includes(drawerState?.type); // Check if current drawerState type matches
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {state?.MASTER_DATA?.DrawerPanelConfig?.map((panelItem, index) => {
        if (isFieldVisible(panelItem)) {
          return (
            <div>
              <RenderField
                panelItem={panelItem}
                drawerState={drawerState}
                setDrawerState={setDrawerState}
                state={state}
                updateLocalization={updateLocalization}
              />
            </div>
          );
        }
      })}

      {(drawerState?.type === "dropdown" || drawerState?.type === "dropDown" || drawerState?.type === "checkbox") && (
        <div
          style={{ padding: "1.5rem", border: "1px solid #c84c0e", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {drawerState?.dropDownOptions?.map((item, index) => (
            <div style={{ display: "flex", gap: "1rem" }}>
              <TextInput
                isRequired={true}
                className=""
                type={"text"}
                name="title"
                value={item?.name}
                onChange={(event) => {
                  setDrawerState((prev) => ({
                    ...prev,
                    dropDownOptions: prev?.dropDownOptions?.map((i) => {
                      if (i.id === item.id) {
                        return {
                          ...i,
                          name: event.target.value,
                        };
                      }
                      return i;
                    }),
                  }));
                }}
                placeholder={""}
              />
              <div
                onClick={() =>
                  setDrawerState((prev) => ({
                    ...prev,
                    dropDownOptions: prev?.dropDownOptions.filter((i) => i.id !== item.id),
                  }))
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  marginLeft: "1rem",
                  fontSize: "1rem",
                  color: PRIMARY_COLOR,
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <DustbinIcon />
              </div>
            </div>
          ))}

          <Button
            type={"button"}
            size={"small"}
            variation={"teritiary"}
            label={t("ADD_OPTIONS_FOR_DROPDOWN_APP")}
            onClick={() =>
              setDrawerState((prev) => ({
                ...prev,
                optionsKey: "name",
                dropDownOptions: prev?.dropDownOptions
                  ? [
                      ...prev?.dropDownOptions,
                      {
                        id: crypto.randomUUID(),
                        name: "",
                      },
                    ]
                  : [
                      {
                        id: crypto.randomUUID(),
                        name: "",
                      },
                    ],
              }))
            }
          />
        </div>
      )}
    </div>
  );
}

export default DrawerFieldComposer;
