import React, { useState, useEffect } from "react";
import { Card, CardText, TextInput, SelectionTag, Dropdown, CardHeader, Button, FieldV1, Loader, CheckBox, Stepper, Divider, BoundaryFilter } from "@egovernments/digit-ui-components";
import { DynamicImageComponent } from "./DynamicImageComponent";
import { CardSectionHeader, CardSectionSubText } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import MobileBezelFrame from "./MobileBezelFrame";
// import GenericTemplateScreen from "./GenericTemplateScreen";
// import DynamicSVG from "./DynamicSVGComponent";
// import RenderSelectionField from "./RenderSelectionField";
// import { useCustomT } from "../pages/employee/formBuilder/useCustomT";

const MdmsDropdown = ({
  t,
  moduleMaster,
  optionKey = "code",
  moduleName,
  masterName,
  className,
  style = {},
  variant = "",
  selected,
  select = () => { },
  rest,
}) => {
  if (!moduleName || !masterName) return null;
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    moduleName,
    [{ name: masterName }],
    {
      enabled: moduleName && masterName,
      select: (data) => {
        return data?.[moduleName]?.[masterName]?.filter((item) => item.active);
      },
    },
    { schemaCode: "MDMSDROPDOWNLIST" } //mdmsv2
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <Dropdown
      className={className}
      style={style}
      variant={variant}
      t={t}
      option={data}
      optionKey={optionKey}
      selected={selected}
      select={() => select()}
    />
  );
};

const renderField = (field, t) => {
  const MapWithInput = Digit.ComponentRegistryService.getComponent("MapWithInput")
  switch (field.type) {
    case "text":
    case "textInput":
      return <TextInput name="name" value={field?.name || ""} onChange={() => { }} disabled={true} />;
    case "number":
      return <TextInput type="number" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => { }} />;
    case "textarea":
      return <TextInput type="textarea" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => { }} />;
    case "time":
      return <TextInput type="time" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => { }} />;
    case "mobileNumber":
      return (
        <TextInput
          type="text"
          className="appConfigLabelField-Input"
          name={""}
          value={field?.value}
          onChange={(event) => onChange(event)}
          populators={{ prefix: rest?.countryPrefix }}
        />
      );
    case "numeric":
    case "counter":
      return <TextInput name="numeric" onChange={() => { }} type={"numeric"} />;
    case "dropdown":
      return (
        <Dropdown
          option={field?.dropDownOptions || []}
          optionKey={"name"}
          selected={[]}
          select={() => { }}
          t={t}
        />
      );
    case "boundary":
      return (
        <BoundaryFilter
          levelConfig={field?.populators?.levelConfig || { lowestLevel: "LOCALITY", highestLevel: "LOCALITY", isSingleSelect: ["LOCALITY"] }}
          hierarchyType={field?.populators?.hierarchyType || "NEWTEST00222"}
          module={field?.populators?.module}
          layoutConfig={{
            isLabelNotNeeded: field?.populators?.layoutConfig?.isLabelNotNeeded || false,
            isDropdownLayoutHorizontal: false,
            isLabelFieldLayoutHorizontal: false
          }}
          preSelected={field?.populators?.preSelected}
          frozenData={field?.populators?.frozenData}
          onChange={() => { }}
        />
      );
    case "mapcoord":
    case "MapWithInput":
      if (!MapWithInput) {
        // Fallback if component is not registered yet
        return <TextInput name="mapcoord" value="" onChange={() => { }} disabled={true} placeholder="Map Location" />;
      }
      return (
        <MapWithInput
          name="mapcoord"
          value={field?.value || ""}
          onChange={() => { }}
          disabled={true}
        />
      );
    case "hierarchyDropdown":
      const HierarchyDropdown = Digit.ComponentRegistryService.getComponent("HierarchyDropdown");
      if (!HierarchyDropdown) {
        // Fallback if component is not registered yet
        return <Dropdown option={[]} optionKey="name" selected={null} select={() => {}} t={t} placeholder="Boundary Hierarchy" />;
      }
      // Create a unique key based on hierarchy config to force re-mount when config changes
      const hierarchyKey = `${field?.populators?.hierarchyType}-${field?.populators?.highestHierarchy}-${field?.populators?.lowestHierarchy}`;
      return (
        <HierarchyDropdown
          key={hierarchyKey}
          hierarchyType={field?.populators?.hierarchyType || ""}
          highestHierarchy={field?.populators?.highestHierarchy || ""}
          lowestHierarchy={field?.populators?.lowestHierarchy || ""}
          onChange={() => { }}
          preSelected={field?.populators?.preSelected || {}}
          autoSelect={false}
        />
      );
    case "MdmsDropdown":
      return (
        <MdmsDropdown
          className="appConfigLabelField-Input"
          variant={""}
          t={t}
          option={dropDownOptions}
          optionKey={"code"}
          selected={null}
          select={() => { }}
          props={props}
          moduleName={rest?.schemaCode ? rest.schemaCode.split(".")[0] : rest?.moduleMaster?.moduleName}
          masterName={rest?.schemaCode ? rest.schemaCode.split(".")[1] : rest?.moduleMaster?.masterName}
          rest={rest}
        />
      );
    case "date":
    case "dobPicker":
    case "datePicker":
    case "dob":
      return <TextInput type="date" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => { }} />;
    case "button":
      return (
        <Button
          icon={"QrCodeScanner"}
          className="app-preview-field-button"
          variation="secondary"
          label={t(field?.label)}
          title={t(field?.label)}
          onClick={() => { }}
        />
      );
    case "custom":
      return <DynamicImageComponent type={field?.type} appType={field?.appType} />;
    default:
      return <DynamicImageComponent type={field?.type} appType={field?.appType} />;
  }
};

const getFieldType = (field) => {
  // Handle different field types
  if (field.type === "textInput" || field.type === "text") {
    return "text";
  } else if (field.type === "mobileNumber") {
    return "mobileNumber";
  } else if (field.type === "dropdown") {
    return "dropdown";
  } else if (field.type === "number") {
    return "number";
  } else if (field.type === "datePicker" || field.type === "date") {
    return "date";
  } else if (field.type === "checkbox") {
    return "checkbox";
  } else if (field.type === "radio") {
    return "radio";
  } else if (field.type === "textarea") {
    return "textarea";
  } else if (field.type === "fileUpload" || field.type === "documentUpload") {
    return "documentUploadAndDownload";
  } else if (field.type === "documentUploadAndDownload") {
    return "documentUploadAndDownload";
  } else if (field.type === "boundary") {
    return "boundary";
  } else if (field.type === "hierarchyDropdown") {
    return "hierarchyDropdown";
  } else if (field.type === "button") {
    return "button";
  } else if (field.type === "mapcoord" || field.type === "MapWithInput") {
    return "MapWithInput";
  }

  // Default fallback
  return field.type || "text";
};

// Helper function to create document config for document upload fields
const createDocumentConfig = (field) => {
  const action = field?.metaData?.action || "APPLY";
  const module = field?.metaData?.module || "DigitStudio";

  // Ensure allowedFileTypes is an array
  let allowedFileTypes = field?.allowedFileTypes || ["pdf", "doc", "docx", "jpeg", "jpg", "png"];

  if (typeof allowedFileTypes === 'string') {
    // Convert comma-separated string to array
    allowedFileTypes = allowedFileTypes
      .split(',')
      .map(type => type.trim())
      .filter(type => type.length > 0);
  } else if (!Array.isArray(allowedFileTypes)) {
    allowedFileTypes = ["pdf", "doc", "docx", "jpeg", "jpg", "png"];
  }

  // Determine if this is a download-enabled field
  const isDownloadEnabled = field?.type === "documentUploadAndDownload";

  // Return the exact structure that UploadAndDownloadDocumentHandler expects
  return [
    {
      module: module,
      actions: [
        {
          action: action,
          assignee: {
            show: true,
            isMandatory: false
          },
          comments: {
            show: true,
            isMandatory: false
          },
          documents: [
            {
              code: field?.label || "DOCUMENT",
              name: field?.label || "document",
              active: true,
              hintText: field?.metaData?.hintText || "",
              isMandatory: field?.required || false,
              maxSizeInMB: field?.maxFileSize || 5,
              showHintBelow: field?.showHintBelow || false,
              showTextInput: field?.showTextInput || false,
              // Set default templatePDFKey for download-enabled fields
              templatePDFKey: isDownloadEnabled
                ? (field?.templatePDFKey || " ")
                : null,
              maxFilesAllowed: field?.maxFiles || 1,
              allowedFileTypes: allowedFileTypes, // Use the processed array
              templateDownloadURL: field?.templateDownloadURL || null,
              documentType: field?.documentType || "Document"
            }
          ]
        }
      ],
      bannerLabel: field?.metaData?.bannerLabel || "Upload Documents",
      maxSizeInMB: field?.metaData?.maxFileSize || 5,
      allowedFileTypes: allowedFileTypes // Use the processed array here too
    }
  ];
};

const AppPreview = ({ data = {}, selectedField, onSectionChange, selectedSection = 0 }) => {
  const [currentStep, setCurrentStep] = useState(selectedSection);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const cards = data.cards || [];
  const totalSteps = cards.length;
  const { t } = useTranslation();

  // Sync currentStep with selectedSection prop
  useEffect(() => {
    setCurrentStep(selectedSection);
  }, [selectedSection]);


  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (onSectionChange) onSectionChange(newStep);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onSectionChange) onSectionChange(newStep);
    }
  };

  // Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

  if (!cards.length) return <div style={{ padding: 32, textAlign: 'center' }}>No sections to preview.</div>;

  const card = cards[currentStep];

  return (
    <React.Fragment>
      <div style={{ margin: '32px auto', background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32 }}>
        {cards.length > 1 && (
        <Stepper
          currentStep={currentStep + 1}
          totalSteps={cards.length}
          // NEW CODE - Uses actual heading value from data
customSteps={cards.reduce((acc, c, idx) => {
  // Use actual heading value from headerFields, fallback to defaults
  const headingValue = c?.headerFields?.find(h => h.label === 'SCREEN_HEADING')?.value;
  if (headingValue) {
    acc[idx] = headingValue;
  } else if (c?.sectionType === "applicant") {
    acc[idx] = "Applicant Details"; // Default fallback for applicant sections
  } else {
    acc[idx] = `Section ${idx + 1}`;
  }
  return acc;
}, {})}
          onStepClick={(idx) => {
            setCurrentStep(idx);
            if (onSectionChange) onSectionChange(idx);
          }}
          style={{ marginBottom: 32 }}
        />)}
        <div>
          {card?.headerFields?.map((headerField, headerIndex) => (
            <div key={headerIndex} style={{ marginBottom: headerField.jsonPath === 'ScreenHeading' ? 8 : 16 }}>
              {headerField.jsonPath === "ScreenHeading" ? (
                <CardSectionHeader>
                  {headerField.value}
                </CardSectionHeader>
              ) : (
                <CardSectionSubText>{headerField.value}</CardSectionSubText>
              )}
            </div>
          ))}
          <div style={{marginLeft: "-0.8rem"}}>
          {data.type !== "template" &&
            card?.fields
              ?.filter((field) => {
                // Always show Name and Mobile Number in applicant section regardless of hidden/active/deleteFlag
                const isApplicantMandatory = card?.sectionType === "applicant" &&
                  (field.label === "Name" || field.label === "Mobile Number" ||
                   field.jsonPath === "ApplicantName" || field.jsonPath === "ApplicantMobile");

                if (isApplicantMandatory) {
                  return true; // Always show these fields in applicant section
                }

                const isApplicantOptionalField = card?.sectionType === "applicant" &&
                  (field.label === "Email" || field.label === "Gender" ||
                   field.jsonPath === "ApplicantEmail" || field.jsonPath === "ApplicantGender");

                if (isApplicantOptionalField) {
                  return field.hidden !== true;
                }

                if (field.type === "hierarchyDropdown" || field.appType === "hierarchyDropdown") {
                  if (!field.populators?.hierarchyType || field.populators.hierarchyType === "") {
                    return false;
                  }
                }

                if (field.hidden === true && field.deleteFlag !== true) {
                  return false; // Hide this field from preview
                }

                return field.active !== false;
              })
              ?.map((field, fieldIndex) => {
                const fieldType = getFieldType(field);

                // Handle checkbox fields separately for consistent styling
                if (fieldType === "checkbox") {
                  return (
                    <div
                      className={`app-preview-field-pair ${selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
                          ? `app-preview-selected`
                          : selectedField?.id && selectedField?.id === field?.id
                            ? `app-preview-selected`
                            : ``
                        }`}
                      key={fieldIndex}
                    >
                      <CheckBox
                        mainClassName={"app-config-checkbox-main"}
                        labelClassName={`app-config-checkbox-label ${field?.["toArray.required"] ? "required" : ""}`}
                        onChange={(e) => { }}
                        value={""}
                        label={field.label}
                        isLabelFirst={false}
                        disabled={field?.readOnly || false}
                      />
                    </div>
                  );
                }

                // Use FieldV1 for ALL field types including document upload fields
                return (
                  <FieldV1
                    key={fieldIndex}
                    charCount={field?.charCount}
                    config={{
                      step: "",
                    }}
                    description={field?.isMdms ? t(field?.helpText) : field?.helpText || null}
                    error={field?.isMdms ? t(field?.errorMessage) : field?.errorMessage || null}
                    infoMessage={field?.isMdms ? t(field?.tooltip) : field?.tooltip || null}
                    label={
                      fieldType === "button" || fieldType === "documentUpload" || fieldType === "documentUploadAndDownload"
                        ? null
                        : field?.isMdms
                          ? (field?.required ? `${t(field?.label)}` : t(field?.label))
                          : (field?.required ? `${toSentenceCase(field.label)}` : toSentenceCase(field.label))
                    }
                    onChange={function noRefCheck() { }}
                    placeholder={t(field?.innerLabel) || ""}
                    populators={{
                      t: field?.isMdms ? null : t,
                      title: field?.label,
                      fieldPairClassName: `app-preview-field-pair ${selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
                          ? `app-preview-selected`
                          : selectedField?.id && selectedField?.id === field?.id
                            ? `app-preview-selected`
                            : ``
                        }`,
                      mdmsConfig: field?.isMdms
                        ? {
                          moduleName: field?.schemaCode?.split(".")[0],
                          masterName: field?.schemaCode?.split(".")[1],
                        }
                        : null,
                      options: field?.isMdms ? null : field?.dropDownOptions,
                      optionsKey: field?.isMdms ? "code" : "name",
                      component: getFieldType(field) === "button" || getFieldType(field) === "select" || getFieldType(field) === "MapWithInput" || getFieldType(field) === "hierarchyDropdown" ? renderField(field, t) : null,
                      prefix: field?.isdCodePrefix || field?.countryPrefix || (field?.jsonPath === "ApplicantMobile" ? window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobilePrefix || "+91" : ""), // Use field's prefix configuration
                      previewConfig: createDocumentConfig(field),
                      levelConfig: field?.populators?.levelConfig || { lowestLevel: "LOCALITY", highestLevel: "LOCALITY", isSingleSelect: ["LOCALITY"] },
                      hierarchyType: field?.populators?.hierarchyType || "NEWTEST00222",
                      module: field?.populators?.module,
                      layoutConfig: {
                        isLabelNotNeeded: field?.populators?.layoutConfig?.isLabelNotNeeded || false,
                        isDropdownLayoutHorizontal: false,
                        isLabelFieldLayoutHorizontal: false
                      },
                      // Pass validation for character count display
                      validation: field?.charCount ? {
                        maxlength: field?.maxLength ? Number(field.maxLength) : 0,
                        minlength: field?.minLength ? Number(field.minLength) : 0
                      } : null
                      //hideSpan:true,
                    }}
                    fieldStyle={fieldType === "documentUpload" || fieldType === "documentUploadAndDownload" ? { width: "100%", display: "flex" } : {}}
                    required={fieldType === "documentUpload" || fieldType === "documentUploadAndDownload" || fieldType === "MapWithInput" ? false : (field?.required || false)}
                    type={fieldType === "button" || fieldType === "hierarchyDropdown" ? "custom" : (fieldType === "MapWithInput" ? "custom" : fieldType) || "text"}
                    value={field?.value === true ? "" : field?.value || ""}
                    disabled={field?.readOnly || false}
                  />
                );
              })}
              </div>
          {/* {data.type !== "template" && (
          <Button
            className="app-preview-action-button"
            variation="primary"
            label={data?.actionLabel}
            title={data?.actionLabel}
            onClick={() => {}}
            style={{ marginTop: 24, width: '100%' }}
          />
        )} */}
        </div>
      </div>
      {/* Section Navigation - Outside Preview */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        marginTop: '2rem',
        padding: '1.5rem 0'
      }}>
        <Button
          variation="secondary"
          icon="ArrowBack"
          // label={currentStep > 0 ?
          //   (cards[currentStep - 1]?.sectionType === "applicant" ? "Applicant Details" :
          //     cards[currentStep - 1]?.headerFields?.find(h => h.label === 'SCREEN_HEADING')?.value || `Section ${currentStep}`)
          //   : "Previous"}
          onClick={handleBack}
          isDisabled={currentStep === 0}
          style={{
            borderRadius: '6px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            minWidth: '120px'
          }}
        />

        <span className="typography heading-s">
  {cards[currentStep]?.headerFields?.find(h => h.label === 'SCREEN_HEADING')?.value || 
    (cards[currentStep]?.sectionType === "applicant" ? "Applicant Details" : `Section ${currentStep + 1}`)}
</span>

        <Button
          variation="secondary"
          icon="ArrowForward"
          // label={currentStep < totalSteps - 1 ?
          //   (cards[currentStep + 1]?.sectionType === "applicant" ? "Applicant Details" :
          //     cards[currentStep + 1]?.headerFields?.find(h => h.label === 'SCREEN_HEADING')?.value || `Section ${currentStep + 2}`)
          //   : t("FORM_NEXT")}
          onClick={handleNext}
          isDisabled={currentStep === totalSteps - 1}
          style={{
            borderRadius: '6px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            minWidth: '120px'
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default AppPreview;
