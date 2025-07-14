import React from "react";
import { TextInput, Dropdown, RadioButtons, Button, FieldV1 } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useCustomT } from "./useCustomT";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";

export const RenderConditionalField = ({
  cField,
  cIndex,
  cArray,
  setDrawerState,
  updateLocalization,
  state,
  drawerState,
  AppScreenLocalisationConfig,
  disabled,
}) => {
  const { t } = useTranslation();
  const isLocalisable = AppScreenLocalisationConfig?.fields
    ?.find((i) => i.fieldType === (drawerState?.appType || drawerState?.type))
    ?.localisableProperties?.includes(cField?.bindTo?.split(".")?.at(-1));
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");

  switch (cField?.type) {
    case "text":
    case "number":
    case "date":
    case "time":
      return (
        <FieldV1
          type={cField?.type}
          label={cField?.label}
          withoutLabel={Boolean(!cField?.label)}
          value={
            isLocalisable ? useCustomT(drawerState?.[cField?.bindTo]) : drawerState?.[cField?.bindTo] === true ? "" : drawerState?.[cField?.bindTo]
          }
          config={{
            step: "",
          }}
          onChange={(event) => {
            const value = event.target.value;
            if (isLocalisable) {
              updateLocalization(
                drawerState?.[cField.bindTo] && drawerState?.[cField.bindTo] !== true
                  ? drawerState?.[cField.bindTo]
                  : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${cField.bindTo}_${
                      drawerState?.jsonPath || drawerState?.id
                    }`,
                Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                value
              );
              setDrawerState((prev) => ({
                ...prev,
                [cField?.bindTo]:
                  drawerState?.[cField.bindTo] && drawerState?.[cField.bindTo] !== true
                    ? drawerState?.[cField.bindTo]
                    : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${cField.bindTo}_${
                        drawerState?.jsonPath || drawerState?.id
                      }`,
              }));
              return;
            } else {
              setDrawerState((prev) => ({
                ...prev,
                [cField?.bindTo]: value,
              }));
              return;
            }
          }}
          populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
          // charCount={field?.charCount}
          disabled={disabled}
        />
      );
    case "options":
      return (
        <div
          style={{ padding: "1.5rem", border: "1px solid #c84c0e", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {(drawerState?.[cField?.bindTo] || []).map((item, index) => (
            <div style={{ display: "flex", gap: "1rem" }} key={item.code || index}>
              <TextInput
                isRequired={true}
                className=""
                type={"text"}
                name="title"
                value={useCustomT(item?.name)}
                onChange={(event) => {
                  setDrawerState((prev) => ({
                    ...prev,
                    [cField?.bindTo]: prev?.[cField?.bindTo]?.map((i) => {
                      if (i.code && i.code === item.code) {
                        updateLocalization(
                          item?.name ? item?.name : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${item?.code}`,
                          Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                          event.target.value
                        );
                        return {
                          ...i,
                          name: item?.name
                            ? item?.name
                            : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${item?.code}`,
                        };
                      }
                      return i;
                    }),
                  }));
                  return;
                }}
                placeholder={""}
                disabled={disabled}
              />
              <div
                onClick={() =>
                  setDrawerState((prev) => ({
                    ...prev,
                    [cField?.bindTo]: prev?.[cField?.bindTo]?.filter((i) => i.code !== item.code),
                  }))
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  marginLeft: "1rem",
                  fontSize: "1rem",
                  color: "#c84c0e",
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
            icon="AddIcon"
            size={"small"}
            variation={"teritiary"}
            label={t("ADD_OPTIONS")}
            disabled={disabled}
            onClick={() =>
              setDrawerState((prev) => ({
                ...prev,
                [cField?.bindTo]: prev?.[cField?.bindTo]
                  ? [
                      ...prev?.[cField?.bindTo],
                      {
                        code: crypto.randomUUID(),
                        name: "",
                      },
                    ]
                  : [
                      {
                        code: crypto.randomUUID(),
                        name: "",
                      },
                    ],
              }))
            }
          />
        </div>
      );
    case "dropdown":
      return (
        <Dropdown
          variant={""}
          t={t}
          option={cField?.options || []}
          disabled={disabled}
          optionKey={cField?.optionKey || "code"}
          selected={cField?.options?.find((i) => i.code === drawerState?.[cField?.bindTo]) || {}}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.code,
            }));
          }}
        />
      );
    case "MdmsDropdown":
      return (
        <Dropdown
          variant={""}
          t={t}
          disabled={disabled}
          option={cField?.mdmsOptions || []}
          optionKey={"schemaCode"}
          selected={(cField?.mdmsOptions || []).find((i) => i.schemaCode === drawerState?.[cField?.bindTo]) || {}}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.schemaCode,
            }));
          }}
        />
      );
    case "radioOptions":
      return (
        <RadioButtons
          options={cField?.options}
          disabled={disabled}
          additionalWrapperClass="app-config-radio"
          selectedOption={cField?.options?.find((i) => i.pattern === drawerState?.[cField?.bindTo])}
          onSelect={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.pattern,
            }));
          }}
          optionsKey="code"
        />
      );
    default:
      return null;
  }
};
