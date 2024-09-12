export const newConfig = [
  {
    head: "Applicant Details",
    body: [
      {
        inline: true,
        label: "Applicant Name",
        isMandatory: true,
        key: "applicantname",
        type: "text",
        disable: false,
        populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Date of Birth",
        isMandatory: false,
        key: "dob",
        type: "date",
        disable: false,
        populators: { name: "dob", error: "Required" },
      },
      {
        isMandatory: false,
        key: "genders",
        type: "dropdown",
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
        isMandatory: true,
        key: "mobileNumber",
        type: "number",
        disable: false,
        populators: { name: "mobileNumber", error: "Required", validation: { min: 0, max: 9999999999 } },
      },
    ],
  },
  {
    head: "Residential Details",
    body: [
      {
        inline: true,
        label: "City",
        isMandatory: true,
        key: "city",
        type: "text",
        disable: false,
        populators: { name: "city", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
      },

      {
        inline: true,
        label: "Landmark",
        isMandatory: false,
        key: "landmark",
        type: "text",
        disable: false,
        populators: { name: "landmark", error: " Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
    ],
  },
  // {
  //   head: "Sample Details",
  //   key: "sampleDetails",
  //   body: [
  //     {
  //       isMandatory: false,
  //       key: "sampleDetails",
  //       type: "component", // for custom component
  //       component: "SampleMultiComponent", // name of the component as per component registry
  //       withoutLabel: true,
  //       disable: false,
  //       customProps: {},
  //       populators: {
  //         name: "sampleDetails",
  //         required: true,
  //       },
  //     },
  //   ],
  // },
  // {
  //   head: "Additional Details",
  //   key: "additionalDetails",
  //   body: [
  //     {
  //       isMandatory: false,
  //       key: "additionalDetails",
  //       type: "component", // for custom component
  //       component: "SampleAdditionalComponent", // name of the component as per component registry
  //       withoutLabel: true,
  //       disable: false,
  //       customProps: {},
  //       populators: {
  //         name: "additionalDetails",
  //         required: true,
  //       },
  //     },
  //   ],
  // },
];
