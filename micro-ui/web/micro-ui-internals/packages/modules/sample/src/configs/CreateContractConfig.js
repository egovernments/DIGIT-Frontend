export const newConfig = [
    {
      head: "Create Contract",
      body: [
        {
          inline: true,
          label: "Name",
          isMandatory: true,
          key: "Name",
          type: "text",
          disable: false,
          populators: { name: "Name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "executingAuthority",
          isMandatory: false,
          key: "executingAuthority",
          type: "text",
          disable: false,
          populators: { name: "executingAuthority", error: "Required" },
        },
        {
            inline: true,
            label: "contractType",
            isMandatory: false,
            key: "contractType",
            type: "text",
            disable: false,
            populators: { name: "contractType", error: "Required" },
          },

        {
            inline: true,
            label: "totalContractedAmount",
            isMandatory: false,
            key: "totalContractedAmount",
            type: "number",
            disable: false,
            populators: { name: "totalContractedAmount", error: "Required" },
        },

        {
            inline: true,
            label: "completionPeriod",
            isMandatory: false,
            key: "completionPeriod",
            type: "number",
            disable: false,
            populators: { name: "completionPeriod", error: "Required" },
        },

        {
            //label: "Line Items",
            // key: "NewDetails",
            // body: [
            //   {
                key: "NewDetails",
                type: "component", // for custom component
                component: "NewComponent", // name of the component as per component registry
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                  name: "NewDetails",
                  required: true,
                },
        },

        {
            //head: "Additional Details",
            // key: "NewDetails",
            // body: [
            //   {
                isMandatory: false,
                key: "documents",
                type: "component", // for custom component
                component: "NewDetailsDocument", // name of the component as per component registry
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                  name: "documents",
                  required: true,
                },
        },
        

        {

                isMandatory: false,
                key: "additionalDetails",
                type: "component", // for custom component
                component: "AdditionalDetails", // name of the component as per component registry
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                  name: "additionalDetails",
                  required: true,
                },
        },
      ],
    },
    // {
    //     head: "Additional",
    //     body: [
    //         {

    //                 isMandatory: false,
    //                 key: "additionalDetails2",
    //                 type: "component", // for custom component
    //                 component: "AdditionalDetails", // name of the component as per component registry
    //                 withoutLabel: true,
    //                 disable: false,
    //                 customProps: {},
    //                 populators: {
    //                   name: "additionalDetails2",
    //                   required: true,
    //                 },
    //         },
    //     ]
    // }

  ];
  