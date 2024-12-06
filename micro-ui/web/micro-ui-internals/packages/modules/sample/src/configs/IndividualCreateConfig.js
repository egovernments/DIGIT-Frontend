export const newConfig = [
  {
    head: "Complaints Details",
    body: [
      {
        isMandatory: true,
        key: "complainType",
        type: "dropdown",
        label: "Complain Type",
        disable: false,
        populators: {
          name: "complainType",
          optionsKey: "serviceCode",
          error: "required ",
          mdmsConfig: {
            masterName: "ServiceDefs",
            moduleName: "RAINMAKER-PGR",
            localePrefix: "serviceCode",
          },
        },
      },
      {
        inline: true,
        label: "Date of complaint",
        isMandatory: false,
        key: "dob",
        type: "date",
        disable: false,
        populators: { name: "dob", error: "Required" },
      },
      {
        isMandatory: true,
        key: "Administrative",
        type: "dropdown",
        label: "Administrative Area",
        disable: false,
        populators: {
          name: "Administrative",
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
        label: "Are you raising complaint for yourself",
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
      // {
      //   isMandatory: false,
      //   key: "locality",
      //   type: "dropdown",
      //   label: "Enter locality",
      //   disable: false,
      //   populators: {
      //     name: "locality",
      //     optionsKey: "name",
      //     error: " Required",
      //     required: true,

      //     options: [
      //       {
      //         code: "SUN01",
      //         name: "Ajit Nagar - Area1",
      //         label: "Locality",
      //         latitude: "31.63089",
      //         longitude: "74.871552",
      //         area: "Area1",
      //         pincode: [143001],
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN02",
      //         name: "Back Side 33 KVA Grid Patiala Road",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area1",
      //         pincode: [143001],
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN03",
      //         name: "Bharath Colony",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area1",
      //         pincode: [143001],
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN10",
      //         name: "Backside Brijbala Hospital - Area3",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area3",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN11",
      //         name: "Bigharwal Chowk to Railway Station - Area2",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area2",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN12",
      //         name: "Chandar Colony Biggarwal Road - Area2",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area2",
      //         pincode: [143001],
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN20",
      //         name: "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area3",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN21",
      //         name: "ATAR SINGH COLONY - Area2",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area2",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN22",
      //         name: "Back Side Naina Devi Mandir - Area2",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area2",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN30",
      //         name: "Bakhtaur Nagar - Area1",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area1",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN31",
      //         name: "Bhai Mool Chand Sahib Colony - Area1",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area1",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN32",
      //         name: "College Road (Southern side) - Area2",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area2",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //       {
      //         code: "SUN33",
      //         name: "Ekta Colony (Southern Side) - Area1",
      //         label: "Locality",
      //         latitude: null,
      //         longitude: null,
      //         area: "Area1",
      //         pincode: null,
      //         boundaryNum: 1,
      //         children: [],
      //       },
      //     ],
      //   },
      // },

      {
        inline: true,
        label: "Supervisor's name",
        isMandatory: true,
        key: "SupervisorsName",
        type: "text",
        disable: false,
        populators: { name: "SupervisorsName", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        label: "Supervisor's contact number",
        isMandatory: true,
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