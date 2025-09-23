import React, { Fragment } from "react";
import { Card, CardText, TextInput, SelectionTag, Dropdown, CardHeader, Button, FieldV1, Loader, CheckBox } from "@egovernments/digit-ui-components";
import { DynamicImageComponent } from "./DynamicImageComponent";
import "../utils/template_components/RegistrationComponents";
import MobileBezelFrame from "./MobileBezelFrame";
import GenericTemplateScreen from "./GenericTemplateScreen";
import DynamicSVG from "./DynamicSVGComponent";
import RenderSelectionField from "./RenderSelectionField";
import ComponentToRender from "./ComponentToRender";
// import { useCustomT } from "../pages/employee/NewAppConfiguration/hooks/useCustomT";

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
    case "custom":
      return "custom";
    default:
      return "button";
  }
};
const AppPreview = ({ data = {}, selectedField, t, onFieldClick }) => {
  console.log("datadata", data);
  return (
    <MobileBezelFrame>
      {/* <div className="app-preview"> */}
      <div className="mobile-bezel-child-container">
        <Card className="app-card" style={{}}>
          {data.headerFields?.map((headerField, headerIndex) => (
            <div key={headerIndex}>
              {headerField.jsonPath === "ScreenHeading" ? (
                <CardHeader>{t(headerField.value)}</CardHeader>
              ) : (
                <CardText className="app-preview-sub-heading">{t(headerField.value)}</CardText>
              )}
            </div>
          ))}
          {data?.cards?.map((card, index) => (
            <Card key={index} className="app-card" style={{}}>
              {data.type !== "template" &&
                card?.fields
                  ?.filter((field) => field.active && field.hidden == false) //added logic to hide fields in display
                  ?.map((field, fieldIndex) => {
                    const isSelected = selectedField && (
                      (selectedField.jsonPath && selectedField.jsonPath === field.jsonPath) ||
                      (selectedField.id && selectedField.id === field.id)
                    );
                    
                    return (
                      <div 
                        key={fieldIndex}
                        onClick={() => onFieldClick && onFieldClick(field, data, card)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #0B4B66' : '2px solid transparent',
                          borderRadius: '4px',
                          padding: '8px',
                          margin: '4px 0',
                          backgroundColor: isSelected ? '#f0f8ff' : 'transparent'
                        }}
                      >
                        <ComponentToRender field={field} />
                      </div>
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
          {/* Rendering Footer */}
          {data?.footer?.length > 0 &&
            data?.footer?.map((footer_item, footer_index) => {
              return (
                <FieldV1
                  config={{ step: "" }}
                  description={null}
                  error={null}
                  infoMessage={null}
                  label={
                    getFieldType(footer_item) === "checkbox" || getFieldType(footer_item) === "button" || getFieldType(footer_item) === "custom"
                      ? null
                      : footer_item?.isMdms
                      ? t(footer_item?.label)
                      : footer_item?.label
                  }
                  onChange={function noRefCheck() {}}
                  placeholder={t(footer_item?.innerLabel) || ""}
                  populators={{
                    t: footer_item?.isMdms ? null : t,
                    title: footer_item?.label,
                    fieldPairClassName: `app-preview-field-pair ${
                      selectedField?.jsonPath && selectedField?.jsonPath === footer_item?.jsonPath
                        ? `app-preview-selected`
                        : selectedField?.id && selectedField?.id === footer_item?.id
                        ? `app-preview-selected`
                        : ``
                    }`,
                    mdmsConfig: footer_item?.isMdms
                      ? {
                          moduleName: footer_item?.schemaCode?.split(".")[0],
                          masterName: footer_item?.schemaCode?.split(".")[1],
                        }
                      : null,
                    options: footer_item?.isMdms ? null : footer_item?.dropDownOptions,
                    optionsKey: footer_item?.isMdms ? "code" : "name",
                    component:
                      getFieldType(footer_item) === "button" || getFieldType(footer_item) === "select" || getFieldType(footer_item) === "custom"
                        ? renderField(footer_item, t)
                        : null,
                  }}
                  required={getFieldType(footer_item) === "custom" ? null : footer_item?.["toArray.required"]}
                  type={
                    getFieldType(footer_item) === "button" || getFieldType(footer_item) === "select" ? "custom" : getFieldType(footer_item) || "text"
                  }
                  value={footer_item?.value === true ? "" : footer_item?.value || ""}
                  disabled={footer_item?.readOnly || false}
                />
              );
            })}
        </Card>
      </div>
    </MobileBezelFrame>
  );
};

export default AppPreview;
