import React, { useState } from "react";
import { JsonEditor, githubDarkTheme } from "json-edit-react";
import { Card } from "@egovernments/digit-ui-components";
import { FormComposerV2, Toast, Header } from "@egovernments/digit-ui-react-components";

const defaultConfig = [
  {
    // Section for capturing basic individual details
    head: "Test Screen Config",
    body: [
      {
        inline: true,
        label: "Applicant Name",
        isMandatory: true, // Field is required
        key: "applicantname",
        type: "text", // Input type is text
        disable: false,
        populators: {
          name: "applicantname",
          error: "Required",
          validation: { pattern: /^[A-Za-z]+$/i }, // Allows only alphabets
        },
      },
      {
        inline: true,
        label: "Date of Birth",
        isMandatory: false,
        key: "dob",
        type: "date", // Input type is date picker
        disable: false,
        populators: { name: "dob", error: "Required" },
      },
      {
        isMandatory: true,
        key: "genders",
        type: "dropdown", // Dropdown for gender selection
        label: "Enter Gender",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name", // Display value in dropdown
          error: "Required",
          mdmsConfig: {
            masterName: "GenderType", // Fetch values from MDMS service
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
      {
        label: "Phone Number",
        isMandatory: true,
        key: "phno",
        type: "number", // Input type is number
        disable: false,
        populators: {
          name: "phno",
          error: "Phone no is invalid",
          validation: { minLength: 10, min: 0, max: 9999999999 }, // 10-digit phone number validation
        },
      },
    ],
  },
  {
    // Section for capturing residential details
    head: "Residential Details",
    body: [
      {
        inline: true,
        label: "Pincode",
        isMandatory: true,
        key: "pincode",
        type: "number",
        disable: false,
        populators: { name: "pincode", error: "Required" },
      },
      {
        inline: true,
        label: "City",
        isMandatory: true,
        key: "city",
        type: "text",
        disable: false,
        populators: {
          name: "city",
          error: "Required",
          validation: { pattern: /^[A-Za-z]+$/i }, // Allows only alphabets
        },
      },
      {
        isMandatory: false,
        key: "locality",
        type: "dropdown", // Dropdown for selecting locality
        label: "Enter Locality",
        disable: false,
        populators: {
          name: "locality",
          optionsKey: "name",
          error: "Required",
          required: true,
          options: [
            {
              code: "SUN01",
              name: "Ajit Nagar - Area1",
              pincode: [143001],
            },
            {
              code: "SUN02",
              name: "Back Side 33 KVA Grid Patiala Road",
              pincode: [143001],
            },
            {
              code: "SUN03",
              name: "Bharath Colony",
              pincode: [143001],
            },
          ],
        },
      },
      {
        inline: true,
        label: "Street",
        isMandatory: false,
        key: "street",
        type: "text",
        disable: false,
        populators: {
          name: "street",
          error: "Required",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
      {
        inline: true,
        label: "Door Number",
        isMandatory: true,
        key: "doorno",
        type: "number",
        disable: false,
        populators: {
          name: "doorno",
          error: "Required",
          validation: { min: 0, max: 9999999999 },
        },
      },
      {
        inline: true,
        label: "Landmark",
        isMandatory: false,
        key: "landmark",
        type: "text",
        disable: false,
        populators: {
          name: "landmark",
          error: "Required",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
    ],
  },
];

const FormExplorer = ({ stateCode }) => {
  const [jsonData, setJsonData] = useState({ configs: defaultConfig });
  const [showToast, setShowToast] = useState(null);

  const onSubmit = async (data) => {
    console.log(data, "data"); // Debug log of submitted form data

    await mutation.mutate(
      {
        url: `/egov-hrms/employees/_create`,
        params: { tenantId }, // Include tenant ID in API request
        body: data, // Transform data before sending to API
        config: {
          enable: true,
        },
      },
      {
        // Handle success response
        onSuccess: (data) => {
          setShowToast({ key: "success", label: "Individual Created Successfully" });
        },
        // Handle error response
        onError: (error) => {
          setShowToast({ key: "error", label: "Individual Creation Failed" });
        },
      }
    );
  };

  return (
    <Card type={"secondary"}>
      <Header>{"Playground for Form Composer"}</Header>

      <div className="form-explorer">
        {" "}
        <JsonEditor
          rootName="ScreenConfig"
          data={jsonData}
          collapse={4}
          theme={githubDarkTheme}
          setData={setJsonData} // optional
        />
        <FormComposerV2
          className="form-component"
          label={"Sample"}
          config={jsonData?.configs?.map((config) => ({
            ...config,
          }))}
          defaultValues={{}} // Default values for form fields
          onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
            console.log(formData, "formData"); // Debug log when form values change
          }}
          onSubmit={(data) => onSubmit(data)} // Handle form submission
          fieldStyle={{ marginRight: 0 }}
        />
        {showToast && (
          <Toast
            style={{ zIndex: 10001 }}
            label={showToast.label}
            type={showToast.key}
            error={showToast.key === "error"}
            onClose={() => setShowToast(null)}
          />
        )}
      </div>
    </Card>
  );
};

export default FormExplorer;
