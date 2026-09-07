import { CheckBox, FieldV1 } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getAppTypeFromMasterData,
  getFieldTypeFromMasterData,
} from "../pages/employee/NewAppConfiguration/helpers/getFieldTypeFromMasterData";
import { getComponentFromMasterData } from "../pages/employee/NewAppConfiguration/helpers/getComponentFromMasterData";

const ComponentToRender = ({ field, t: customT, selectedField, isSelected }) => {
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { byName: fieldPanelConfig } = useSelector((state) => state.fieldPanelMaster);
  const { t } = useTranslation();
  const fieldRef = useRef(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Get field type mapping from the field master data
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  // Get the field type
  const fieldType = getFieldTypeFromMasterData(field, fieldTypeMasterData);

  // Get component from fieldTypeMasterData, fallback to null
  const component = fieldType === "component" ? getComponentFromMasterData(field, fieldTypeMasterData) : null;

  // Check if this field is selected
  const isFieldSelected =
    (selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath) ||
    (selectedField?.id && selectedField?.id === field?.id) ||
    isSelected;

  // Auto-scroll to the selected field
  useEffect(() => {
    if (isFieldSelected && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isFieldSelected]);

  const shouldCustomTranslate = !field?.isMdms && (fieldType === "dropdown" || fieldType === "radio" || fieldType === "checkbox");

  // Fields that carry their own label (scanner button, checkbox) render a blank label,
  // so hide the label row altogether - otherwise a required field shows an orphan asterisk
  const resolvedLabel =
    field?.showLabel === false || fieldType === "checkbox" || field?.format?.toLowerCase() === "scanner" || field?.format?.toLowerCase() === "qrscanner"
      ? ""
      : shouldCustomTranslate
      ? field?.label
      : customT(field?.label) || "";

  // Parse schemaCode to get moduleName and masterName
  const { moduleName, masterName, isValidSchema } = useMemo(() => {
    if (!field?.isMdms || !field?.schemaCode || typeof field.schemaCode !== 'string') {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    const schemaParts = field.schemaCode.split(".");
    if (schemaParts.length < 2) {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    return {
      moduleName: schemaParts[0]?.trim(),
      masterName: schemaParts[1]?.trim(),
      isValidSchema: true,
    };
  }, [field?.isMdms, field?.schemaCode]);

  // Fetch MDMS data if field has valid MDMS configuration
  const { data: mdmsData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    moduleName,
    [{ name: masterName }],
    {
      enabled: isValidSchema && !!moduleName && !!masterName,
      select: (data) => {
        // Extract the data from the MDMS response
        if (data && moduleName && masterName) {
          return data?.[moduleName]?.[masterName] || [];
        }
        return [];
      },
    },
    {
      schemaCode: isValidSchema ? `${moduleName}.${masterName}` : undefined,
    }
  );

  // Memoize options - use MDMS data if available, otherwise use dropDownOptions
  const options = useMemo(() => {
    if (field?.isMdms && isValidSchema && mdmsData) {
      return mdmsData;
    }
    else if(field?.isMdms && !mdmsData){
      return []
    }
    return field?.dropDownOptions || [];
  }, [field?.isMdms, field?.dropDownOptions, isValidSchema, mdmsData]);

  // Memoize optionsKey - use "code" for MDMS data, "name" for regular dropdowns
  const optionsKey = useMemo(() => {
    return field?.isMdms && isValidSchema ? "code" : "name";
  }, [field?.isMdms, isValidSchema]);

  // Show defaultValue in preview for field types where it's enabled in MDMS panel config.
  // Uses `fieldType` (UI-level type e.g. "numeric") not `field?.type` (raw JSON schema type e.g. "integer")
  // because visibilityEnabledFor in MDMS is configured with UI type names, not raw schema types.
  const previewValue = useMemo(() => {
    const panelContent = fieldPanelConfig?.drawerPanelConfig?.content || [];
    const defaultValueConfig = panelContent.find((item) => item.id === "defaultValue");
    const enabledTypes = defaultValueConfig?.visibilityEnabledFor || [];
    if (enabledTypes.includes(fieldType) && field?.value != null && field?.value !== "" && field?.value !== true) {
      const num = Number(field.value);
      if (!isNaN(num)) return num;
    }
    return "";
  }, [fieldPanelConfig, fieldType, field?.value]);

  // Checkbox preview: render the atom directly with the required asterisk
  // inside the label node so it wraps with the text — FieldV1's checkbox
  // path renders the asterisk as a flex sibling of the label, which floats
  // it to the row's right edge instead of after the last word.
  // NOTE: keep this early return below every hook call.
  if (field?.format === "checkbox" && !component) {
    return (
      <div ref={fieldRef}>
        <div
          className={`digit-label-field-pair digit-formcomposer-fieldpair app-preview-field-pair ${
            isFieldSelected ? "app-preview-selected" : ""
          }`}
        >
          <div className="digit-field">
            {/* CheckBox's label prop is string-only (it runs TOSENTENCECASE on
                it) and renders the required asterisk as a 100%-width flex
                sibling, so we hide it and render our own label with the
                asterisk inline after the text. */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", width: "100%" }}>
              {/* flex: 0 0 auto keeps the checkbox square from claiming the
                  row (its container is 100% wide), leaving the label the rest */}
              <div style={{ flex: "0 0 auto" }}>
                <CheckBox
                  label=""
                  hideLabel
                  checked={false}
                  onChange={() => {}}
                  disabled={field?.readOnly || false}
                  removeMargin
                />
              </div>
              <label className="label" style={{ flex: "1 1 auto", minWidth: 0 }}>
                {customT(field?.label)}
                {field?.required && <span style={{ color: "#B91900" }}> *</span>}
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={fieldRef}>
      <FieldV1
        charCount={field?.charCount}
        component={component}
        config={{
          step: "",
          customProps: {
            field: field,
            t: customT,
            type: field?.type,
            fieldType: getAppTypeFromMasterData(field, fieldTypeMasterData),
          },
        }}
        description={shouldCustomTranslate ? field?.helpText : customT(field?.helpText) || ""}
        // error={shouldCustomTranslate ? field?.errorMessage : customT(field?.errorMessage) || null}
        infoMessage={shouldCustomTranslate ? field?.tooltip : customT(field?.tooltip) || null}
        label={resolvedLabel}
        onChange={function noRefCheck() {}}
        placeholder={shouldCustomTranslate ? field?.innerLabel : customT(field?.innerLabel) || ""}
        populators={{
          title: field?.label,
          prefix: field?.prefixText || null,
          suffix: field?.suffixText || null,
          t: shouldCustomTranslate ? customT : null,
          fieldPairClassName: `app-preview-field-pair ${isFieldSelected ? `app-preview-selected` : ``}`,
          labelStyles: field?.format === "checkbox" ? { width: "fit-content" } : null,
          options: options,
          optionsKey: optionsKey,
          showToolTip: true,
          optionsCustomStyle:{maxHeight:"8vh"},
          showCountryCodeDropdown: field?.showCountryCodeDropdown || false,
          countryCodeConfig: field?.showCountryCodeDropdown
            ? { moduleName: "common-masters", masterName: "CountryCodes", defaultCountryCode: "+91" }
            : null
        }}
        withoutLabel={field?.format === "checkbox" || !resolvedLabel}
        required={field?.required ?? field?.mandatory ?? null}
        type={fieldType}
        value={previewValue}
        disabled={field?.readOnly || false}
        showToolTip={true}
      />
    </div>
  );
};

export default ComponentToRender;
