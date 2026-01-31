import { LabelFieldPair, TextInput, Dropdown, CheckBox, InfoCard, TooltipWrapper, TextArea } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../../../utils";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

const CheckBoxes = ({ t, option, optionKey, isLabelFirst }) => {
  return (
    <div>
      {option?.map((item, index) => (
        <CheckBox onChange={(e) => {}} value={""} label={t(`${item?.[optionKey]}`)} isLabelFirst={isLabelFirst} />
      ))}
    </div>
  );
};

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
  select = () => {},
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

const Field = ({
  t,
  headerFields,
  type,
  label,
  value,
  required,
  isDelete,
  onDelete,
  onSelectField,
  dropDownOptions,
  config,
  onChange,
  state,
  dispatch,
  Mandatory,
  helpText,
  infoText,
  innerLabel,
  rest,
  ...props
}) => {
  switch (type) {
    case "text":
    case "textInput":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {Mandatory && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
            </div>
            <TextInput className="appConfiglabelField-Input" name={""} value={value} onChange={(event) => onChange(event)} />
            {isDelete && (
              <div
                onClick={(e) => {
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
        </>
      );
      break;
    case "dropdown":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
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
        </>
      );
      break;

    case "MdmsDropdown":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
            </div>
            <MdmsDropdown
              className="appConfiglabelField-Input"
              variant={""}
              t={t}
              option={dropDownOptions}
              optionKey={"code"}
              selected={null}
              select={() => {}}
              props={props}
              moduleName={rest?.moduleMaster?.moduleName}
              masterName={rest?.moduleMaster?.masterName}
              rest={rest}
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
        </>
      );
      break;

    case "dobPicker":
    case "datePicker":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
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
        </>
      );
      break;
    case "counter":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
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
        </>
      );
      break;
    case "number":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
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
        </>
      );
    case "checkbox":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {required && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
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
        </>
      );

    case "time":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {Mandatory && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
            </div>
            <TextInput type="time" className="appConfiglabelField-Input" name={""} value={value} onChange={(event) => onChange(event)} />
            {isDelete && (
              <div
                onClick={(e) => {
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
        </>
      );
    case "textarea":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {Mandatory && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
            </div>
            <TextArea type="textarea" name={""} className="appConfiglabelField-Input" value={value} onChange={() => {}} />
            {isDelete && (
              <div
                onClick={(e) => {
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
        </>
      );
    case "mobileNumber":
      return (
        <>
          {infoText && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant="default"
              text={t(infoText)}
            />
          )}
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {Mandatory && <span className="mandatory-span">*</span>}
              {helpText && (
                <span className="icon-wrapper">
                  <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                </span>
              )}
            </div>
            <TextInput
              type="text"
              className="appConfiglabelField-Input"
              name={""}
              value={value}
              onChange={(event) => onChange(event)}
              populators={{ prefix: rest?.countryPrefix }}
            />
            {isDelete && (
              <div
                onClick={(e) => {
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
        </>
      );
    default:
      return (
        <>
          <LabelFieldPair
            className={
              !headerFields
                ? `appConfiglabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : ""
            }
          >
            <div className="appConfiglabelField-label">
              <span>{`${t(label)}`}</span>
              {Mandatory && <span className="mandatory-span">*</span>}
            </div>
            <TextInput className="appConfiglabelField-Input" name={""} value={value} onChange={(event) => onChange(event)} />
            {isDelete && (
              <div
                onClick={(e) => {
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
        </>
      );
      break;
  }
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
  onChange = () => {},
  Mandatory,
  helpText,
  infoText,
  innerLabel,
  rest,
}) {
  const { t } = useTranslation();
  const { state, dispatch } = useAppConfigContext();
  const componentRef = useRef(null);

  return (
    <div
      ref={componentRef}
      onClick={(e) => {
        onSelectField();
      }}
      className="app-config-field-wrapper"
      style={{ width: "50%" }}
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
        onSelectField={onSelectField}
        dropDownOptions={dropDownOptions}
        config={config}
        onChange={onChange}
        state={state}
        dispatch={dispatch}
        Mandatory={Mandatory}
        helpText={helpText}
        infoText={infoText}
        innerLabel={innerLabel}
        rest={rest}
      />
    </div>
  );
}

export default React.memo(AppFieldComposer);
