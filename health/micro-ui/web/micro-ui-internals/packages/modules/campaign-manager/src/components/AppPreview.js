import React, { Fragment } from "react";
import {
  Card,
  CardText,
  TextInput,
  SelectionTag,
  Dropdown,
  CardHeader,
  Button,
  TooltipWrapper,
  AlertCard,
  FieldV1,
  SVG,
  Loader,
  CheckBox,
} from "@egovernments/digit-ui-components";
import { ResourceCard } from "./svgComponents/resourceCards";
import { useTranslation } from "react-i18next";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";
import "../utils/template_components/RegistrationComponents";
import MobileBezelFrame from "./MobileBezelFrame";
import GenericTemplateScreen from "./GenericTemplateScreen";

const dummydata = {
  name: "HOUSEHOLD_LOCATION",
  cards: [
    {
      fields: [
        {
          type: "text",
          label: "Address Line 1",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
        {
          type: "Selection",
          label: "Address Line 1",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
        {
          type: "numeric",
          label: "Address Line 1",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
        {
          type: "dropdown",
          label: "Address Line 2",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
        {
          type: "date",
          label: "Address Line 2",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
        {
          type: "dob",
          label: "Address Line 4",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
      ],
      header: "Header",
      description: "Desc",
      headerFields: [
        {
          type: "text",
          label: "SCREEN_HEADING",
          active: true,
          jsonPath: "ScreenHeading",
          metaData: {},
          required: true,
        },
        {
          type: "text",
          label: "SCREEN_DESCRIPTION",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
        },
      ],
    },
  ],
  order: 1,
  config: {
    enableComment: true,
    enableFieldAddition: true,
    allowFieldsAdditionAt: ["body"],
    enableSectionAddition: true,
    allowCommentsAdditionAt: ["body"],
  },
  parent: "REGISTRATION",
  headers: [
    {
      type: "header",
      label: "KJHSJKDHKJH",
    },
    {
      type: "info",
      label: "KJHSJKDHKJH",
    },
    {
      type: "description",
      label: "KJHSJKDHKJH",
    },
  ],
};

const DobPicker = ({ t }) => {
  return (
    <div className="dob-picker">
      <Card type="secondary">
        <div>{t("HCM_DATE_OF_BIRTH")}</div>
        <TextInput name="numeric" onChange={() => { }} type={"date"} />
        <div>({t("HCM_OR")})</div>
        <div>{t("HCM_AGE")}</div>
        <div className="date-style">
          <TextInput name="numeric" onChange={() => { }} placeholder={t("HCM_YEARS")} disabled={true} />
          <TextInput name="numeric" onChange={() => { }} placeholder={t("HCM_MONTHS")} disabled={true} />
        </div>
      </Card>
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
    case "selection":
      //[TODO: Need to allow support for static options or any API or hook support to fetch options] @nabeel @ram
      const { isLoading, data } = window?.Digit?.Hooks.useCustomMDMS(
        Digit?.ULBService?.getStateId(),
        field?.schemaCode?.split(".")[0],
        [
          {
            name: field?.schemaCode?.split(".")[1],
          },
        ],
        {
          select: (data) => {
            const optionsData = _.get(data, `${field?.schemaCode?.split(".")[0]}.${field?.schemaCode?.split(".")[1]}`, []);
            return optionsData
              .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
              .map((opt) => ({ ...opt, name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
          },
          enabled: field?.isMdms && field?.schemaCode ? true : false,
        },
        { schemaCode: "SELCTIONTABMDMSLIST" }
      );

      if (isLoading) {
        return <Loader />;
      }
      return (
        <SelectionTag
          errorMessage=""
          onSelectionChanged={() => { }}
          schemaCode={field?.schemaCode}
          options={data || field?.dropDownOptions}
          optionsKey={"name"}
          selected={[]}
          withContainer={true}
          populators={{
            t: field?.isMdms ? null : t,
          }}
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
          t={t} //   disabled={source === "microplan"}
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
        return <div style={{width: "100%"}}> <ResourceCard style={{width: "100%", height: "auto"}}></ResourceCard></div> // TODO hardcoded with qrscanner we need to think about it and set accordingly @jagan @nabeel
    default:
      return <div style={{ color: "red", marginTop: "5px" }}>Unsupported field type: {field.type}</div>;
  }
};

const getFieldType = (field) => {
  //TODO Why do we still need this swtich case this should be set as a default supported fields and app field master should help to map this
  switch (field.type) {
    case "text":
    case "textInput":
      return "text";
    case "number":
      return "number";
    case "textarea":
      return "textarea";
    case "time":
      return "time";
    case "mobileNumber":
      return "mobileNumber";
    case "checkbox":
      return "checkbox";
    case "Selection":
    case "selection":
    case "select":
      return "select";
    case "numeric":
    case "counter":
      return "numeric";
    case "dropdown":
      return "dropdown";
    case "MdmsDropdown":
      return "custom";
    case "date":
    case "dobPicker":
    case "datePicker":
    case "dob":
      return "date";
    case "radio":
      return "radio";
    default:
      return "button";
  }
};
const AppPreview = ({ data = dummydata, selectedField, t }) => {

  return (
    <MobileBezelFrame>
      {/* <div className="app-preview"> */}
      <div className="mobile-bezel-child-container">
        {data.cards.map((card, index) => (
          <Card key={index} className="app-card" style={{}}>
            {card.headerFields.map((headerField, headerIndex) => (
              <div key={headerIndex}>
                {headerField.jsonPath === "ScreenHeading" ? (
                  <CardHeader>{t(headerField.value)}</CardHeader>
                ) : (
                  <CardText className="app-preview-sub-heading">{t(headerField.value)}</CardText>
                )}
              </div>
            ))}
            {data.type !== "template" &&
              card?.fields
                ?.filter((field) => field.active && (field.hidden == false || field.deleteFlag == true)) //added logic to hide fields in display
                ?.map((field, fieldIndex) => {
                  if (getFieldType(field) === "checkbox") {
                    return (
                      <div
                        className={`app-preview-field-pair ${
                          selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
                            ? `app-preview-selected`
                            : selectedField?.id && selectedField?.id === field?.id
                            ? `app-preview-selected`
                            : ``
                        }`}
                      >
                        <CheckBox
                          mainClassName={"app-config-checkbox-main"}
                          labelClassName={`app-config-checkbox-label ${field?.["toArray.required"] ? "required" : ""}`}
                          onChange={(e) => {}}
                          value={""}
                          label={t(field?.label)}
                          isLabelFirst={false}
                          disabled={field?.readOnly || false}
                        />
                      </div>
                    );
                  }
                  return (
                    <FieldV1
                      charCount={field?.charCount}
                      config={{
                        step: "",
                      }}
                      description={field?.isMdms ? t(field?.helpText) : field?.helpText || null}
                      error={field?.isMdms ? t(field?.errorMessage) : field?.errorMessage || null}
                      infoMessage={field?.isMdms ? t(field?.tooltip) : field?.tooltip || null}
                      label={
                        getFieldType(field) === "checkbox" || getFieldType(field) === "button" ? null : field?.isMdms ? t(field?.label) : field?.label
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
                        component: getFieldType(field) === "button" || getFieldType(field) === "select" ? renderField(field, t) : null,
                      }}
                      required={field?.["toArray.required"] || false}
                      type={getFieldType(field) === "button" || getFieldType(field) === "select" ? "custom" : getFieldType(field) || "text"}
                      value={field?.value === true ? "" : field?.value || ""}
                      disabled={field?.readOnly || false}
                    />
                  );
                })}
            {data.type !== "template" && (
              <Button
                className="app-preview-action-button"
                variation="primary"
                label={t(data?.actionLabel)}
                title={t(data?.actionLabel)}
                onClick={() => { }}
              />
            )}
            {data.type === "template" &&
              <GenericTemplateScreen components={card.fields} selectedField={selectedField} t={t} templateName={data.name} />
            }
          </Card>
        ))}
      </div>
    </MobileBezelFrame>
  );
};


export default AppPreview;