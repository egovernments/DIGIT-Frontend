import { EstimateDetailsComponent } from "../components/EstimateDetailsComponent";

export const estimateConfig = [
  {
    head: "Create Estimate",
    body: [
      {
        inline: true,
        label: "Proposal date",
        isMandatory: false,
        key: "proposalDate",
        // type: "date",
        type: "number",
        disable: false,
        populators: { name: "proposalDate", error: "Required" },
      },
      {
        inline: true,
        label: "Status",
        isMandatory: false,
        key: "status",
        type: "dropdown",
        disable: false,
        populators: {
          name: "status",
          error: "Required",
          optionsKey: "name", // without this it was not populating options
          required: "true",
          options: [
            {
              name: "In status",
              label: "Status",
            },
            {
              name: "Completed",
              label: "Status", //Doubt
            },
          ],
        },
      },
      {
        isMandatory: true,
        key: "wfStatus",
        type: "dropdown",
        label: "Enter Workflow Status",
        disable: false,
        populators: {
          name: "wfStatus",
          error: "Required",
          optionsKey: "name", // without this it was not populating options
          required: "true",
          options: [
            {
              name: "APPLIED",
              // label: "Wf-Status",
            },
            {
              name: "PENDING",
              // label: "Wf-Status", //Doubt
            },
            {
              name: "APPROVED",
              // label: "Wf-Status", //Doubt
            },
          ],
        },
      },

      {
        inline: true,
        label: "Name",
        isMandatory: false,
        key: "name",
        type: "text",
        disable: false,
        populators: { name: "name", error: "Required" },
      },

      {
        inline: true,
        label: "Description",
        isMandatory: false,
        key: "description",
        type: "text",
        disable: false,
        populators: { name: "description", error: "Required" },
      },

      {
        inline: true,
        label: "Executing Department",
        isMandatory: false,
        key: "executingDepartment",
        type: "dropdown",
        disable: false,
        populators: {
          name: "executingDepartment",
          error: "Required",
          optionsKey: "name", // without this it was not populating options
          required: "true",
          options: [
            {
              name: "Department1",
              // label: "Executing Department",
            },
            {
              name: "Department2",
              // label: "Executing Department", //Doubt
            },
          ],
        },
      },
    ],
  },
  // {
  //   head: "Address",
  //   key: "address",
  //   body: [
  //     {
  //       inline: true,
  //       label: "Tenant Id",
  //       isMandatory: true,
  //       key: "tenantid",
  //       type: "number",
  //       disable: false,
  //       populators: { name: "tenantid", error: "Required " },
  //     },
  //     {
  //       inline: true,
  //       label: "Longitude",
  //       isMandatory: true,
  //       key: "longitude",
  //       type: "number",
  //       disable: false,
  //       populators: { name: "longitude", error: "Required ", validation: { min: -180, max: 180 } },
  //     },
  //     {
  //       inline: true,
  //       label: "Latitude",
  //       isMandatory: true,
  //       key: "latitude",
  //       type: "number",
  //       disable: false,
  //       populators: { name: "latitude", error: "Required ", validation: { min: -90, max: 90 } },
  //     },

  //     {
  //       inline: true,
  //       label: "City",
  //       isMandatory: true,
  //       key: "city",
  //       type: "text",
  //       disable: false,
  //       populators: { name: "city", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
  //     },
  //   ],
  // },

  {
    head: "Address Details",
    key: "address",
    body: [
      {
        isMandatory: false,
        key: "address",
        type: "component", // for custom component
        component: "AddressDetailsComponent", // name of the component as per component registry
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: {
          name: "addressDetails",
          required: true,
        },
      },
    ],
  },

  {
    head: "Estimate Details",
    key: "estimateDetails",
    body: [
      {
        isMandatory: false,
        key: "estimateDetails",
        type: "component", // for custom component
        component: "EstimateDetailsComponent", // name of the component as per component registry
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: {
          name: "estimateDetails",
          required: true,
        },
      },
    ],
  },
];
