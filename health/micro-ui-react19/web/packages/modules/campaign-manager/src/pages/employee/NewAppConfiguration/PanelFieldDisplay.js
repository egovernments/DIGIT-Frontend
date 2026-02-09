import { Tag, LabelFieldPair, Switch } from "@egovernments/digit-ui-components";
import React, { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { getFieldTypeFromMasterData } from "./helpers";
import { getFieldTypeFromMasterData2 } from "./helpers/getFieldTypeFromMasterData";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

// Component to toggle visibility of a field if it is not mandatory and not marked for deletion
const ToggleVisibilityControl = ({ config, onToggle }) => {
  if (config?.deleteFlag || config?.mandatory) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="appConfigLabelField-toggleVisibility"
    >
      <Switch label="" isCheckedInitially={config?.hidden !== true} />
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
const PanelFieldDisplay = ({ type, label, config, onHide: onToggle, isDelete, onDelete, rest, onSelectField }) => {
  const { t } = useTranslation();
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const componentRef = useRef(null);

  // Check if field has configurable (non-custom) visibility conditions
  const expressions = config?.visibilityCondition?.expression;
  const isDependent = Array.isArray(expressions) && expressions.filter((e) => e.type !== "custom").length > 0;
  const hasToggle = !config?.deleteFlag && !config?.mandatory;

  return (
    <div
      ref={componentRef}
      onClick={(e) => {
        e.stopPropagation();
        if(onSelectField != null)
        {
          onSelectField();
        }
      }}
      className="app-config-field-wrapper"
      style={{}}
    >
      <LabelFieldPair className={`appConfigLabelField`}>
        <div className="appConfigLabelField-label-container" style={hasToggle ? {width:"80%"} : {width:"100%"}}>
          <div className="appConfigLabelField-label">
            <span>{label}</span>
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
            {isDependent && (
              <Tag icon="" label={t(I18N_KEYS.APP_CONFIGURATION.DEPENDENT_FIELD_TAG)} className="app-config-field-tag dependent-field-tag" labelStyle={{}} showIcon={false} style={{}} type={"warning"} stroke={true} />
            )}
            <Tag
              icon=""
              label={t(
                getFieldTypeFromMasterData2(
                  config || { type, format: rest?.format, fieldName: rest?.fieldName },
                  fieldTypeMaster.fieldTypeMappingConfig
                )
              )}
              className={`app-config-field-tag normal`}
              labelStyle={{}}
              showIcon={false}
              style={{}}
            />
          </div>
        </div>

        {/* Control to show/hide the field */}
        <ToggleVisibilityControl config={config} onToggle={onToggle} />

        {/* Control to delete the field */}
        <DeleteFieldControl isDelete={isDelete} onDelete={onDelete} config={config} />
      </LabelFieldPair>
    </div>
  );
};

export default React.memo(PanelFieldDisplay);
