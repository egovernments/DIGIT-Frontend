export const complaintCreateConfig = [
  {
    head: "Complaint Details",
    body: [
      {
        isMandatory: true,
        key: "genders",
        type: "dropdown",
        label: "Complaint type",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "serviceCode",
          error: "required ",
          mdmsConfig: {
            masterName: "ServiceDefs",
            moduleName: "RAINMAKER-PGR",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
      {
        inline: true,
        label: "Date of complaint",
        isMandatory: true,
        type: "date",
        disable: false,
        populators: { name: "dateOfComplaint", error: "Required", validation: { required: true } },
      },
      {
        isMandatory: true,
        key: "area",
        type: "dropdown",
        label: "Administrative area",
        disable: false,
        populators: {
          name: "area",
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
        isMandatory: true,
        key: "complaintFor",
        type: "radio",
        label: "Are you raising a complaint for yourself or another user",
        disable: false,
        populators: {
          name: "complaintFor",
          optionsKey: "name",
          error: "This is a required field",
          required: true,
          options: [
            {
              code: "1",
              name: "Myself",
            },
            {
              code: "2",
              name: "Another User",
            },
          ],
        },
      }
    ],
  },
  {
    head: "Complainant Details",
    body: [
      {
        label: "Complainant's name",
        isMandatory: true,
        key: "name",
        type: "text",
        disable: false,
        populators: { name: "name", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Complainant's contact number",
        isMandatory: true,
        type: "mobileNumber",
        key: "mobileNumber",
        disable: false,
        populators: { name: "mobileNumber", error: "Invalid contact number", validation: { min: 5999999999, max: 9999999999 } },
      },
      {
        label: "Supervisor's name",
        isMandatory: true,
        key: "supervisorName",
        type: "text",
        disable: false,
        populators: { name: "supervisorName", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Supervisor's contact number",
        isMandatory: true,
        type: "mobileNumber",
        key: "supMobileNumber",
        disable: false,
        populators: { name: "supMobileNumber", error: "Invalid contact number", validation: { min: 5999999999, max: 9999999999 } },
      },
      
    ],
  },
  {
    head: "Additional Details",
    body: [
      {
        label: "Complainant description",
        isMandatory: true,
        key: "description",
        type: "text",
        disable: false,
        populators: { 
            name: "description"
            // error: "Invalid description. Only alphabets allowed", 
            // validation: { pattern: /^[A-Za-z]+$/i } 
        },
      },
    ],
  },
  {
    head: "Complaint Location",
    body: [
      {
        label: "Address line 1",
        isMandatory: false,
        key: "addressLineOne",
        type: "text",
        disable: false,
        populators: { name: "addressLineOne", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Address line 2",
        isMandatory: false,
        key: "addressLineTwo",
        type: "text",
        disable: false,
        populators: { name: "addressLineTwo", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Landmark",
        isMandatory: false,
        key: "landmark",
        type: "text",
        disable: false,
        populators: { name: "landmark", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Postal code",
        isMandatory: false,
        key: "postalCode",
        type: "text",
        disable: false,
        populators: { name: "postalCode", error: "Invalid name. Only alphabets allowed", validation: { pattern: /^[A-Za-z]+$/i } },
      },
    ],
  },
];
