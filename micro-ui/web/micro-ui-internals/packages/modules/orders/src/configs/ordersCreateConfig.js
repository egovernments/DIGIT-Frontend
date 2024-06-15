export const configs = [
  {
 head: "Order 1",   
  body: [
    {
      isMandatory: true,
      key: "Order Type",
      type: "dropdown",
      label: "order type",
      disable: false,
      populators: {
        name: "genders",
        optionsKey: "name",
        error: "required ",
        mdmsConfig: {
          masterName: "OrderType",
          moduleName: "Order",
          localePrefix: "ORDER_TYPE",
        },
      },
    },
    // {
    //   isMandatory: true,
    //   key: "Document Type",
    //   type: "dropdown",
    //   label: "document type",
    //   disable: false,
    //   populators: {
    //     name: "genders",
    //     optionsKey: "name",
    //     error: "required ",
    //     mdmsConfig: {
    //       masterName: "GenderType",
    //       moduleName: "common-masters",
    //       localePrefix: "COMMON_GENDER",
    //     },
    //   },
    // },
    // {
    //   isMandatory: true,
    //   key: "Party / parties to make submission",
    //   type: "dropdown",
    //   label: "Order for document Submission",
    //   disable: false,
    //   populators: {
    //     name: "genders",
    //     optionsKey: "name",
    //     error: "required ",
    //     mdmsConfig: {
    //       masterName: "GenderType",
    //       moduleName: "common-masters",
    //       localePrefix: "COMMON_GENDER",
    //     },
    //   },
    // },
    //   {
    //     inline: true,
    //     label: "deadline for submission",
    //     isMandatory: false,
    //     key: "dob",
    //     type: "date",
    //     disable: false,
    //     populators: { name: "dob", error: "Required"},
    //   },

    //   {
    //     label: "Additional notes",
    //     isMandatory: true,
    //     key: "phno",
    //     type: "number",
    //     disable: false,
    //     populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
    //   },
    ],
  },
];

export const configsCreateOrderSchedule = [
  {
    head: "Order 1",
    defaultValues:{
     orderType:{
      "id": 8,
      "type": "NEXT_HEARING",
      "isactive": true,
      "code": "NEXT_HEARING"
    }
 },    
     body: [
       {
         isMandatory: true,
         key: "Order Type",
         type: "dropdown",
         label: "ORDER_TYPE",
         disable: true,
         populators: {
           name: "orderType",
           optionsKey: "code",
           error: "required ",
           mdmsConfig: {
             masterName: "OrderType",
             moduleName: "Order",
             localePrefix: "ORDER_TYPE",
           },
         },
       },
       {
        isMandatory: true,
        key: "Hearing Type",
        type: "dropdown",
        label: "HEARING_TYPE",
        disable: false,
        populators: {
          name: "hearingType",
          optionsKey: "code",
          error: "required ",
          mdmsConfig: {
            masterName: "HearingType",
            moduleName: "Hearing",
            localePrefix: "HEARING_TYPE",
          },
        },
      },
      {
        isMandatory: true,
        key: "Parties to Attend",
        type: "dropdown",
        label: "PARTIES_TO_ATTEND",
        disable: false,
        populators: {
          name: "hearingType",
          optionsKey: "code",
          error: "required ",
          mdmsConfig: {
            masterName: "HearingType",
            moduleName: "Hearing",
            localePrefix: "HEARING_TYPE",
          },
        },
      },
       {
         inline: true,
         label: "DATE_OF_HEARING",
         isMandatory: true,
         key: "doh",
         type: "date",
         disable: false,
         populators: { name: "doh", error: "Required"},
       },
       {
        inline: true,
        label: "Purpose of Hearing",
        isMandatory: true,
        description: "",
        type: "textarea",
        disable: false,
        populators: { name: "purpose", error: "Error!" },
      },
      {
        inline: true,
        label: "Additional notes (optional)",
        isMandatory: true,
        description: "",
        type: "textarea",
        disable: false,
        populators: { name: "additionalNotes", error: "Error!" },
      },
       ],
     },
  ];

  export const configsCreateOrderWarrant = [
    {
   head: "Order 1",
   defaultValues:{
    orderType:{
      "id": 5,
      "type": "WARRANT",
      "isactive": true,
      "code": "WARRANT"
    }
},    
    body: [
      {
        isMandatory: true,
        key: "Order Type",
        type: "dropdown",
        label: "ORDER_TYPE",
        disable: true,
        populators: {
          name: "orderType",
          optionsKey: "code",
          error: "required ",
          mdmsConfig: {
            masterName: "OrderType",
            moduleName: "Order",
            localePrefix: "ORDER_TYPE",
          },
        },
      },
      {
        inline: true,
        label: "DATE_OF_HEARING",
        isMandatory: true,
        key: "doh",
        type: "date",
        disable: false,
        populators: { name: "doh", error: "Required"},
      },
      {
        isMandatory: true,
        key: "Warrant For",
        type: "dropdown",
        label: "WARRANT_FOR_PARTY",
        disable: false,
        populators: {
          name: "warrantFor",
          optionsKey: "code",
          error: "required ",
          mdmsConfig: {
            masterName: "OrderType",
            moduleName: "Order",
            localePrefix: "ORDER_TYPE",
          },
        },
      },
      {
        isMandatory: true,
        key: "Warrant Type",
        type: "dropdown",
        label: "WARRANT_TYPE",
        disable: false,
        populators: {
          name: "warrantType",
          optionsKey: "code",
          error: "required ",
          mdmsConfig: {
            masterName: "OrderType",
            moduleName: "Order",
            localePrefix: "ORDER_TYPE",
          },
        },
      },
      {
        isMandatory: true,
        type: "radio",
        key: "bailable",
        label: "Is this a bailable warrant?",
        disable: false,
        populators: {
          name: "bailable",
          optionsKey: "name",
          error: "Error!",
          required: false,
          options: [
            {
              code: "Yes",
              name: "ES_COMMON_YES",
            },
            {
              code: "No",
              name: "ES_COMMON_NO",
            }
          ],
        },
      },
      // {
      //   isMandatory: true,
      //   key: "Document Type",
      //   type: "dropdown",
      //   label: "document type",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "required ",
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
      // {
      //   isMandatory: true,
      //   key: "Party / parties to make submission",
      //   type: "dropdown",
      //   label: "Order for document Submission",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "required ",
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
        // {
        //   inline: true,
        //   label: "deadline for submission",
        //   isMandatory: false,
        //   key: "dob",
        //   type: "date",
        //   disable: false,
        //   populators: { name: "dob", error: "Required"},
        // },

      //   {
      //     label: "Additional notes",
      //     isMandatory: true,
      //     key: "phno",
      //     type: "number",
      //     disable: false,
      //     populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
      //   },
      ],
    },
  ];

  export const configsCreateOrderSummon = [
    {
      head: "Order 1",
      defaultValues:{
       orderType:{
        "id": 4,
        "type": "SUMMONS",
        "isactive": true,
        "code": "SUMMONS"
      }
   },    
       body: [
         {
           isMandatory: true,
           key: "Order Type",
           type: "dropdown",
           label: "ORDER_TYPE",
           disable: true,
           populators: {
             name: "orderType",
             optionsKey: "code",
             error: "required ",
             mdmsConfig: {
               masterName: "OrderType",
               moduleName: "Order",
               localePrefix: "ORDER_TYPE",
             },
           },
         },
         {
          inline: true,
          label: "DATE_OF_HEARING",
          isMandatory: true,
          key: "doh",
          type: "date",
          disable: false,
          populators: { name: "doh", error: "Required"},
        },
        {
          isMandatory: true,
          key: "Parties to SUMMON",
          type: "dropdown",
          label: "PARTIES_TO_SUMMON",
          disable: false,
          populators: {
            name: "partyToSummon",
            optionsKey: "code",
            error: "required ",
            mdmsConfig: {
              masterName: "HearingType",
              moduleName: "Hearing",
              localePrefix: "HEARING_TYPE",
            },
          },
        },
        {
          isMandatory: false,
          key: "deliveryChannels",
          type: "component", // for custom component
          component: "DeliveryChannels", // name of the component as per component registry
          withoutLabel: true,
          disable: false,
          customProps: {},
          populators: {
            name: "deliveryChannels",
            required: true,
          },
        },
         ],
       },
  ];

  export const configsCreateOrderReIssueSummon = [
    {
   head: "Order 1",   
    body: [
      {
        isMandatory: true,
        key: "Order Type",
        type: "dropdown",
        label: "order type",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "OrderType",
            moduleName: "Order",
            localePrefix: "ORDER_TYPE",
          },
        },
      },
      // {
      //   isMandatory: true,
      //   key: "Document Type",
      //   type: "dropdown",
      //   label: "document type",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "required ",
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
      // {
      //   isMandatory: true,
      //   key: "Party / parties to make submission",
      //   type: "dropdown",
      //   label: "Order for document Submission",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "required ",
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
      //   {
      //     inline: true,
      //     label: "deadline for submission",
      //     isMandatory: false,
      //     key: "dob",
      //     type: "date",
      //     disable: false,
      //     populators: { name: "dob", error: "Required"},
      //   },

      //   {
      //     label: "Additional notes",
      //     isMandatory: true,
      //     key: "phno",
      //     type: "number",
      //     disable: false,
      //     populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
      //   },
      ],
    },
  ];