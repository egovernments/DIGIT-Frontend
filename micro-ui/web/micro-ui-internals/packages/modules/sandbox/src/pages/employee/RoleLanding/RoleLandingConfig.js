import { People } from "@egovernments/digit-ui-svg-components";

export const externalConfig = [
    {
        type:"link",
        url:"https://www.youtube.com/watch?v=IBJDxxP3rDc"
    },
  {
    type: "text",
    heading: "ROLE_LANDING_ROLE_SECTION_ONE", // localization key for "Select a Role"
    paragraphs: [
      "ROLE_LANDING_SELECT_ROLE_PARAGRAPH_1", // localization key for the first paragraph
      "ROLE_LANDING_SELECT_ROLE_PARAGRAPH_2"  // localization key for the second paragraph
    ],
    steps: [
      { description: "ROLE_LANDING_STEP_1" }, // localization key for step 1
      { description: "ROLE_LANDING_STEP_2" }  // localization key for step 2
    ]
  },
  {
    type: "text",
    heading: "ROLE_LANDING_ROLE_SECTION_TWO", // localization key for "Another Role Section"
    paragraphs: [
      "ROLE_LANDING_ANOTHER_ROLE_PARAGRAPH_1", // localization key for the first paragraph  // localization key for the second paragraph
    ],
    steps: [
      { description: "ROLE_LANDING_ANOTHER_ROLE_STEP_1" }, // localization key for step 1
      { description: "ROLE_LANDING_ANOTHER_ROLE_STEP_2" },
      { description: "ROLE_LANDING_ANOTHER_ROLE_STEP_3" },
      { description: "ROLE_LANDING_ANOTHER_ROLE_STEP_4" },  // localization key for step 2
    ]
  },
  {
    type: "text",
    heading: "ROLE_LANDING_ROLE_SECTION_THREE", // localization key for "Another Role Section"
    paragraphs: [
      "ROLE_LANDING_THREE_PARAGRAPH_1", // localization key for the first paragraph  // localization key for the second paragraph
    ],
    steps: [
      { description: "ROLE_LANDING_THREE_ROLE_STEP_1" }, // localization key for step 1
      { description: "ROLE_LANDING_THREE_ROLE_STEP_2" },
      { description: "ROLE_LANDING_THREE_ROLE_STEP_3" },
      { description: "ROLE_LANDING_THREE_ROLE_STEP_4" },  // localization key for step 2
    ]
  },
  {
    type: "card",
    icon: People, // replace with actual icon if needed
    heading: "ROLE_LANDING_CITIZEN", // localization key for "Citizen"
    description: "ROLE_LANDING_CITIZEN_DESCRIPTION", // localization key for the description
    buttonName: "ROLE_LANDING_CITIZEN_BUTTON", // localization key for the button label
    action: "/citizen/login"
  },
  {
    type: "card",
    icon: People, // replace with actual icon if needed
    heading: "ROLE_LANDING_GOV_ADMIN", // localization key for "Government Administrator"
    description: "ROLE_LANDING_GOV_ADMIN_DESCRIPTION", // localization key for the description
    buttonName: "ROLE_LANDING_GOV_ADMIN_BUTTON", // localization key for the button label
    action: "/employee"
  }
];
