import React from "react";
import { Card, CardText, TextInput, SelectionTag, Dropdown, CardHeader } from "@egovernments/digit-ui-components";
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

const renderField = (field, t) => {
  switch (field.type) {
    case "text":
      return <TextInput name="name" value={field?.name || ""} onChange={() => {}} disabled={true} />;
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
      return <TextInput name="numeric" onChange={() => {}} type={"numeric"} />;
    case "dropdown":
      return (
        <Dropdown
          option={[
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
          optionKey={"code"}
          selected={[]}
          select={() => {}}
          //   disabled={source === "microplan"}
        />
      );
    case "date":
      return <TextInput name="numeric" onChange={() => {}} type={"date"} />;
    case "dob":
      return <DobPicker t={t} />;
    default:
      return <div style={{ color: "red", marginTop: "5px" }}>Unsupported field type: {field.type}</div>;
  }
};

const AppPreview = ({ data = dummydata }) => {
  console.log("dataDummy", data);
  const { t } = useTranslation();
  return (
    <div className="app-preview">
      <div className="mobile-top">
        <div className="mobile-menu-icon">&#9776;</div>
      </div>
      {data.cards.map((card, index) => (
        <Card key={index}>
          {card.headerFields.map((headerField, headerIndex) => (
            <div key={headerIndex}>
              {console.log("NABEEL", headerField)}
              {headerField.jsonPath === "ScreenHeading" ? <CardHeader>{headerField.label}</CardHeader> : <CardText>{headerField.label}</CardText>}
            </div>
          ))}

          {card.fields
            .filter((field) => field.active)
            .map((field, fieldIndex) => (
              <div key={fieldIndex} style={{ margin: "10px 0" }}>
                <div>
                  {field.label}
                  {field.required && " *"}
                </div>
                {/* Call renderField function to render the specific component */}
                {renderField(field, t)}
              </div>
            ))}
        </Card>
      ))}
    </div>
  );
};

export default AppPreview;
