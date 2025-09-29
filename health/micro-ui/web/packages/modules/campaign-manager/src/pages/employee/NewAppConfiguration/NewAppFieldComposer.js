import { Tag, LabelFieldPair, TextInput, AlertCard as InfoCard, TooltipWrapper, TextArea, Switch } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

const getFieldType = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.fieldType || "text";
};
// Component to toggle visibility of a field if it is not mandatory and not marked for deletion
const ToggleVisibilityControl = ({ config, onToggle }) => {
  if (config?.deleteFlag || config?.["toArray.required"]) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="appConfigLabelField-toggleVisibility"
    >
      <Switch label="" isCheckedInitially={config?.hidden === false} />
    </div>
  );
};

// Component to render a delete button (dustbin icon) if deletion is allowed
const DeleteFieldControl = ({ isDelete, onDelete }) => {
  if (!isDelete) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
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
  );
};

// Main component to display a panel field with label, tag, visibility toggle, and delete option
// Used for all non-header field types (no switch needed)
const PanelFieldDisplay = ({ t, label, appType, config, onToggle, isDelete, onDelete }) => {
  return (
    <>
      <div className="appConfigLabelField-label-container">
        <div className="appConfigLabelField-label">
          <span>{label}</span>
        </div>
        <Tag icon="" label={t(appType)} className="app-config-field-tag" labelStyle={{}} showIcon={false} style={{}} />
      </div>

      {/* Control to show/hide the field */}
      <ToggleVisibilityControl config={config} onToggle={onToggle} />

      {/* Control to delete the field */}
      <DeleteFieldControl isDelete={isDelete} onDelete={onDelete} />
    </>
  );
};

// Header field input component - handles text and textarea for header fields only
const HeaderFieldInput = ({ type, t, label, value, onChange, Mandatory, helpText }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onChange(event);
  };

  return (
    <LabelFieldPair className={type === "textarea" ? "appConfigHeaderLabelField desc" : "appConfigHeaderLabelField"}>
      <div className="appConfigLabelField-label-container">
        <div className="appConfigLabelField-label">
          <span>{t(label)}</span>
          {Mandatory && <span className="mandatory-span">*</span>}
          {helpText && (
            <span className="icon-wrapper">
              <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
            </span>
          )}
        </div>
        {type === "textarea" ? (
          <TextArea type="textarea" className="appConfigLabelField-Input" name="" value={inputValue} onChange={handleChange} />
        ) : (
          <TextInput className="appConfigLabelField-Input" name="" value={inputValue} onChange={handleChange} />
        )}
      </div>
    </LabelFieldPair>
  );
};

// Simplified Field component - no switch needed for non-header fields
const Field = ({
  t,
  headerFields,
  type,
  label,
  value,
  isDelete,
  onDelete,
  onHide,
  config,
  onChange,
  selectedField,
  Mandatory,
  helpText,
  infoText,
  rest,
}) => {
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  // Show info card if present
  const InfoCardComponent = infoText ? (
    <InfoCard
      populators={{
        name: "infocard",
      }}
      variant="default"
      text={t(infoText)}
    />
  ) : null;

  // For header fields, use the specialized component
  if (headerFields) {
    return (
      <>
        {InfoCardComponent}
        <HeaderFieldInput type={type} t={t} label={label} value={value} onChange={onChange} Mandatory={Mandatory} helpText={helpText} />
      </>
    );
  }

  // For non-header fields, use the same PanelFieldDisplay for all types
  return (
    <>
      {InfoCardComponent}
      <LabelFieldPair className={`appConfigLabelField`}>
        <PanelFieldDisplay
          t={t}
          label={label}
          appType={getFieldType(rest?.field || { type, format: rest?.format }, fieldTypeMaster.FieldTypeMappingConfig)}
          isDelete={isDelete}
          onDelete={onDelete}
          onToggle={onHide}
          config={config}
        />
      </LabelFieldPair>
    </>
  );
};

function NewAppFieldComposer({
  headerFields = false,
  type,
  label,
  value,
  required,
  isDelete = false,
  onDelete,
  onHide,
  onSelectField = () => {},
  dropDownOptions = [],
  config,
  onChange = () => {},
  Mandatory,
  helpText,
  infoText,
  innerLabel,
  rest,
}) {
  const { t } = useTranslation();
  const { selectedField } = useSelector((state) => state.remoteConfig);
  const componentRef = useRef(null);

  return (
    <div
      ref={componentRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectField();
      }}
      className="app-config-field-wrapper"
      style={{}}
    >
      <Field
        t={t}
        headerFields={headerFields}
        type={type}
        label={label}
        value={value}
        required={required}
        isDelete={isDelete}
        onDelete={onDelete}
        onHide={onHide}
        onSelectField={onSelectField}
        dropDownOptions={dropDownOptions}
        config={config}
        onChange={onChange}
        selectedField={selectedField}
        Mandatory={Mandatory}
        helpText={helpText}
        infoText={infoText}
        innerLabel={innerLabel}
        rest={rest}
      />
    </div>
  );
}

export default React.memo(NewAppFieldComposer);
