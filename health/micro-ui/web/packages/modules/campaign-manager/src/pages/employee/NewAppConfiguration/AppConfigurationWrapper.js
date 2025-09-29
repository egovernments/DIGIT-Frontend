import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleShowAddFieldPopup, initializeConfig, addField } from "./redux/remoteConfigSlice";
import { getFieldMaster } from "./redux/fieldMasterSlice";
import { getFieldPanelMaster } from "./redux/fieldPanelPropertiesSlice";
import { fetchLocalization, fetchAppScreenConfig, setLocalizationData, updateLocalizationEntry } from "./redux/localizationSlice";
import { Header } from "@egovernments/digit-ui-react-components";
import { Button, Dropdown, LabelFieldPair, Loader, PopUp, Tag, TextBlock, TextInput } from "@egovernments/digit-ui-components";
import IntermediateWrapper from "./IntermediateWrapper";
import { useFieldDataLabel } from "./hooks/useCustomT";

const AppConfigurationWrapper = ({ flow = "REGISTRATION-DELIVERY", localeModule = "hcm-registrationflow-CMP-2025-09-19-006993" }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const { t } = useTranslation();
  const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH");
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const dispatch = useDispatch();
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  const [newFieldType, setNewFieldType] = useState(null);
  // Redux selectors
  const { remoteData: actualState, currentData, showAddFieldPopup } = useSelector((state) => state.remoteConfig);
  const { status: localizationStatus, data: localizationData } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);

  // Call hook at top level - always called, never conditionally
  const fieldDataLabel = useFieldDataLabel(newFieldType?.label);

  console.log(newFieldType, "showAddFieldPopup", fieldTypeMaster);

  // Handle adding new field
  const handleAddNewField = () => {
    if (!newFieldType?.label || !newFieldType?.field) {
      return; // Validation: ensure required fields are present
    }

    // Create the new field object based on the selected field type
    const selectedFieldType = fieldTypeMaster?.FieldTypeMappingConfig?.find((field) => field.type === newFieldType.field.type);

    const newFieldData = {
      type: newFieldType.field.type,
      format: newFieldType.field.format,
      label: newFieldType.label, // This should be the localization code
      required: false,
      active: true,
      order: (currentData?.cards?.[0]?.fields?.length || 0) + 1,
      jsonPath: `field_${Date.now()}`, // Generate a unique jsonPath
      ...selectedFieldType?.metadata, // Include any metadata from field type
    };

    // Dispatch the addField action - using cardIndex 0 since there's only one card
    dispatch(
      addField({
        cardIndex: 0,
        fieldData: newFieldData,
      })
    );

    // Close the popup and reset state
    dispatch(handleShowAddFieldPopup(null));
    setNewFieldType(null);
  };
  useEffect(() => {
    // Initialize remote config
    dispatch(initializeConfig());

    // Fetch field master if specified
    if (fieldMasterName) {
      dispatch(
        getFieldMaster({
          tenantId,
          moduleName: MODULE_CONSTANTS,
          name: fieldMasterName,
          mdmsContext: mdmsContext,
          limit: 10000,
        })
      );
    }

    // Fetch field panel master
    dispatch(
      getFieldPanelMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "FieldPropertiesPanelConfig",
        mdmsContext: mdmsContext,
        limit: 10000,
      })
    );

    // Fetch localization data if locale module is provided
    if (localeModule) {
      dispatch(
        fetchLocalization({
          tenantId,
          localeModule,
          enabledModules: [currentLocale],
        })
      );

      dispatch(fetchAppScreenConfig({ tenantId }));

      // Set localization context data
      dispatch(
        setLocalizationData({
          localisationData: localizationData,
          currentLocale,
          enabledModules: [currentLocale],
          localeModule,
        })
      );
    }
  }, [dispatch, fieldMasterName, localeModule, tenantId, mdmsContext, currentLocale]);

  if (!currentData || (localeModule && localizationStatus === "loading")) {
    return <Loader />;
  }

  const handleFieldChange = (value) => {
    const locVal = newFieldType?.label
      ? newFieldType?.label
      : `${showAddFieldPopup?.currentCard?.flow}_${showAddFieldPopup?.currentCard?.name}_newField_${Date.now()}`;
    dispatch(
      updateLocalizationEntry({
        code: locVal,
        locale: currentLocale || "en_IN",
        message: value,
      })
    );
    setNewFieldType((prev) => ({
      ...prev,
      label: locVal,
    }));
  };
  return (
    <div>
      <Header className="app-config-header">
        <div className="app-config-header-group" style={{ display: "flex", alignItems: "center" }}>
          {t(`APP_CONFIG_HEADING_LABEL`)}
          <Tag
            stroke={true}
            showIcon={false}
            label={`${t("APPCONFIG_VERSION")} - ${currentData?.version}`}
            style={{ background: "#EFF8FF", height: "fit-content" }}
            className={"version-tag"}
          />
        </div>
      </Header>
      <TextBlock body="" caption={t("CMP_DRAWER_WHAT_IS_APP_CONFIG_SCREEN")} header="" captionClassName="camp-drawer-caption" subHeader="" />
      <div style={{ display: "flex" }}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: "30.5rem",
              gap: "5rem",
            }}
          >
            <IntermediateWrapper />
          </div>
        </div>
      </div>
      {/* {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )} */}
      {console.log("showAddFieldPopup", showAddFieldPopup)}
      {showAddFieldPopup && (
        <PopUp
          className={"add-field-popup"}
          type={"default"}
          heading={t("ADD_FIELD")}
          onClose={() => {
            dispatch(handleShowAddFieldPopup(null));
            setNewFieldType(null);
          }}
          style={{
            height: "auto",
            width: "32rem",
          }}
        >
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <LabelFieldPair>
              <span style={{ fontWeight: "600" }}>
                {t("FIELD_LABEL")} <span style={{ color: "red" }}>*</span>
              </span>
              <TextInput
                name="fieldLabel"
                value={fieldDataLabel}
                placeholder={t("ENTER_FIELD_LABEL")}
                onChange={(event) => handleFieldChange(event.target.value)}
              />
            </LabelFieldPair>

            <LabelFieldPair>
              <span style={{ fontWeight: "600" }}>
                {t("FIELD_TYPE")} <span style={{ color: "red" }}>*</span>
              </span>
              <Dropdown
                option={fieldTypeMaster?.FieldTypeMappingConfig}
                optionKey="type"
                // selected={fieldTypeMaster?.FieldTypeMappingConfig.find((option) => option.type === newFieldType.field)}
                selected={newFieldType?.field || null}
                select={(value) => {
                  // Update the newdata state with the selected value from the dropdown
                  const updatedData = { ...newFieldType, field: value };
                  setNewFieldType(updatedData);
                }}
                placeholder={t("SELECT_FIELD_TYPE")}
              />
            </LabelFieldPair>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Button
                type="button"
                size="medium"
                variation="secondary"
                label={t("CANCEL")}
                onClick={() => {
                  dispatch(handleShowAddFieldPopup(null));
                  setNewFieldType(null);
                }}
              />
              <Button
                type="button"
                size="medium"
                variation="primary"
                label={t("ADD")}
                isDisabled={!newFieldType?.label || !newFieldType?.field}
                onClick={handleAddNewField}
              />
            </div>
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default AppConfigurationWrapper;
