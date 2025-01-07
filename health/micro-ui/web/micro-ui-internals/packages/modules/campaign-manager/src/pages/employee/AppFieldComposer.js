import { LabelFieldPair, TextInput, Dropdown } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../utils";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";

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
            <TextInput name={""} value={value} onChange={() => {}} />
            {isDelete && (
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
            <div className="product-label-field">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
            </div>
            <Dropdown
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
            )}
          </LabelFieldPair>
          // </div>
        );
        break;
      default:
        return null;
        break;
    }
  };

  return (
    <div
      ref={componentRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectField();
      }}
      style={{ width: "50%" }}
    >
      <Field />
    </div>
  );
}

export default AppFieldComposer;
