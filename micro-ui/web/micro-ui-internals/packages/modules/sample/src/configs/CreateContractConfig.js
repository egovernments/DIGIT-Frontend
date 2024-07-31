export const contractConfig = [
    {
      head: "Create Contract",
      body: [
        {
          inline: true,
          label: "Name",
          isMandatory: false,
          key: "estimatename",
          type: "text",
          disable: false,
          populators: { name: "estimatename", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Executing Authority",
          isMandatory: false,
          key: "executingauthority",
          type: "text",
          disable: false,
          populators: { name: "executingauthority", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Contract Type",
          isMandatory: false,
          key: "contracttype",
          type: "text",
          disable: false,
          populators: { name: "contracttype", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Total Contracted Amount",
          isMandatory: false,
          key: "totalContractedAmount",
          type: "amount",
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
          label: "Completion Period",
          isMandatory: false,
          key: "completionperiod",
          type: "number",
          disable: false,
          populators: { name: "completionperiod", error: "Required" } //, validation: { pattern: /^[A-Za-z]+$/i } },
        },
  
      ],
    },
    {
      head: "Documents",
      key: "Documents",
      body: [
        {
          inline: true,
          label: "Document Type",
          isMandatory: true,
          key: "documentType",
          type: "text",
          disable: false,
          populators: { name: "documentType", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "File Store",
          isMandatory: true,
          key: "fileStore",
          type: "text",
          disable: false,
          populators: { name: "fileStore", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
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
          label: "Additional Details",
          isMandatory: true,
          key: "additionalDetails",
          type: "text",
          disable: false,
          populators: { name: "additionalDetails", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
      ],
    },
    {
      head: "Additional Details",
      key: "additionalDetails",
      body: [
        {
          inline: true,
          label: "Officer in charge Code",
          isMandatory: true,
          key: "officerInChargeCode",
          type: "text",
          disable: false,
          populators: { name: "officerInChargeCode", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Officer in charge Name",
          isMandatory: true,
          key: "officerInChargeName",
          type: "text",
          disable: false,
          populators: { name: "officerInChargeName", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Officer in charge designation",
          isMandatory: true,
          key: "officerInChargeDesgn",
          type: "text",
          disable: false,
          populators: { name: "officerInChargeDesgn", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Total Estimated Amount",
          isMandatory: true,
          key: "totalEstimatedAmount",
          type: "amount",
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
        // {
        //   isMandatory: false,
        //   key: "additionalDetails",
        //   type: "component", // for custom component
        //   component: "SampleAdditionalComponent", // name of the component as per component registry
        //   withoutLabel: true,
        //   disable: false,
        //   customProps: {},
        //   populators: {
        //     name: "additionalDetails",
        //     required: true,
        //   },
        // }
      ],
    },
  ];
  