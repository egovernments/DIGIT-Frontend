import { Tag, LabelFieldPair, Switch } from "@egovernments/digit-ui-components";
import React, { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { getFieldTypeFromMasterData } from "./helpers";

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
      <LabelFieldPair className={`appConfigLabelField`}>
        <div className="appConfigLabelField-label-container">
          <div className="appConfigLabelField-label">
            <span>{label}</span>
          </div>
          <Tag
            icon=""
            label={t(getFieldTypeFromMasterData(config || { type, format: rest?.format, fieldName: rest?.fieldName }, fieldTypeMaster.fieldTypeMappingConfig))}
            className="app-config-field-tag"
            labelStyle={{}}
            showIcon={false}
            style={{}}
          />
        </div>

        {/* Control to show/hide the field */}
        <ToggleVisibilityControl config={config} onToggle={onToggle} />

        {/* Control to delete the field */}
        <DeleteFieldControl isDelete={isDelete} onDelete={onDelete} />
      </LabelFieldPair>
    </div>
  );
};

export default React.memo(PanelFieldDisplay);
