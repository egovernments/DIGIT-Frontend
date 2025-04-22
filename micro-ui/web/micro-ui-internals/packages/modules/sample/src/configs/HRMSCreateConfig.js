export const newConfig = [
  {
    // Section for capturing basic individual details
    head: "Create Individual",
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
  {
    // Section for additional sample details
    head: "Sample Details",
    key: "sampleDetails",
    body: [
      {
        isMandatory: false,
        key: "sampleDetails",
        type: "component", // Custom component rendering
        component: "SampleMultiComponent",
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: { name: "sampleDetails", required: true },
      },
    ],
  },
  {
    // Section for additional information
    head: "Additional Details",
    key: "additionalDetails",
    body: [
      {
        isMandatory: false,
        key: "additionalDetails",
        type: "component", // Custom component rendering
        component: "SampleAdditionalComponent",
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: { name: "additionalDetails", required: true },
      },
    ],
  },
];
