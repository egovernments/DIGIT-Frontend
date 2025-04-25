import React from "react";
import { Card, CardText, TextInput, SelectionTag, Dropdown, CardHeader, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

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
        <TextInput name="numeric" onChange={() => {}} type={"date"} />
        <div>({t("HCM_OR")})</div>
        <div>{t("HCM_AGE")}</div>
        <div className="date-style">
          <TextInput name="numeric" onChange={() => {}} placeholder={t("HCM_YEARS")} disabled={true} />
          <TextInput name="numeric" onChange={() => {}} placeholder={t("HCM_MONTHS")} disabled={true} />
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
    case "Selection":
      return (
        <SelectionTag
          errorMessage=""
          onSelectionChanged={() => {}}
          options={[
            {
              code: "option1",
              name: "Option 1",
              prefixIcon: "",
              suffixIcon: "",
            },
            {
              code: "option2",
              name: "Option 2",
              prefixIcon: "",
              suffixIcon: "",
            },
            {
              code: "option3",
              name: "Option 3",
              prefixIcon: "",
              suffixIcon: "",
            },
          ]}
          selected={[]}
        />
      );
    case "numeric":
    case "counter":
      return <TextInput name="numeric" onChange={() => {}} type={"numeric"} />;
    case "dropdown":
    case "dropDown":
      return (
        <Dropdown
          option={field?.dropDownOptions || []}
          optionKey={"name"}
          selected={[]}
          select={() => {}}
          //   disabled={source === "microplan"}
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
          moduleName={rest?.moduleMaster?.moduleName}
          masterName={rest?.moduleMaster?.masterName}
          rest={rest}
        />
      );
    case "date":
    case "dobPicker":
    case "datePicker":
    case "dob":
      return <TextInput type="date" className="appConfigLabelField-Input" name={""} value={field?.value} onChange={() => {}} />;
    default:
      return <div style={{ color: "red", marginTop: "5px" }}>Unsupported field type: {field.type}</div>;
  }
};

const AppPreview = ({ data = dummydata, selectedField, t }) => {
  return (
    <div className="app-preview">
      {/* <div className="mobile-top">
        <div className="mobile-menu-icon">&#9776;</div>
      </div> */}
      {data.cards.map((card, index) => (
        <Card key={index}>
          {card.headerFields.map((headerField, headerIndex) => (
            <div key={headerIndex}>
              {headerField.jsonPath === "ScreenHeading" ? (
                <CardHeader>{t(headerField.value)}</CardHeader>
              ) : (
                <CardText className="app-preview-sub-heading">{t(headerField.value)}</CardText>
              )}
            </div>
          ))}
          {card?.fields
            ?.filter((field) => field.active)
            ?.map((field, fieldIndex) => (
              <div
                className={
                  selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
                    ? "app-preview-selected"
                    : selectedField?.id && selectedField?.id === field?.id
                    ? "app-preview-selected"
                    : ""
                }
                key={fieldIndex}
                // style={{ margin: "10px 0", padding: "1rem" }}
              >
                <div>
                  {t(field.label)}
                  {field.required && " *"}
                </div>
                {/* Call renderField function to render the specific component */}
                {renderField(field, t)}
              </div>
            ))}
          <Button
            className="app-preview-action-button"
            variation="primary"
            label={t(data?.actionLabel)}
            title={t(data?.actionLabel)}
            onClick={() => {}}
          />
        </Card>
      ))}
    </div>
  );
};

export default AppPreview;
