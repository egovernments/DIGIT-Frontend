import { Button, Dropdown, LabelFieldPair, PopUp, Switch, TextArea, TextInput } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";

const whenToShow = (panelItem, drawerState) => {
  if (!panelItem?.label || !drawerState?.[panelItem.label]) {
    return false;
  }
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
      break;
    case "startDate":
    case "endDate":
      return "date";
      break;
    case "countryPrefix":
      return "prefix";
      break;
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
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
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
            />
          )}

          {whenToShow(panelItem, drawerState) === "date" && (
            <TextInput
              isRequired={true}
              className=""
              type={"date"}
              name="title"
              value={drawerState?.[panelItem.label]}
              onChange={(event) => {
                if (event?.target?.value) {
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
  const [showPopup, setShowPopup] = useState(null);
  const [drawerState, setDrawerState] = useState({
    ...state?.drawerField,
  });
  const MdmsMasterList = [
    {
      moduleName: "common-masters",
      masterName: "GenderType",
    },
  ];

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

  const parseCurl = (curl) => {
    const urlMatch = curl.match(/(https?:\/\/[^\s']+)/);
    const url = urlMatch ? urlMatch[0] : "";

    // Extract headers
    const headers = {};
    const headerMatches = curl.match(/--header\s+['"]([^'"]+)['"]/g);
    if (headerMatches) {
      headerMatches.forEach((h) => {
        const [key, value] = h
          .replace(/--header\s+['"]/, "")
          .replace(/['"]$/, "")
          .split(/:\s(.+)/);
        if (key && value) headers[key.trim()] = value.trim();
      });
    }

    // Extract payload (supports multi-line JSON)
    let payload = {};
    const dataMatch = curl.match(/--data(?:-raw)?\s+(['"])([\s\S]+?)\1/);
    if (dataMatch) {
      const rawData = dataMatch[2]; // Extract JSON body
      try {
        payload = JSON.parse(rawData);

        // Remove RequestInfo if present
        if (payload.RequestInfo) {
          delete payload.RequestInfo;
        }
      } catch (error) {
        console.warn("Invalid JSON in payload");
      }
    }

    // Extract query parameters
    const urlObj = new URL(url);
    const queryParams = Object.fromEntries(urlObj.searchParams.entries());

    return {
      url: urlObj.pathname, // Extract path only
      params: queryParams, // Store extracted query parameters
      headers,
      body: payload,
    };
  };

  const handleSubmit = () => {
    const reqCriteria = parseCurl(drawerState?.curl);
    setDrawerState((prev) => ({
      ...prev,
      reqCriteria: reqCriteria,
    }));
    setShowPopup(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {state?.MASTER_DATA?.DrawerPanelConfig?.map((panelItem, index) => {
        if (isFieldVisible(panelItem)) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
      {drawerState?.type === "dropdown" ? (
        <Switch
          label={"MDMS Dropdown"}
          onToggle={(value) =>
            setDrawerState((prev) => ({
              ...prev,
              type: "dropdown",
              isMdms: value,
              isApi: false,
            }))
          }
          isCheckedInitially={drawerState?.isMdms ? true : false}
          shapeOnOff
        />
      ) : null}
      {drawerState?.type === "dropdown" ? (
        <Switch
          label={"API Dropdown"}
          onToggle={(value) =>
            setDrawerState((prev) => ({
              ...prev,
              type: "dropdown",
              isApi: value,
              isMdms: false,
            }))
          }
          isCheckedInitially={drawerState?.isApi ? true : false}
          shapeOnOff
        />
      ) : null}
      {drawerState?.type === "dropdown" && drawerState?.isApi ? (
        <Button
          type={"button"}
          size={"small"}
          variation={"primary"}
          label={t("ADD_API_DETAILS")}
          onClick={() => {
            setShowPopup(true);
          }}
        />
      ) : null}
      {drawerState?.isMdms ? (
        <Dropdown
          variant={""}
          t={t}
          option={MdmsMasterList.map((i) => ({ ...i, code: `${i.moduleName}.${i.masterName}` }))}
          optionKey={"code"}
          selected={drawerState?.moduleMaster || {}}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              moduleMaster: value,
            }));
          }}
        />
      ) : null}

      {(drawerState?.type === "dropdown" || drawerState?.type === "checkbox") && (
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
            label={t("ADD_OPTIONS")}
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
      {showPopup && (
        <PopUp
          className={"app-config-pop"}
          type={"default"}
          heading={`${t("ADD_API_DETAILS")}`}
          children={[]}
          onOverlayClick={() => {
            setShowPopup(false);
          }}
          footerChildren={[
            <Button
              className={"app-config-pop-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("DIGIT_CLOSE")}
              onClick={() => {
                setShowPopup(false);
              }}
            />,
            <Button
              className={"app-config-pop-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CONFIRM_BUTTON")}
              onClick={() => {
                handleSubmit();
                // setShowPopup(false);
              }}
            />,
          ]}
          onClose={() => {
            setShowPopup(false);
          }}
          sortFooterChildren={true}
        >
          <TextArea
            type="textarea"
            name={""}
            className="appConfiglabelField-Input"
            value={drawerState?.curl || ""}
            onChange={(e) => {
              setDrawerState((prev) => ({
                ...prev,
                curl: e.target.value,
              }));
            }}
          />
        </PopUp>
      )}
    </div>
  );
}

export default React.memo(DrawerFieldComposer);
