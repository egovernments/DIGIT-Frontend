import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleShowAddFieldPopup, initializeConfig, addField } from "./redux/remoteConfigSlice";
import { getFieldMaster } from "./redux/fieldMasterSlice";
import { getFieldPanelMaster } from "./redux/fieldPanelPropertiesSlice";
import { fetchLocalization, fetchAppScreenConfig, setLocalizationData, updateLocalizationEntry } from "./redux/localizationSlice";
import { Header } from "@egovernments/digit-ui-react-components";
import { Button, Dropdown, LabelFieldPair, Loader, PopUp, Tag, TextBlock, TextInput, Toast } from "@egovernments/digit-ui-components";
import IntermediateWrapper from "./IntermediateWrapper";
import { useFieldDataLabel } from "./hooks/useCustomT";
import fullParentConfig from "./configs/fullParentConfig.json";
import { getPageFromConfig } from "./utils/configUtils";

const AppConfigurationWrapper = ({ flow = "REGISTRATION-DELIVERY", flowName, pageName = "beneficiaryLocation", campaignNumber }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH");
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const dispatch = useDispatch();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  // Generate unique localeModule based on flow, pageName, and campaignNumber
  // Format: hcm-{flow}-{pageName}-{campaignNumber}
  const localeModule = `hcm-${flow?.toLowerCase()?.replace(/_/g, "")}-${campaignNumber}`;
  const [newFieldType, setNewFieldType] = useState(null);
  const [isLoadingPageConfig, setIsLoadingPageConfig] = useState(true);
  const [pageConfigError, setPageConfigError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(null);

  // Redux selectors
  const { currentData, showAddFieldPopup, responseData } = useSelector((state) => state.remoteConfig);
  const { status: localizationStatus, data: localizationData } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);

  console.log("localizationData:", localizationData);
  // Call hook at top level - always called, never conditionally
  const fieldDataLabel = useFieldDataLabel(newFieldType?.label);

  // Handle MDMS update when next button is clicked
  const handleUpdateMDMS = async () => {
    if (!responseData || !currentData) {
      console.error("Missing responseData or currentData for MDMS update");
      return;
    }

    try {
      setIsUpdating(true);

      // Prepare the payload - use responseData structure but replace data with currentData
      const updatePayload = {
        Mdms: {
          id: responseData.id,
          tenantId: responseData.tenantId,
          schemaCode: responseData.schemaCode,
          uniqueIdentifier: responseData.uniqueIdentifier,
          data: currentData, // Replace with updated config
          isActive: responseData.isActive,
          auditDetails: responseData.auditDetails,
        },
      };

      // Make the update call
      const response = await Digit.CustomService.getResponse({
        url: `/mdms-v2/v2/_update/${MODULE_CONSTANTS}.AppConfigCache`,
        body: updatePayload,
      });

      if (response) {
        // Show success message
        setShowToast({ key: "success", label: "CONFIGURATION_UPDATED_SUCCESSFULLY" });
      }
    } catch (error) {
      console.error("Error updating MDMS:", error);
      setShowToast({ key: "error", label: "CONFIGURATION_UPDATE_FAILED" });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle adding new field
  const handleAddNewField = () => {
    if (!newFieldType?.label || !newFieldType?.field) {
      return; // Validation: ensure required fields are present
    }

    // Create the new field object based on the selected field type - using fixed key 'fieldTypeMappingConfig'
    const selectedFieldType = fieldTypeMaster?.fieldTypeMappingConfig?.find((field) => field.type === newFieldType.field.type);

    const newFieldData = {
      type: newFieldType.field.type,
      format: newFieldType.field.format,
      label: newFieldType.label, // This should be the localization code
      required: false,
      active: true,
      order: (currentData?.body?.[0]?.fields?.length || 0) + 1,
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
    const fetchPageConfig = async () => {
      try {
        setIsLoadingPageConfig(true);
        setPageConfigError(null);

        // Clean up page name - if it contains a dot, take only the part after the dot
        // e.g., "HOUSEHOLD.beneficiaryLocation" -> "beneficiaryLocation"
        const cleanedPageName = pageName?.includes(".") ? pageName.split(".").pop() : pageName;

        // Fetch page configuration from MDMS
        const response = await Digit.CustomService.getResponse({
          url: "/mdms-v2/v2/_search",
          body: {
            MdmsCriteria: {
              tenantId: tenantId,
              schemaCode: `${MODULE_CONSTANTS}.NewFormConfig`,
              filters: {
                flow: flow,
                project: campaignNumber,
                page: cleanedPageName,
              },
              isActive: true,
            },
          },
        });

        if (response?.mdms && response.mdms.length > 0) {
          const pageConfig = response.mdms[0].data;
          const responseData = response.mdms[0]; // Store full MDMS response for updates
          // Initialize config with the fetched data
          dispatch(initializeConfig({ pageConfig, responseData }));
        } else {
          setPageConfigError("No page configuration found");
          console.error("No page configuration found for:", { flow, pageName, campaignNumber });
        }
      } catch (err) {
        console.error("Error fetching page config:", err);
        setPageConfigError("Failed to fetch page configuration");
      } finally {
        setIsLoadingPageConfig(false);
      }
    };

    if (flow && pageName && campaignNumber) {
      fetchPageConfig();
    }

    // Fetch field master if specified
    dispatch(
      getFieldMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "NewFieldType",
        mdmsContext: mdmsContext,
        limit: 10000,
      })
    );

    // Fetch field panel master
    dispatch(
      getFieldPanelMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "NewDrawerPanelConfig",
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
          currentLocale,
        })
      );

      dispatch(fetchAppScreenConfig({ tenantId }));

      // Set localization context data
      dispatch(
        setLocalizationData({
          localisationData: localizationData,
          currentLocale,
          localeModule,
        })
      );
    }
  }, [dispatch, flow, pageName, campaignNumber, localeModule, tenantId, mdmsContext, currentLocale]);

  // Auto-close toast after 10 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isLoadingPageConfig || !currentData || (localeModule && localizationStatus === "loading")) {
    return <Loader />;
  }

  if (pageConfigError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column" }}>
        <h3 style={{ color: "#d32f2f" }}>Error Loading Configuration</h3>
        <p>{pageConfigError}</p>
      </div>
    );
  }

  const handleFieldChange = (value) => {
    // Generate unique localization code: campaignNumber_flow_pageName_uuid
    const locVal = newFieldType?.label ? newFieldType?.label : `${campaignNumber}_${flow}_${pageName}_${crypto.randomUUID()}`.toUpperCase();

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
    <React.Fragment>
      <IntermediateWrapper onNext={handleUpdateMDMS} isUpdating={isUpdating} />
      {showAddFieldPopup && (
        <PopUp
          className={"add-field-popup"}
          type={"default"}
          heading={t("ADD_FIELD")}
          onOverlayClick={() => {}}
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
                option={fieldTypeMaster?.fieldTypeMappingConfig}
                optionKey="type"
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
      {showToast && (
        <Toast type={showToast?.key === "error" ? "error" : "success"} label={t(showToast?.label)} onClose={() => setShowToast(null)} />
      )}
    </React.Fragment>
  );
};

export default AppConfigurationWrapper;
