import { Button, Dropdown, LabelFieldPair, PopUp, RadioButtons, Switch, TextArea, TextInput } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import Tabs from "./Tabs";

const whenToShow = (panelItem, drawerState) => {
  const anyCheck = drawerState?.[panelItem?.bindTo] !== undefined ? drawerState?.[panelItem?.bindTo] : drawerState?.[panelItem?.label];
  if (!panelItem?.showFieldOnToggle || !anyCheck) {
    return false;
  }
  if (panelItem?.showFieldOnToggle && anyCheck) {
    return panelItem?.conditionalField;
  }
};

const disableFieldForMandatory = (drawerState, label) => {
  // todo need to think about it @nabeel & @jagan
  if (drawerState?.Mandatory && !drawerState?.deleteFlag) {
    return label == "Mandatory" ? true : false;
  }
  return false;
};

const RenderField = ({ state, panelItem, drawerState, setDrawerState, updateLocalization, AppScreenLocalisationConfig }) => {
  const { t } = useTranslation();
  const isLocalisable = AppScreenLocalisationConfig?.fields
    ?.find((i) => i.fieldType === drawerState?.type)
    ?.localisableProperties?.includes(panelItem?.label);
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const shouldShow = whenToShow(panelItem, drawerState);

  switch (panelItem?.fieldType) {
    case "toggle":
      return (
        <>
          <Switch
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
            onToggle={(value) =>
              setDrawerState((prev) => ({
                ...prev,
                [panelItem?.bindTo ? panelItem?.bindTo : panelItem?.label]: value,
              }))
            }
            isCheckedInitially={drawerState?.[panelItem.label] ? true : false}
            disable={disableFieldForMandatory(drawerState, panelItem?.label)}
            shapeOnOff
          />
          {/* //todo again clean up this logic,  */}
          {shouldShow && shouldShow?.type === "MdmsDropdown" ? (
            <Dropdown
              variant={""}
              t={t}
              option={[
                {
                  moduleName: "common-masters",
                  masterName: "GenderType",
                },
                {
                  moduleName: "HCM",
                  masterName: "HOUSE_STRUCTURE_TYPES",
                },
              ].map((i) => ({ ...i, code: `${i.moduleName}.${i.masterName}` }))}
              optionKey={"code"}
              selected={
                [
                  {
                    moduleName: "common-masters",
                    masterName: "GenderType",
                  },
                ]
                  .map((i) => ({ ...i, code: `${i.moduleName}.${i.masterName}` }))
                  ?.find((i) => i.code === drawerState?.[shouldShow?.bindTo]) || {}
              }
              select={(value) => {
                setDrawerState((prev) => ({
                  ...prev,
                  [shouldShow?.bindTo]: value?.code,
                }));
              }}
            />
          ) : shouldShow ? (
            shouldShow && shouldShow?.type === "radioOptions" ? (
              <RadioButtons // it should be changed to radio button
                options={shouldShow?.options}
                additionalWrapperClass="app-config-radio"
                selectedOption={shouldShow?.options?.find((i) => i.pattern === drawerState?.[shouldShow?.bindTo]?.code)}
                onSelect={(value) => {
                  setDrawerState((prev) => ({
                    ...prev,
                    [shouldShow?.bindTo]: value?.pattern,
                  }));
                }}
                optionsKey="code"
              />
            ) : (
              <TextInput
                isRequired={true}
                className=""
                type={
                  shouldShow?.type === "number"
                    ? "number"
                    : shouldShow?.type === "datePicker"
                    ? "date"
                    : shouldShow?.type === "textArea"
                    ? "textArea"
                    : "text"
                }
                name="title"
                value={
                  isLocalisable
                    ? useCustomT(drawerState?.[panelItem?.conditionalField?.bindTo ? panelItem?.conditionalField?.bindTo : panelItem?.label])
                    : drawerState?.[panelItem?.conditionalField?.bindTo ? panelItem?.conditionalField?.bindTo : panelItem?.label] === true
                    ? ""
                    : drawerState?.[panelItem?.conditionalField?.bindTo ? panelItem?.conditionalField?.bindTo : panelItem?.label]
                }
                onChange={(event) => {
                  if (isLocalisable) {
                    updateLocalization(
                      drawerState?.[panelItem.label] && drawerState?.[panelItem.label] !== true
                        ? drawerState?.[panelItem.label]
                        : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem.label}_${
                            drawerState?.jsonPath || drawerState?.id
                          }`,
                      Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN",
                      event.target.value
                    );
                    setDrawerState((prev) => ({
                      ...prev,
                      [shouldShow?.bindTo]:
                        drawerState?.[panelItem.label] && drawerState?.[panelItem.label] !== true
                          ? drawerState?.[panelItem.label]
                          : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem.label}_${
                              drawerState?.jsonPath || drawerState?.id
                            }`,
                    }));
                    return;
                  } else {
                    setDrawerState((prev) => ({
                      ...prev,
                      [shouldShow?.bindTo]: event.target.value,
                    }));
                    return;
                  }
                }}
                placeholder={""}
              />
            )
          ) : null}
          {shouldShow && shouldShow?.showErrorMessage ? (
            <TextInput
              isRequired={true}
              className=""
              type={"text"}
              name="title"
              value={useCustomT(drawerState?.[`${panelItem?.bindTo}.message`])}
              onChange={(event) => {
                updateLocalization(
                  drawerState?.[`${panelItem?.bindTo}.message`] && drawerState?.[`${panelItem?.bindTo}.message`] !== true
                    ? drawerState?.[`${panelItem?.bindTo}.message`]
                    : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem.label}_errorMessage_${
                        drawerState?.jsonPath || drawerState?.id
                      }`,
                  Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN",
                  event.target.value
                );
                setDrawerState((prev) => ({
                  ...prev,
                  [`${panelItem?.bindTo}.message`]: `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${
                    panelItem.label
                  }_errorMessage_${drawerState?.jsonPath || drawerState?.id}`,
                }));
                return;
              }}
              placeholder={""}
            />
          ) : null}
        </>
      );
    case "options":
      return (
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
                value={useCustomT(item?.name)}
                onChange={(event) => {
                  setDrawerState((prev) => ({
                    ...prev,
                    dropDownOptions: prev?.dropDownOptions?.map((i) => {
                      if (i.code && i.code === item.code) {
                        updateLocalization(
                          item?.name ? item?.name : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${item?.code}`,
                          Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN",
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
              />
              <div
                onClick={() =>
                  setDrawerState((prev) => ({
                    ...prev,
                    dropDownOptions: prev?.dropDownOptions.filter((i) => i.code !== item.code),
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
            label={t("ADD_OPTIONS")}
            onClick={() =>
              setDrawerState((prev) => ({
                ...prev,
                optionsKey: "name",
                dropDownOptions: prev?.dropDownOptions
                  ? [
                      ...prev?.dropDownOptions,
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
    case "fieldTypeDropdown":
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
  const { locState, updateLocalization, AppScreenLocalisationConfig } = useAppLocalisationContext();
  const { state, dispatch } = useAppConfigContext();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const [drawerState, setDrawerState] = useState({
    ...state?.drawerField,
  });
  const [tabs, setTabs] = useState(
    [...new Set((state?.MASTER_DATA?.DrawerPanelConfig || []).map((item) => item.tab))]?.map((i, j) => ({
      parent: i,
      active: j === 0 ? true : false,
    }))
  );
  const currentDrawerState = useMemo(() => {
    const activeTab = tabs?.find((j) => j.active === true)?.parent;
    return state?.MASTER_DATA?.DrawerPanelConfig?.filter((i) => i.tab === activeTab);
  }, [state?.MASTER_DATA?.drawerField, tabs]);

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
    return field?.visibilityEnabledFor?.includes(drawerState?.appType); // Check if current drawerState type matches
  };

  return (
    <>
      <Tabs
        numberTabs={tabs}
        onTabChange={(tab, index) => {
          setTabs((prev) => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {tabs?.find((i) => i.active)?.parent === "content" && (
          <Dropdown
            // style={}
            variant={""}
            t={t}
            option={state?.MASTER_DATA?.AppFieldType}
            optionKey={"type"}
            disabled={disableFieldForMandatory(drawerState, "Mandatory")} // todo need to think about it @nabeel & @jagan
            selected={state?.MASTER_DATA?.AppFieldType?.find((i) => i.type === drawerState?.appType)}
            select={(value) => {
              setDrawerState((prev) => ({
                ...prev,
                type: value?.fieldType,
                appType: value?.type,
              }));
            }}
          />
        )}
        {currentDrawerState?.map((panelItem, index) => {
          if (isFieldVisible(panelItem)) {
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <RenderField
                  panelItem={panelItem}
                  drawerState={drawerState}
                  setDrawerState={setDrawerState}
                  state={state}
                  updateLocalization={updateLocalization}
                  AppScreenLocalisationConfig={AppScreenLocalisationConfig}
                />
              </div>
            );
          }
        })}
        {/* // todo need to update and cleanup */}
        {currentDrawerState?.every((panelItem, index) => !isFieldVisible(panelItem)) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            No {currentDrawerState?.[0]?.tab} configured for this field type
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(DrawerFieldComposer);
