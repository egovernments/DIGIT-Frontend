import { Button, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../utils";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import Switch from "../../components/Switch";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
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
      <Switch
        label={t("MANDATORY")}
        onToggle={(value) =>
          setDrawerState((prev) => ({
            ...prev,
            required: value,
          }))
        }
        isCheckedInitially={drawerState?.required ? true : false}
        shapeOnOff
      />

      <Switch
        label={t("LABEL")}
        onToggle={(value) => {
          setDrawerState((prev) => ({
            ...prev,
            isLabel: value,
          }));
        }}
        isCheckedInitially={drawerState?.isLabel ? true : false}
        shapeOnOff
      />
      {drawerState?.isLabel && (
        <TextInput
          isRequired={true}
          className=""
          type={"text"}
          name="title"
          value={useCustomT(drawerState?.label)}
          onChange={(event) => {
            updateLocalization(
              `MR_DN_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${drawerState?.id}`,
              Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN",
              event.target.value
            );
            setDrawerState((prev) => ({
              ...prev,
              label: `MR_DN_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${drawerState?.id}`,
            }));
          }}
          placeholder={""}
        />
      )}

      {(drawerState?.type === "dropDown" || drawerState?.type === "checkbox") && (
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
                  //   setDropDownOptions((prev) => {
                  //     return prev.map((i) => {
                  //       if (i.id === item.id) {
                  //         return {
                  //           ...i,
                  //           name: event.target.value,
                  //         };
                  //       }
                  //       return i;
                  //     });
                  //   });
                }}
                placeholder={""}
              />
              <div
                // onClick={() => setDropDownOptions((prev) => prev.filter((i) => i.id !== item.id))}
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
            onClick={
              () =>
                setDrawerState((prev) => ({
                  ...prev,
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
              //   setDropDownOptions((prev) => [
              //     ...prev,
              //     {
              //       id: crypto.randomUUID(),
              //       name: "",
              //     },
              //   ])
            }
          />
        </div>
      )}
    </div>
  );
}

export default DrawerFieldComposer;
