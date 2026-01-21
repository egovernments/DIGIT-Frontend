import { Divider, FieldV1, MultiSelectDropdown, Switch, Tag, TextBlock } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useCustomT } from "./useCustomT";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import Tabs from "./Tabs";
import { RenderConditionalField } from "./RenderConditionalField";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { getTypeAndFormatFromAppType } from "../../../utils/appConfigHelpers";
import { TEMPLATE_BASE_CONFIG_MASTER } from "../../../Module";
import TooltipPortal from "./TooltipPortal";
import mdmsUtils from "../../../utils/index";

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
  const shouldDisable = resourceData?.[TEMPLATE_BASE_CONFIG_MASTER]?.some((ele) => drawerState?.jsonPath === ele);

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

function getRequiredFieldNames(data, projectType, flowName, screenName) {
  const result = [];

  if (data)
    for (const flow of data) {
      if (flow.project !== projectType || flow.name !== flowName) continue;
      const page = flow.pages.find((p) => p.page === screenName);
      if (!page) continue;

      for (const prop of page.properties) {
        if (Array.isArray(prop.validations)) {
          const hasRequired = Array.isArray(prop?.validations) && prop?.validations?.some((v) => v?.type === "required" && v?.value === true);
          if (hasRequired) {
            result.push(prop.fieldName);
          }
        }
      }
    }

  return result;
}
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

// Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const RenderField = ({ state, panelItem, drawerState, setDrawerState, updateLocalization, AppScreenLocalisationConfig, currentCard }) => {
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
      mdmsUtils.getMDMSV1Criteria(
        tenantId,
        CONSOLE_MDMS_MODULENAME,
        [
          {
            name: TEMPLATE_BASE_CONFIG_MASTER,
            // filter: getBaseTemplateFilter(projectType, flowName, state?.currentScreen?.name),
          },
        ],
        `MDMSDATA-${projectType}-${flowName}-${state?.currentScreen?.name}`,
        {
          select: (data) => {
            // Select and return the module's data
            const temp = getRequiredFieldNames(
              data?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.[TEMPLATE_BASE_CONFIG_MASTER],
              projectType,
              flowName,
              state?.currentScreen?.name
            );

            return { [TEMPLATE_BASE_CONFIG_MASTER]: temp };
            // return data?.MdmsRes?.[CONSOLE_MDMS_MODULENAME];
          },
        }
      ),
    [projectType, flowName]
  );

  const { data: resourceData } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  // Check if this is applicant section by looking for Name or Mobile Number fields
  const isApplicantSection = currentCard?.fields?.some(field => {
    const fieldLabel = field?.label?.toLowerCase() || '';
    return (
      field.jsonPath === "ApplicantName" ||
      field.jsonPath === "ApplicantMobile" ||
      field.jsonPath === "ApplicantMobileNumber" ||
      fieldLabel === 'name' ||
      fieldLabel === 'mobile number' ||
      fieldLabel === 'mobilenumber'
    );
  });

  // Check if THIS specific field is Name or Mobile Number (mandatory fields - label disabled)
  const currentFieldLabel = drawerState?.label?.toLowerCase() || '';
  const isNameOrMobileField = (
    drawerState?.jsonPath === "ApplicantName" ||
    drawerState?.jsonPath === "ApplicantMobileNumber" ||
    drawerState?.jsonPath === "ApplicantMobile" ||
    currentFieldLabel === 'name' ||
    currentFieldLabel === 'mobile number' ||
    currentFieldLabel === 'mobilenumber'
  );

  // Check if THIS specific field is Email or Gender (default fields - label disabled but not mandatory)
  const isEmailOrGenderField = (
    drawerState?.jsonPath === "ApplicantEmail" ||
    drawerState?.jsonPath === "ApplicantGender" ||
    currentFieldLabel === 'email' ||
    currentFieldLabel === 'gender'
  );

  const isApplicantMandatoryField = isApplicantSection && isNameOrMobileField;
  const isApplicantDefaultField = isApplicantSection && (isNameOrMobileField || isEmailOrGenderField);

  // Check if this is the default Gender field in applicant section (isMdms should be disabled)
  const isApplicantDefaultGenderField = isApplicantSection && (
    drawerState?.jsonPath === "ApplicantGender"
  );

  // Check if this field should be disabled for applicant default fields
  // For Name and Mobile: disable label, fieldType, required, mandatory
  // For Email and Gender: disable only label and fieldType
  const shouldDisableForApplicantMandatory = (
    // Disable label and fieldType for all applicant default fields (Name, Mobile, Email, Gender)
    (isApplicantDefaultField && (
      panelItem?.label === "label" ||
      panelItem?.label === "fieldType" ||
      panelItem?.bindTo === "label" ||
      panelItem?.bindTo === "type"
    )) ||
    // Disable required/mandatory only for Name and Mobile (mandatory fields)
    (isApplicantMandatoryField && (
      panelItem?.label === "required" ||
      panelItem?.label === "mandatory" ||
      panelItem?.bindTo === "required" ||
      panelItem?.bindTo === "mandatory"
    ))
  );

  // Check if this is an address section default field (Pincode, Street Name, Location, Map)
  const isAddressDefaultField = (
    drawerState?.jsonPath === "AddressPincode" ||
    drawerState?.jsonPath === "AddressStreet" ||
    drawerState?.jsonPath === "AddressLocation" ||
    drawerState?.jsonPath === "AddressMapCoord"
  );

  // Check if this is a hierarchyDropdown or mapcoord field (label should be editable for these)
  const isHierarchyOrMapField = (
    drawerState?.jsonPath === "AddressLocation" ||
    drawerState?.jsonPath === "AddressMapCoord" ||
    drawerState?.appType === "hierarchyDropdown" ||
    drawerState?.appType === "mapcoord" ||
    drawerState?.type === "hierarchyDropdown" ||
    drawerState?.type === "mapcoord"
  );

  // Disable label and fieldType for address default fields
  // Exception: label is editable for hierarchyDropdown and mapcoord fields
  const shouldDisableForAddressDefault = isAddressDefaultField && (
    (panelItem?.label === "label" && !isHierarchyOrMapField) ||
    (panelItem?.bindTo === "label" && !isHierarchyOrMapField) ||
    panelItem?.label === "fieldType" ||
    panelItem?.bindTo === "type"
  );

  // Ensure required field is always true for applicant mandatory fields
  React.useEffect(() => {
    if (isApplicantMandatoryField && !drawerState?.required && !drawerState?.mandatory) {
      setDrawerState((prev) => ({
        ...prev,
        required: true,
        mandatory: true
      }));
    }
  }, [isApplicantMandatoryField, drawerState?.required, drawerState?.mandatory]);

  switch (panelItem?.fieldType) {
    case "toggle": {
      const switchRef = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      // Disable isMdms toggle for default Gender field in applicant section
      const shouldDisableIsMdmsForGender = isApplicantDefaultGenderField && panelItem?.label === "isMdms";
      const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) || shouldDisableForApplicantMandatory || shouldDisableForAddressDefault || shouldDisableIsMdmsForGender;

      return (
        <div
          ref={switchRef}
          className="drawer-container-tooltip"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
          <Switch
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
            onToggle={(value) => {
              const fieldName = panelItem?.bindTo ? panelItem?.bindTo : panelItem?.label;
              setDrawerState((prev) => {
                const updatedState = {
                  ...prev,
                  [fieldName]: value,
                };

                // Clear minLength and maxLength when charCount is toggled off
                if (fieldName === 'charCount' && !value) {
                  updatedState.minLength = '';
                  updatedState.maxLength = '';
                }

                return updatedState;
              });
            }}
            isCheckedInitially={drawerState?.[panelItem?.bindTo ? panelItem?.bindTo : panelItem?.label] ? true : false}
            disable={isDisabled}
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
                  disabled={drawerState?.hidden || shouldDisableIsMdmsForGender}
                />
              ))
            : null}
        </div>
      );
    }
    case "text": {
  const switchRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) || shouldDisableForApplicantMandatory || shouldDisableForAddressDefault;
  const defaultIsdPrefix = panelItem?.label === "isdCodePrefix" ? "+91" : "";

  // Get info message dynamically from locale keys
  const fieldLabel = panelItem?.label || panelItem?.bindTo || "";

  // Get the raw value
  const rawValue = drawerState?.[panelItem?.bindTo]
    ? drawerState?.[panelItem?.bindTo]
    : defaultIsdPrefix;

  // Apply sentence case only for "label" field
  const displayValue = panelItem?.bindTo === "label" ? toSentenceCase(rawValue) : rawValue;

  return (
    <div
      ref={switchRef}
      className="drawer-container-tooltip"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
      <FieldV1
        type={panelItem?.fieldType}
        label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
        value={displayValue}
        config={{
          step: "",
        }}
        onChange={(event) => {
          let value = event.target.value;
          
          // Apply sentence case transformation for label field
          if (panelItem?.bindTo === "label") {
            value = toSentenceCase(value);
          }
          
          setDrawerState((prev) => ({
            ...prev,
            [panelItem?.bindTo]: value,
          }));
          return;
        }}
        populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
        disabled={isDisabled}
        infoMessage={t("INFO_"+fieldLabel.toUpperCase())}
      />
    </div>
  );
}
    case "fieldTypeDropdown": {
      const switchRef = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      const type = getTypeAndFormatFromAppType(drawerState, state?.MASTER_DATA?.AppFieldType)?.type;
      const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) ||
                        type === "template" ||
                        type === "dynamic" ||
                        shouldDisableForApplicantMandatory ||
                        shouldDisableForAddressDefault;

      // Get field label for info message
      const fieldLabel = panelItem?.label || panelItem?.bindTo || "";

      // Get filtered field types based on current card
      const getFilteredFieldTypes = () => {
        const allFieldTypes = (state?.MASTER_DATA?.AppFieldType || [])
          .filter((item) => item?.metadata?.type !== "template" && item?.metadata?.type !== "dynamic")
          ?.sort((a, b) => a?.order - b?.order);

        // Check if current section is a document section
        const isDocumentSection =
          currentCard?.header === "Document Section" ||
          currentCard?.description === "Document Upload and Download" ||
          currentCard?.fields?.some(field =>
            field.jsonPath === "DocumentUpload" ||
            field.type === "documentUpload" ||
            field.type === "documentUploadAndDownload"
          );

        // If it's a document section, show ONLY document upload field types
        if (isDocumentSection) {
          return allFieldTypes.filter(fieldType =>
            fieldType.type === "documentUpload" ||
            fieldType.type === "documentUploadAndDownload"
          );
        }

        // If it's not a document section, filter out document upload, map, and hierarchy dropdown field types
        return allFieldTypes.filter(fieldType =>
          fieldType.type !== "documentUpload" &&
          fieldType.type !== "documentUploadAndDownload" &&
          fieldType.type !== "mapcoord" &&
          fieldType.type !== "hierarchyDropdown"
        );
      };

      return (
        <div
          ref={switchRef}
          className="drawer-container-tooltip"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
          <FieldV1
            config={{
              step: "",
            }}
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
            onChange={(value) => {
              const isIdPopulator = value?.type === "idPopulator";
              setDrawerState((prev) => ({
                ...prev,
                type: value?.fieldType,
                appType: value?.type,
                // Clear content and validation values when field type changes
                label: prev.label, // Keep the label
                helpText: "", // Clear help text
                tooltip: "", // Clear tooltip
                innerLabel: "", // Clear inner label
                defaultValue: "", // Clear default value
                regex: "", // Clear regex
                errorMessage: "", // Clear error message
                charCount: false, // Reset char count
                minLength: "", // Clear min length
                maxLength: "", // Clear max length
                schemaCode: isIdPopulator ? "HCM.ID_TYPE_OPTIONS_POPULATOR" : "", // Clear schema code unless idPopulator
                isMdms: isIdPopulator || false, // Reset MDMS flag
                MdmsDropdown: isIdPopulator || false, // Reset MDMS dropdown flag
                isBoundaryData: false, // Reset boundary data flag
                dropDownOptions: [], // Clear dropdown options
                // Reset all toggle/boolean fields
                required: false,
                readOnly: false,
                showHintBelow: false,
                showTextInput: false,
                isdCodePrefix: "",
                hintText: "",
                templatePDFKey: "",
                templateDownloadURL: "",
                maxFiles: "",
                maxFileSize: "",
                allowedFileTypes: [],
              }));
            }}
            placeholder={t(panelItem?.innerLabel) || ""}
            populators={{
              title: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`)),
              fieldPairClassName: "drawer-toggle-conditional-field",
              options: getFilteredFieldTypes(), // Use the filtered field types here
              optionsKey: "type",
            }}
            type={"dropdown"}
            value={state?.MASTER_DATA?.AppFieldType?.find((i) => i.type === drawerState?.appType)}
            disabled={isDisabled}
            infoMessage={t("INFO_"+fieldLabel.toUpperCase())}
          />
        </div>
      );
    }

    case "DetailsCard":
    case "Table": {
      const switchRef = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) || shouldDisableForApplicantMandatory || shouldDisableForAddressDefault;
      const selectedOptions = drawerState?.[panelItem?.bindTo] || [];

      const nestedOptions =
        (state?.MASTER_DATA?.DetailsConfig || []).map((category) => ({
          code: category.entity,
          name: category.entity,
          options: (category.displayFields || []).map((field) => ({
            ...field,
            code: `${category.entity}.${field.fieldKey}`,
            name: field.fieldKey,
          })),
        })) || [];

      return (
        <>
          <div
            ref={switchRef}
            className="drawer-container-tooltip"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
            <div style={{ display: "flex" }}>
              <label>{t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}</label>
              <span className="mandatory-span">*</span>
            </div>
            <MultiSelectDropdown
              name={panelItem?.label}
              options={nestedOptions}
              optionsKey="name"
              chipsKey="code"
              type="multiselectdropdown"
              variant="nestedmultiselect"
              selectAllLabel={t("SELECT_ALL")}
              clearLabel={t("CLEAR_ALL")}
              config={{ isDropdownWithChip: panelItem?.fieldType === "Table" ? false : true }}
              selected={drawerState?.[panelItem?.bindTo] || []}
              onSelect={(selectedArray) => { }}
              onClose={(selectedArray) => {
                const selected = selectedArray?.map((arr) => arr?.[1]) || [];
                setDrawerState((prev) => ({
                  ...prev,
                  [panelItem?.bindTo]: selected,
                }));
              }}
              disabled={panelItem?.fieldType === "Table" || isDisabled}
              t={t}
            />

            {Array.isArray(selectedOptions) &&
              selectedOptions
                .filter((opt) => opt && typeof opt.code === "string" && opt.code.includes("."))
                .map((option) => {
                  const [entity, fieldKey] = option.code.split(".");

                  return (
                    <div key={option.code} style={{ marginTop: "16px" }}>
                      <FieldV1
                        label={`${t(entity)} - ${t(fieldKey)}`}
                        value={
                          option.code || ""
                        }
                        type="text"
                        placeholder={t("ADD_LABEL_LOCALIZATION")}
                        onChange={(e) => {
                          const val = e.target.value;

                          // Store the value directly in the drawer state
                          setDrawerState((prev) => ({
                            ...prev,
                            [option.code]: val,
                          }));
                        }}
                        populators={{
                          fieldPairClassName: "drawer-toggle-conditional-field",
                        }}
                        disabled={isDisabled}
                      />
                    </div>
                  );
                })}
          </div>
        </>
      );
    }
    case "hierarchyTypeDropdown": {
      const switchRef = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) || shouldDisableForApplicantMandatory || shouldDisableForAddressDefault;
      const tenantId = Digit.ULBService.getCurrentTenantId();

      // Fetch available hierarchy types from boundary service
      const hierarchyTypesReq = {
        url: `/boundary-service/boundary-hierarchy-definition/_search`,
        changeQueryName: `hierarchyTypes_drawer`,
        body: {
          BoundaryTypeHierarchySearchCriteria: {
            tenantId: tenantId,
            limit: 100,
            offset: 0,
          },
        },
        config: {
          enabled: true,
          select: (data) => {
            const hierarchies = data?.BoundaryHierarchy || [];
            return hierarchies.map(h => ({
              code: h.hierarchyType,
              name: h.hierarchyType,
              boundaryHierarchy: h.boundaryHierarchy || []
            }));
          },
        },
      };

      const { isLoading: hierarchyTypesLoading, data: hierarchyTypes } = Digit.Hooks.useCustomAPIHook(hierarchyTypesReq);

      // Get the current selected value from nested path (populators.hierarchyType)
      const getNestedValue = (obj, path) => {
        return path?.split('.')?.reduce((acc, part) => acc?.[part], obj);
      };

      const currentValue = getNestedValue(drawerState, panelItem?.bindTo);
      const selectedOption = hierarchyTypes?.find(h => h.code === currentValue) || null;

      // Store hierarchy types in state and auto-select defaults
      React.useEffect(() => {
        if (hierarchyTypes && hierarchyTypes.length > 0) {
          const currentHierarchyType = drawerState?.populators?.hierarchyType;

          // Auto-select first hierarchy type (0th index) if none is selected
          if (!currentHierarchyType) {
            const firstHierarchy = hierarchyTypes[0];
            const boundaryLevels = firstHierarchy?.boundaryHierarchy?.map(level => ({
              code: level.boundaryType,
              name: level.boundaryType,
            })) || [];

            // Get the lowest level (last item in the array)
            const lowestLevel = boundaryLevels.length > 0 ? boundaryLevels[boundaryLevels.length - 1]?.code : "";

            setDrawerState((prev) => ({
              ...prev,
              _availableHierarchyTypes: hierarchyTypes,
              _selectedHierarchyLevels: boundaryLevels,
              populators: {
                ...prev.populators,
                hierarchyType: firstHierarchy?.code,
                highestHierarchy: lowestLevel, // Set same as lowest level
                lowestHierarchy: lowestLevel, // Auto-select lowest level
              }
            }));
          } else {
            // Hierarchy type already selected, just update boundary levels
            const selectedHierarchy = hierarchyTypes.find(h => h.code === currentHierarchyType);
            const boundaryLevels = selectedHierarchy?.boundaryHierarchy?.map(level => ({
              code: level.boundaryType,
              name: level.boundaryType,
            })) || [];

            setDrawerState((prev) => ({
              ...prev,
              _availableHierarchyTypes: hierarchyTypes,
              _selectedHierarchyLevels: boundaryLevels
            }));
          }
        }
      }, [hierarchyTypes]);

      return (
        <div
          ref={switchRef}
          className="drawer-container-tooltip"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
          <FieldV1
            type="dropdown"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
            value={selectedOption}
            onChange={(value) => {
              // Set nested value (populators.hierarchyType)
              const pathParts = panelItem?.bindTo?.split('.') || [];
              if (pathParts.length === 2) {
                const boundaryLevels = value?.boundaryHierarchy?.map(level => ({
                  code: level.boundaryType,
                  name: level.boundaryType,
                })) || [];

                // Get the lowest level (last item in the array)
                const lowestLevel = boundaryLevels.length > 0 ? boundaryLevels[boundaryLevels.length - 1]?.code : "";

                setDrawerState((prev) => ({
                  ...prev,
                  [pathParts[0]]: {
                    ...prev[pathParts[0]],
                    [pathParts[1]]: value?.code,
                    highestHierarchy: lowestLevel, // Set same as lowest level
                    lowestHierarchy: lowestLevel, // Auto-select lowest level
                  },
                  // Store selected hierarchy's boundary levels for dependent dropdowns
                  _selectedHierarchyLevels: boundaryLevels
                }));
              }
            }}
            populators={{
              fieldPairClassName: "drawer-toggle-conditional-field",
              options: hierarchyTypes || [],
              optionsKey: "name",
            }}
            disabled={isDisabled || hierarchyTypesLoading}
            placeholder={hierarchyTypesLoading ? t("LOADING") : t("SELECT_HIERARCHY_TYPE")}
            infoMessage={t("INFO_HIERARCHY_TYPE")}
          />
        </div>
      );
    }

    case "boundaryLevelDropdown": {
      const switchRef = useRef(null);
      const [showTooltip, setShowTooltip] = useState(false);
      const isDisabled = disableFieldForMandatory(drawerState, panelItem, resourceData) || shouldDisableForApplicantMandatory || shouldDisableForAddressDefault;

      // Get the current selected value from nested path (populators.highestHierarchy or populators.lowestHierarchy)
      const getNestedValue = (obj, path) => {
        return path?.split('.')?.reduce((acc, part) => acc?.[part], obj);
      };

      const currentValue = getNestedValue(drawerState, panelItem?.bindTo);

      // Get boundary levels from the selected hierarchy type (stored in _selectedHierarchyLevels)
      const allBoundaryLevels = drawerState?._selectedHierarchyLevels || [];

      // Determine if this is highest or lowest dropdown
      const isHighestDropdown = panelItem?.label === "highestHierarchy";
      const isLowestDropdown = panelItem?.label === "lowestHierarchy";

      // Get the other dropdown's selected value
      const selectedHighest = drawerState?.populators?.highestHierarchy;
      const selectedLowest = drawerState?.populators?.lowestHierarchy;

      // Find indices of selected values
      const highestIndex = allBoundaryLevels.findIndex(l => l.code === selectedHighest);
      const lowestIndex = allBoundaryLevels.findIndex(l => l.code === selectedLowest);

      // Filter boundary levels based on constraint logic
      let boundaryLevels = allBoundaryLevels;

      if (isHighestDropdown && selectedLowest && lowestIndex !== -1) {
        // Highest dropdown: show only levels at same index or above (lower index) the selected Lowest
        boundaryLevels = allBoundaryLevels.filter((_, index) => index <= lowestIndex);
      } else if (isLowestDropdown && selectedHighest && highestIndex !== -1) {
        // Lowest dropdown: show only levels at same index or below (higher index) the selected Highest
        boundaryLevels = allBoundaryLevels.filter((_, index) => index >= highestIndex);
      }

      const selectedOption = boundaryLevels?.find(l => l.code === currentValue) || null;

      // Check if hierarchy type is selected
      const hierarchyTypeSelected = !!drawerState?.populators?.hierarchyType;

      return (
        <div
          ref={switchRef}
          className="drawer-container-tooltip"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isDisabled && <TooltipPortal text={t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")} targetRef={switchRef} visible={showTooltip} />}
          <FieldV1
            type="dropdown"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
            value={selectedOption}
            onChange={(value) => {
              // Set nested value (populators.highestHierarchy or populators.lowestHierarchy)
              const pathParts = panelItem?.bindTo?.split('.') || [];
              if (pathParts.length === 2) {
                setDrawerState((prev) => ({
                  ...prev,
                  [pathParts[0]]: {
                    ...prev[pathParts[0]],
                    [pathParts[1]]: value?.code,
                  },
                }));
              }
            }}
            populators={{
              fieldPairClassName: "drawer-toggle-conditional-field",
              options: boundaryLevels,
              optionsKey: "name",
            }}
            disabled={isDisabled || !hierarchyTypeSelected}
            placeholder={!hierarchyTypeSelected ? t("SELECT_HIERARCHY_TYPE_FIRST") : t("SELECT_BOUNDARY_LEVEL")}
            infoMessage={t(`INFO_${panelItem?.label?.toUpperCase()}`)}
          />
        </div>
      );
    }

    default:
      return null;
      break;
  }
};

function DrawerFieldComposer({ currentCard }) {
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
    // Filter out internal properties (starting with underscore) before saving to state
    const cleanedState = Object.fromEntries(
      Object.entries(drawerState || {}).filter(([key]) => !key.startsWith('_'))
    );
    dispatch({
      type: "UPDATE_DRAWER_FIELD",
      payload: {
        updatedState: cleanedState,
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
        <div style={{fontWeight: "bold", fontSize: "18px"}}>{t("APPCONFIG_PROPERTIES")}</div>
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
                  currentCard={currentCard}
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
