import { LabelFieldPair, TextInput, Dropdown, CheckBox } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../utils";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";

const CheckBoxes = ({ t, option, optionKey, isLabelFirst }) => {
  return (
    <div>
      {option?.map((item, index) => (
        <CheckBox onChange={(e) => {}} value={""} label={t(`${item?.[optionKey]}`)} isLabelFirst={isLabelFirst} />
      ))}
    </div>
  );
};

function AppFieldComposer({
  headerFields = false,
  type,
  label,
  value,
  required,
  isDelete = false,
  onDelete,
  onSelectField = () => {},
  dropDownOptions = [],
  config,
}) {
  const { t } = useTranslation();
  const { state, dispatch } = useAppConfigContext();
  const componentRef = useRef(null);

  const Field = () => {
    switch (type) {
      case "text":
      case "textInput":
        return (
          // <div
          //   ref={componentRef}
          //   onClick={() => {
          //     onSelectField();
          //   }}
          // >
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <TextInput className="appConfiglabelField-Input" name={""} value={value} onChange={() => {}} />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
          // </div>
        );
        break;
      case "dropDown":
        return (
          // <div
          //   onClick={() => {
          //     onSelectField();
          //   }}
          // >
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <Dropdown
              className="appConfiglabelField-Input"
              // style={}
              variant={""}
              t={t}
              option={dropDownOptions}
              optionKey={"name"}
              selected={null}
              select={() => {}}
            />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
          // </div>
        );
        break;
      case "dobPicker":
      case "datePicker":
        return (
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <TextInput type="date" className="appConfiglabelField-Input" name={""} value={value} onChange={() => {}} />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
        );
        break;
      case "counter":
        return (
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <TextInput type="numeric" className="appConfiglabelField-Input" name={""} value={value} onChange={() => {}} />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
        );
        break;
      case "number":
        return (
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <TextInput type="number" className="appConfiglabelField-Input" name={""} value={value} onChange={() => {}} />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
        );
      case "checkbox":
        return (
          <LabelFieldPair className={!headerFields ? `appConfiglabelField ${config?.id === state?.drawerField?.id ? "selected" : ""}` : ""}>
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <CheckBoxes isLabelFirst={false} t={t} option={dropDownOptions} optionKey={"name"} />
            {isDelete && (
              <div
                onClick={(e) => {
                  // e.stopPropagation();
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
            )}
          </LabelFieldPair>
        );
      default:
        return null;
        break;
    }
  };

  return (
    <div
      ref={componentRef}
      onClick={(e) => {
        if (config?.id !== state?.drawerField?.id) {
          onSelectField();
        }
        // e.stopPropagation();
        // onSelectField();
      }}
      className="app-config-field-wrapper"
      style={{ width: "50%" }}
    >
      <Field />
    </div>
  );
}

export default AppFieldComposer;
