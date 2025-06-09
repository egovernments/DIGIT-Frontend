import {
  Button,
  Divider,
  Dropdown,
  FieldV1,
  LabelFieldPair,
  PopUp,
  RadioButtons,
  Switch,
  Tag,
  TextArea,
  TextBlock,
  TextInput,
} from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import Tabs from "./Tabs";
import { RenderConditionalField } from "./RenderConditionalField";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import ConsoleTooltip from "../../../components/ConsoleToolTip";

/**
 * Determines whether a specific field in a UI panel should be disabled.
 *
 * This logic currently based on disableForRequired flag in drawerpanel config for any field
 *
 * @param {Object} drawerState - Contains current field state, including `jsonPath`.
 * @param {Object} panelItem - Represents the current field item being rendered (e.g., label, config).
 * @param {Array} resourceData - List of fields (identified by jsonPath) that require disabling.
 *
 * @returns {boolean} - Returns true if the field should be disabled; false otherwise.
 */
const disableFieldForMandatory = (drawerState, panelItem, resourceData) => {
  // Check if the current field's jsonPath is in the list of fields to be disabled
  const shouldDisable = resourceData?.TemplateBaseConfig?.some((ele) => drawerState?.jsonPath === ele);

  // force disable if field is hidden
  if (drawerState?.hidden) {
    return true;
  }
  // If the field is in the disable list AND its label is either "Mandatory" or "fieldType", disable it
  if (shouldDisable && panelItem?.disableForRequired) {
    return true;
  }

  // Otherwise, the field should not be disabled
  return false;
};

//todo @jagan to make this flow dynamic ie multi flow support this flag to be updated
const getBaseTemplateFilter = (projectType = "", flowName = "") => {
  return `[?(@.project=='${projectType}' && @.name=='${flowName}')].pages[*].properties[?(@.validations[?(@.type=='required'&&@.value==true)])].fieldName`;
};

const whenToShow = (panelItem, drawerState) => {
  const anyCheck =
    panelItem?.label === "isMdms"
      ? true
      : drawerState?.[panelItem?.bindTo] !== undefined
      ? drawerState?.[panelItem?.bindTo]
      : drawerState?.[panelItem?.label];
  if (!panelItem?.showFieldOnToggle || !anyCheck) {
    return false;
  }
  if (panelItem?.showFieldOnToggle && (anyCheck || panelItem?.label === "isMdms")) {
    return panelItem?.conditionalField;
  }
};

const RenderField = ({ state, panelItem, drawerState, setDrawerState, updateLocalization, AppScreenLocalisationConfig }) => {
  const { t } = useTranslation();
  const isLocalisable = AppScreenLocalisationConfig?.fields
    ?.find((i) => i.fieldType === drawerState?.appType)
    ?.localisableProperties?.includes(panelItem?.label);
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId");
  const shouldShow = whenToShow(panelItem, drawerState);
  const flowName = useMemo(() => state?.screenConfig?.[0]?.parent, [state?.screenConfig?.[0]]);

  const reqCriteriaResource = useMemo(
    () =>
      Digit.Utils.campaign.getMDMSV1Criteria(
        tenantId,
        CONSOLE_MDMS_MODULENAME,
        [
          {
            name: "TemplateBaseConfig",
            filter: getBaseTemplateFilter(projectType, flowName),
          },
        ],
        `MDMSDATA-${projectType}-${flowName}`
      ),
    [projectType, flowName]
  );

  const { data: resourceData } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

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
            isCheckedInitially={drawerState?.[panelItem?.bindTo ? panelItem?.bindTo : panelItem?.label] ? true : false}
            disable={disableFieldForMandatory(drawerState, panelItem, resourceData)}
            shapeOnOff
          />
          {/* //Render Conditional Fields */}
          {Array.isArray(shouldShow) && shouldShow.length > 0
            ? shouldShow
                .filter(
                  (cField) =>
                    cField.condition === undefined || cField.condition === Boolean(drawerState[panelItem.bindTo ? panelItem.bindTo : panelItem.label])
                )
                .map((cField, cIndex) => (
                  <RenderConditionalField
                    key={cIndex}
                    cField={cField}
                    cIndex={cIndex}
                    cArray={shouldShow}
                    setDrawerState={setDrawerState}
                    updateLocalization={updateLocalization}
                    state={state}
                    drawerState={drawerState}
                    AppScreenLocalisationConfig={AppScreenLocalisationConfig}
                    disabled={drawerState?.hidden}
                  />
                ))
            : null}
        </>
      );
    case "text":
      return (
        <FieldV1
          type={panelItem?.fieldType}
          label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
          value={
            isLocalisable
              ? useCustomT(drawerState?.[panelItem?.bindTo])
              : drawerState?.[panelItem?.bindTo] === true
              ? ""
              : drawerState?.[panelItem?.bindTo]
          }
          config={{
            step: "",
          }}
          onChange={(event) => {
            const value = event.target.value;
            if (isLocalisable) {
              updateLocalization(
                drawerState?.[panelItem?.bindTo] && drawerState?.[panelItem?.bindTo] !== true
                  ? drawerState?.[panelItem?.bindTo]
                  : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem?.bindTo}_${
                      drawerState?.jsonPath || drawerState?.id
                    }`,
                Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                value
              );
              setDrawerState((prev) => ({
                ...prev,
                [panelItem?.bindTo]:
                  drawerState?.[panelItem?.bindTo] && drawerState?.[panelItem?.bindTo] !== true
                    ? drawerState?.[panelItem?.bindTo]
                    : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${panelItem?.bindTo}_${
                        drawerState?.jsonPath || drawerState?.id
                      }`,
              }));
              return;
            } else {
              setDrawerState((prev) => ({
                ...prev,
                [panelItem?.bindTo]: value,
              }));
              return;
            }
          }}
          populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
          disabled={disableFieldForMandatory(drawerState, panelItem, resourceData)}
          // charCount={field?.charCount}
        />
      );
    case "fieldTypeDropdown":
      return (
        <FieldV1
          config={{
            step: "",
          }}
          label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
          onChange={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              type: value?.fieldType,
              appType: value?.type,
            }));
          }}
          placeholder={t(panelItem?.innerLabel) || ""}
          populators={{
            title: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`)),
            fieldPairClassName: "drawer-toggle-conditional-field",
            options: state?.MASTER_DATA?.AppFieldType,
            optionsKey: "type",
          }}
          type={"dropdown"}
          value={state?.MASTER_DATA?.AppFieldType?.find((i) => i.type === drawerState?.appType)}
          disabled={disableFieldForMandatory(drawerState, panelItem, resourceData)}
        />
      );
    // return (
    //   <Dropdown
    //     // style={}
    //     variant={""}
    //     t={t}
    //     option={state?.MASTER_DATA?.AppFieldType}
    //     optionKey={"type"}
    //     disabled={disableFieldForMandatory(drawerState, panelItem, resourceData)} // todo need to think about it @nabeel & @jagan
    //     selected={state?.MASTER_DATA?.AppFieldType?.find((i) => i.type === drawerState?.appType)}
    //     select={(value) => {
    //       setDrawerState((prev) => ({
    //         ...prev,
    //         type: value?.fieldType,
    //         appType: value?.type,
    //       }));
    //     }}
    //   />
    // );
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
  const [tabs, setTabs] = useState(() =>
    Array.from(
      new Map((state?.MASTER_DATA?.DrawerPanelConfig || []).sort((a, b) => a.tabOrder - b.tabOrder).map((item) => [item.tab, item.tabOrder])).keys()
    ).map((tab, index) => ({
      parent: tab,
      active: index === 0,
    }))
  );

  const currentDrawerState = useMemo(() => {
    const activeTab = tabs?.find((j) => j.active === true)?.parent;
    return state?.MASTER_DATA?.DrawerPanelConfig?.filter((i) => i.tab === activeTab).sort((a, b) => a.order - b.order);
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
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_PROPERTIES")}</div>
        <span className="icon-wrapper">
          <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_PROPERTIES")} />
        </span>
      </div>
      <Divider />
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
      <TextBlock
        body=""
        caption={t(Digit.Utils.locale.getTransformedLocale(`CMP_DRAWER_WHAT_IS_${t(currentDrawerState?.[0]?.tab)}`))}
        header=""
        captionClassName="camp-drawer-caption"
        subHeader=""
      />
      {drawerState?.hidden && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Tag showIcon={true} label={t("CMP_DRAWER_FIELD_DIABLED_SINCE_HIDDEN")} type="warning" />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {currentDrawerState?.map((panelItem, index) => {
          if (isFieldVisible(panelItem)) {
            return (
              <div className="drawer-toggle-field-container">
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
            <Tag
              showIcon={true}
              label={t(Digit.Utils.locale.getTransformedLocale(`CMP_DRAWER_NO_CONFIG_ERROR_${t(currentDrawerState?.[0]?.tab)}`))}
              type="error"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(DrawerFieldComposer);
