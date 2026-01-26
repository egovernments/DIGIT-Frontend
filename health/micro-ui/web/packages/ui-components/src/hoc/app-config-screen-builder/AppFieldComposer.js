import Tag from "../../atoms/Tag";
import LabelFieldPair from "../../atoms/LabelFieldPair";
import TextInput from "../../atoms/TextInput";
import Dropdown from "../../atoms/Dropdown";
import CheckBox from "../../atoms/CheckBox";
import InfoCard from "../../atoms/AlertCard";
import TooltipWrapper from "../../atoms/Tooltip";
import TextArea from "../../atoms/TextArea";
import Switch from "../../atoms/Switch";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "./app-config-utils/constants";
import { DustbinIconNew as DustbinIcon } from "../../atoms/CustomSVG";
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
  isDrawer = true,
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
  onHide,
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
    case "textarea": {
      const [textVal, setTextVal] = useState(null);

      useEffect(() => {
        setTextVal(value);
      }, [value]);
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
                ? `appConfigLabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : "appConfigHeaderLabelField desc"
            }
          >
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label desc">
                  <span>{`${t(label)}`}</span>
                  {Mandatory && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                {!headerFields ? (
                  <Tag icon="" label={t(rest?.appType)} className={"app-config-field-tag"} labelStyle={{}} showIcon={false} style={{}} />
                ) : (
                  <TextArea
                    type="textarea"
                    className="appConfigLabelField-Input"
                    name={""}
                    value={textVal}
                    onChange={(event) => {
                      setTextVal(event.target.value);
                      return onChange(event);
                    }}
                  />
                )}
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
              </>
            )}
          </LabelFieldPair>
        </>
      );
    }
    case "text":
    case "textInput":
      {
        const [textVal, setTextVal] = useState(null);

        useEffect(() => {
          setTextVal(value);
        }, [value]);

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
                  ? `appConfigLabelField ${
                      config?.id
                        ? config?.id === state?.drawerField?.id
                          ? "selected"
                          : ""
                        : config?.jsonPath === state?.drawerField?.jsonPath
                        ? "selected"
                        : ""
                    }`
                  : "appConfigHeaderLabelField"
              }
            >
              {!headerFields && isDrawer ? (
                <>
                  <PanelFieldDisplay
                    t={t}
                    label={label}
                    appType={t(rest?.appType)}
                    isDelete={isDelete}
                    onDelete={onDelete}
                    onToggle={onHide}
                    config={config}
                  />
                </>
              ) : (
                <>
                  <div className="appConfigLabelField-label-container">
                    <div className="appConfigLabelField-label">
                      <span>{`${t(label)}`}</span>
                      {Mandatory && <span className="mandatory-span">*</span>}
                      {helpText && (
                        <span className="icon-wrapper">
                          <TooltipWrapper
                            content={t(helpText)}
                            children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />}
                          />
                        </span>
                      )}
                    </div>
                    {!headerFields ? (
                      <Tag
                        icon=""
                        label={t(rest?.appType)}
                        className={"app-config-field-tag"}
                        labelStyle={{}}
                        showIcon={false}
                        style={{}}
                      />
                    ) : (
                      <TextInput
                        className="appConfigLabelField-Input"
                        name={""}
                        value={textVal}
                        onChange={(event) => {
                          setTextVal(event.target.value);
                          return onChange(event);
                        }}
                      />
                    )}
                  </div>
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
                </>
              )}
            </LabelFieldPair>
          </>
        );
      }
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {required && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                {!headerFields ? (
                  <Tag icon="" label={t(rest?.appType)} className={"app-config-field-tag"} labelStyle={{}} showIcon={false} style={{}} />
                ) : (
                  <Dropdown
                    className="appConfigLabelField-Input"
                    // style={}
                    variant={""}
                    t={t}
                    option={dropDownOptions}
                    optionKey={"name"}
                    selected={null}
                    select={() => {}}
                  />
                )}
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {required && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <MdmsDropdown
                  className="appConfigLabelField-Input"
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {required && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <TextInput type="date" className="appConfigLabelField-Input" name={""} value={value} onChange={() => {}} />
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <div className="appConfigLabelField-label-container">
                  <div className="appConfigLabelField-label">
                    <span>{`${t(label)}`}</span>
                  </div>
                  <Tag icon="" label={t(rest?.appType)} className={"app-config-field-tag"} labelStyle={{}} showIcon={false} style={{}} />
                </div>
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
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {required && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <TextInput type="numeric" className="appConfigLabelField-Input" name={""} value={value} onChange={() => {}} />
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {required && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <TextInput type="number" className="appConfigLabelField-Input" name={""} value={value} onChange={() => {}} />
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {Mandatory && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <TextInput
                  type="time"
                  className="appConfigLabelField-Input"
                  name={""}
                  value={value}
                  onChange={(event) => onChange(event)}
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
              </>
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
                ? `appConfigLabelField ${
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
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
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
                  className="appConfigLabelField-Input"
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
              </>
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
                ? `appConfigLabelField ${
                    config?.id
                      ? config?.id === state?.drawerField?.id
                        ? "selected"
                        : ""
                      : config?.jsonPath === state?.drawerField?.jsonPath
                      ? "selected"
                      : ""
                  }`
                : "appConfigHeaderLabelField"
            }
          >
            {!headerFields && isDrawer ? (
              <>
                <PanelFieldDisplay
                  t={t}
                  label={label}
                  appType={t(rest?.appType)}
                  isDelete={isDelete}
                  onDelete={onDelete}
                  onToggle={onHide}
                  config={config}
                />
              </>
            ) : (
              <>
                <div className="appConfigLabelField-label">
                  <span>{`${t(label)}`}</span>
                  {Mandatory && <span className="mandatory-span">*</span>}
                  {helpText && (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(helpText)} children={<InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />} />
                    </span>
                  )}
                </div>
                <Tag icon="" label={t(rest?.appType)} className={"app-config-field-tag"} labelStyle={{}} showIcon={false} style={{}} />
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
              </>
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
  const { state, dispatch } = useAppConfigContext();
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
