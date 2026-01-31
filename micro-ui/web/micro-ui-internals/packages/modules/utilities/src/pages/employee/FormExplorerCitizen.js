import React, { useState } from "react";
import { JsonEditor, githubDarkTheme } from "json-edit-react";
import { Card } from "@egovernments/digit-ui-components";
import { FormComposerCitizen, Toast, Header } from "@egovernments/digit-ui-react-components";

const defaultConfig = [
  {
    // Section for capturing basic individual details
     head: "Test Screen Config",
    body: [
      {
        inline: true,
        label: "Applicant Name",
        isMandatory: true,  // Field is required
        key: "applicantname",
       type: "text", // Input type is text
        disable: false,
        route:"name",
        nextRoute:"dob",
        populators: { name: "applicantname", error: "Required",  validation: { pattern: /^[A-Za-z]+$/i }, }// Allows only alphabets
      },
      {
        inline: true,
        label: "date of birth",
        isMandatory: false,
        key: "dob",
        type: "date",
        route:"dob",
        nextRoute:"gender",
        disable: false,
        populators: { name: "dob", error: "Required" },
      },
      {
        isMandatory: true, // Field is required
        key: "genders",
        type: "dropdown",
        route:"gender",
        nextRoute:"phone-number",
        label: "Enter Gender",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },

      {
        label: "Phone number",
        isMandatory: true, // Field is required
        key: "phno",
        route:"phone-number",
        nextRoute:"pincode",
        type: "number",
        disable: false,
        populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
      },
    ],
  },
  {
    head: "Residential Details",
    body: [
      {
        inline: true,
        label: "Pincode",
        isMandatory: true, // Field is required
        key: "pincode",
        type: "number",
        route:"pincode",
        nextRoute:"city",
        disable: false,
        populators: { name: "pincode", error: "Required " },
      },
      {
        inline: true,
        label: "City",
        isMandatory: true, // Field is required
        key: "city",
       type: "text", // Input type is text
        route:"city",
        nextRoute:"street",
        disable: false,
        populators: { name: "city", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        isMandatory: false,
        key: "locality",
        type: "dropdown",
        route:"city",
        nextRoute:"street",
        label: "Enter locality",
        disable: false,
        populators: {
          name: "locality",
          optionsKey: "name",
          error: " Required",
          required: true,

          options: [
            {
              code: "SUN01",
              name: "Ajit Nagar - Area1",
              label: "Locality",
              latitude: "31.63089",
              longitude: "74.871552",
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN02",
              name: "Back Side 33 KVA Grid Patiala Road",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN03",
              name: "Bharath Colony",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN10",
              name: "Backside Brijbala Hospital - Area3",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area3",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN11",
              name: "Bigharwal Chowk to Railway Station - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN12",
              name: "Chandar Colony Biggarwal Road - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN20",
              name: "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area3",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN21",
              name: "ATAR SINGH COLONY - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN22",
              name: "Back Side Naina Devi Mandir - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN30",
              name: "Bakhtaur Nagar - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN31",
              name: "Bhai Mool Chand Sahib Colony - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN32",
              name: "College Road (Southern side) - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN33",
              name: "Ekta Colony (Southern Side) - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
          ],
        },
      },

      {
        inline: true,
        label: "Street",
        isMandatory: false,
        key: "street",
       type: "text", // Input type is text
        route:"street",
        nextRoute:null,
        disable: false,
        populators: { name: "street", error: "Required ", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Door Number",
        isMandatory: true, // Field is required
        key: "doorno",
        type: "number",
        disable: false,
        populators: { name: "doorno", error: " Required ", validation: { min: 0, max: 9999999999 } },
      },
      {
        inline: true,
        label: "Landmark",
        isMandatory: false,
        key: "landmark",
       type: "text", // Input type is text
        disable: false,
        populators: { name: "landmark", error: " Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
    ],
  },
 
];

const FormExplorerCitizen = ({ stateCode }) => {
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
        <FormComposerCitizen
          className="form-component"
          label={"Sample"}
          baseRoute="name"
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

export default FormExplorerCitizen;
