export const estimateConfig = [
  {
    head: "Basic Information",
    body: [
      {
        inline: true,
        label: "Proposal Date",
        isMandatory: true,
        key: "proposalDate",
        type: "date",
        disable: false,
        populators: { name: "proposalDate", error: "Required"},
      },
      {
        inline: true,
        label: "Status",
        isMandatory: true,
        key: "status",
        type: "text",
        disable: false,
        populators: { name: "status", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Workflow Status",
        isMandatory: true,
        key: "wfStatus",
        type: "dropdown",
        disable: false,
        populators: { 
          name: "wfStatus", 
          optionsKey: "name",
          error: "Required",
          required: true,

          options : [
            {
              name: "PENDING",
            },
            {
              name: "VERFIED",
            },
            {
              name: "APPROVED",
            }
          ]
          },
      },
      {
        inline: true,
        label: "Name",
        isMandatory: true,
        key: "name",
        type: "text",
        disable: false,
        populators: { name: "name", error: "Required"},
      },
      {
        inline: true,
        label: "Description",
        isMandatory: true,
        key: "description",
        type: "text",
        disable: false,
        populators: { name: "description", error: "Required" },
      },
      {
        inline: true,
        label: "Executing Department",
        isMandatory: true,
        key: "executingDepartment",
        type: "text",
        disable: false,
        populators: { name: "executingDepartment", error: "Required" },
      },
    ],
  },
  {
    head: "Address",
    key: "address",
    body: [
      {
        inline: true,
        label: "Latitude",
        isMandatory: true,
        key: "latitude",
        type: "number",
        disable: false,
        populators: { name: "latitude", error: "Required", validation: { min: 0, max: 200 } },
      },
      {
        inline: true,
        label: "Longitude",
        isMandatory: true,
        key: "longitude",
        type: "number",
        disable: false,
        populators: { name: "longitude", error: "Required", validation: { min: 0, max: 200 } },
      },
      {
        inline: true,
        label: "City",
        isMandatory: false,
        key: "city",
        type: "text",
        disable: false,
        populators: { name: "city", error: "Required" },
      },
    ],
  },
  {
    head: "Estimate Details",
    key: "estimateDetails",
    body: [
      {
        isMandatory: true,
        key: "estimateDetails",
        type: "component", // for custom component
        component: "SampleAddEstimateComponent", // name of the component as per component registry
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: {
          name: "estimateDetails",
          required: true,
          options: [
            {
              inline: true,
              label: "SOR Id",
              isMandatory: false,
              key: "sorId",
              type: "text",
              disable: false,
              populators: { name: "sorId", error: "Required" },
            },
            {
              inline: true,
              label: "Category",
              isMandatory: false,
              key: "category",
              type: "text",
              disable: false,
              populators: { name: "category", error: "Invalid", validation: { pattern: /^[A-Za-z]+$/i } },
            },
            {
              inline: true,
              label: "Description",
              isMandatory: false,
              key: "description",
              type: "text",
              disable: false,
              populators: { name: "description" },
            },
            {
              inline: true,
              label: "Unit Rate",
              isMandatory: false,
              key: "unitRate",
              type: "number",
              disable: false,
              populators: {
                  prefix: "₹ ",
                  name: "amountInRs",
                  error: "PROJECT_PATTERN_ERR_MSG_PROJECT_ESTIMATED_COST",
                  validation: {
                    pattern: "^[1-9]\\d*(\\.\\d+)?$",
                    maxlength : 16,
                    step : "0.01",
                    min : 0,
                    max : 5000000
                  }
                }
            },
            {
              inline: true,
              label: "No of units",
              isMandatory: false,
              key: "noOfunit",
              type: "number",
              disable: false,
              populators: { name: "noOfunit", error: " Invalid ", validation: { min: 0, max: 9999999999 } },
            },
            {
              inline: true,
              label: "UOM",
              isMandatory: false,
              key: "uom",
              type: "text",
              disable: false,
              populators: { name: "uom", error: "Invalid", validation: { pattern: /^[A-Za-z]+$/i } },
            },
            {
              inline: true,
              label: "Length",
              isMandatory: false,
              key: "length",
              type: "number",
              disable: false,
              populators: { name: "length", error: " Invalid ", validation: { min: 0, max: 9999999999 } },
            },
            {
              inline: true,
              label: "Width",
              isMandatory: false,
              key: "width",
              type: "number",
              disable: false,
              populators: { name: "width", error: " Invalid ", validation: { min: 0, max: 9999999999 } },
            },
          ]
        },
      },
    ],
  },
];
