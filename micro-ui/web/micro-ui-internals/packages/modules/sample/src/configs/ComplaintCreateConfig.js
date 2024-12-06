export const newConfig = [
    {
      head: "Complaints Details",
      body: [
        {
          isMandatory: true,
          key: "complaintType",
          type: "dropdown",
          label: "Complain Type",
          disable: false,
          populators: {
            name: "complaintType",
            optionsKey: "serviceCode",
            error: "required ",
            mdmsConfig: {
              masterName: "ServiceDefs",
              moduleName: "RAINMAKER-PGR",
              localePrefix: "COMMON_COMPLAIN",
            },
          },
        },
        {
          inline: true,
          label: "Date of complaint",
          isMandatory: true,
          key: "dob",
          type: "date",
          disable: false,
          populators: { name: "dob", error: "Required" },
        },
        {
          isMandatory: true,
          key: "administrativeArea",
          type: "dropdown",
          label: "Administrative Area",
          disable: false,
          populators: {
            name: "administrativeArea",
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
          key: "radio",
          type: "radio",
          label: "Are you raising complaint for yourself or another user?",
          disable: false,
          populators: {
            name: "radio",
            optionsKey: "name",
            error: "required",
            required: true,
            options: [
              {
                code: "Myself",
                name: "Myself",
              },
              {
                code: "Another User",
                name: "Another User",
              },
            ],
          },
        },
      ],
    },
    {
      head: "Complainant Details",
      body: [
        {
          inline: true,
          label: "Complainant's name",
          isMandatory: true,
          key: "ComplainantsName",
          type: "text",
          disable: false,
          populators: { name: "ComplainantsName", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          label: "Complainant's contact number",
          isMandatory: true,
          key: "phno",
          type: "number",
          disable: false,
          populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
        },
        {
          inline: true,
          label: "Supervisor's name",
          isMandatory: false,
          key: "SupervisorsName",
          type: "text",
          disable: false,
          populators: { name: "SupervisorsName", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          label: "Supervisor's contact number",
          isMandatory: false,
          key: "Sphno",
          type: "number",
          disable: false,
          populators: { name: "Sphno", error: "Required", validation: { min: 0, max: 9999999999 } },
        },
      ],
    },
    {
      head: "Additional Details",
      key: "AdditionalDetails",
      body: [
        {
          inline: true,
          label: "Complaint description",
          isMandatory: true,
          key: "ComplaintDescription",
          type: "text",
          disable: false,
          populators: { name: "ComplaintDescription", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
      ],
    },
    {
      head: "Complaint Location",
      body: [
        {
          inline: true,
          label: "Address line 1",
          isMandatory: false,
          key: "Addressline1",
          type: "text",
          disable: false,
          populators: { name: "Addressline1", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Address line 2",
          isMandatory: false,
          key: "Addressline2",
          type: "text",
          disable: false,
          populators: { name: "Addressline2", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Landmark",
          isMandatory: false,
          key: "Landmark",
          type: "text",
          disable: false,
          populators: { name: "Landmark", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Postal Code",
          isMandatory: false,
          key: "PostalCode",
          type: "text",
          disable: false,
          populators: { name: "PostalCode", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
      ],
    },
  ];