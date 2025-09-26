import React, { Fragment } from "react";
import { Card, CardText, TextInput, SelectionTag, Dropdown, CardHeader, Button, FieldV1, Loader, CheckBox } from "@egovernments/digit-ui-components";
import { DynamicImageComponent } from "./DynamicImageComponent";
import "../utils/template_components/RegistrationComponents";
import MobileBezelFrame from "./MobileBezelFrame";
import GenericTemplateScreen from "./GenericTemplateScreen";
import DynamicSVG from "./DynamicSVGComponent";
import RenderSelectionField from "./RenderSelectionField";

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

const renderField = (field, t) => {
  switch (field.type) {
    case "text":
    case "textInput":
      return <TextInput name="name" value={field?.name || ""} onChange={() => {}} disabled={true} />;
    case "number":
      return <TextInput type="number" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => {}} />;
    case "textarea":
      return <TextInput type="textarea" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => {}} />;
    case "time":
      return <TextInput type="time" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => {}} />;
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
      return <RenderSelectionField field={field} t={t} />;
    case "numeric":
    case "counter":
      return <TextInput name="numeric" onChange={() => {}} type={"numeric"} />;
    case "dropdown":
      return (
        <Dropdown
          option={field?.dropDownOptions || []}
          optionKey={"name"}
          selected={[]}
          select={() => {}}
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
          select={() => {}}
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
      return <TextInput type="date" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => {}} />;
    case "button":
      return (
        <Button
          icon={"QrCodeScanner"}
          className="app-preview-field-button"
          variation="secondary"
          label={t(field?.label)}
          title={t(field?.label)}
          onClick={() => {}}
        />
      );
    case "custom":
      return <DynamicImageComponent type={field?.type} appType={field?.appType} />;
    case "customsvg":
      return <DynamicSVG type={field?.type} appType={field?.appType} data={field} />;
    default:
      return <DynamicImageComponent type={field?.type} appType={field?.appType} />;
  }
};

// remove this function
const getFieldType = (field) => {
  //TODO Why do we still need this swtich case this should be set as a default supported fields and app field master should help to map this
  switch (field.type) {
    case "text":
    case "textInput":
      return "text";
    case "number":
      return "number";
    case "textArea":
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
    case "custom":
      return "custom";
    default:
      return "button";
  }
};
const AppPreview = ({ data = {}, selectedField, t }) => {
  return (
    <MobileBezelFrame>
      {/* <div className="app-preview"> */}
      <div className="mobile-bezel-child-container">
        {data?.cards?.map((card, index) => (
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
                        getFieldType(field) === "checkbox" || getFieldType(field) === "button" || getFieldType(field) === "custom"
                          ? null
                          : field?.isMdms
                          ? t(field?.label)
                          : field?.label
                      }
                      onChange={function noRefCheck() {}}
                      placeholder={t(field?.innerLabel) || ""}
                      populators={{
                        t: field?.isMdms ? null : t,
                        prefix: field?.prefixText,
                        suffix: field?.suffixText,
                        title: field?.label,
                        fieldPairClassName: `app-preview-field-pair ${
                          selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
                            ? `app-preview-selected`
                            : selectedField?.id && selectedField?.id === field?.id
                            ? `app-preview-selected`
                            : ``
                        } ${field?.["toArray.required"] && getFieldType(field) !== "custom" ? `required` : ``}`,
                        mdmsConfig: field?.isMdms
                          ? {
                              moduleName: field?.schemaCode?.split(".")[0],
                              masterName: field?.schemaCode?.split(".")[1],
                            }
                          : null,
                        options: field?.isMdms ? null : field?.dropDownOptions,
                        optionsKey: field?.isMdms ? "code" : "name",
                        component:
                          getFieldType(field) === "button" || getFieldType(field) === "select" || getFieldType(field) === "custom"
                            ? renderField(field, t)
                            : null,
                      }}
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
                onClick={() => {}}
              />
            )}
            {data.type === "template" && (
              <GenericTemplateScreen components={card.fields} selectedField={selectedField} t={t} templateName={data.name} />
            )}
          </Card>
        ))}
      </div>
    </MobileBezelFrame>
  );
};

export default AppPreview;
