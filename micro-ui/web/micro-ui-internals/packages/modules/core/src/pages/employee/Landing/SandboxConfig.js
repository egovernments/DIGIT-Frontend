export const sandboxConfig = {
  heading: "SANDBOX_HEADING", // Localization key for the main heading
  url: "https://www.youtube.com/watch?v=1ZLdetJwfeY",
  subsections: [
    {
      title: "SANDBOX_INTRODUCTION_TITLE", // Localization key for "Introduction"
      type: "paragraph",
      content: [
        {
          text: "SANDBOX_INTRODUCTION_TEXT", // Localization key for the introduction text
        },
      ],
    },
    {
      title: "SANDBOX_PRODUCTS_TITLE", // Localization key for "Products"
      type: "paragraph",
      content: [
        {
          text: "SANDBOX_PRODUCTS_TEXT", // Localization key for the first line in "Products"
        },
        {
          text: "SANDBOX_COMPLAINTS_DESCRIPTION", // Localization key for "Complaints" description
        },
        {
          text: "SANDBOX_CAMPAIGNS_DESCRIPTION", // Localization key for "Campaigns" description
        },
      ],
    },
    {
      title: "SANDBOX_USER_CAPABILITIES_TITLE", // Localization key for "User Capabilities"
      type: "steps",
      content: [
        {
          id: 1,
          text: "USER_CAPABILITIES_STEP_1", // Localization key for the first user capability step
        },
        {
          id: 2,
          text: "USER_CAPABILITIES_STEP_2", // Localization key for the second user capability step
        },
        {
          id: 3,
          text: "USER_CAPABILITIES_STEP_3", // Localization key for the third user capability step
        },
        {
          id: 4,
          text: "USER_CAPABILITIES_STEP_4", // Localization key for the fourth user capability step
        },
        {
          id: 5,
          text: "USER_CAPABILITIES_STEP_5", // Localization key for the fifth user capability step
        },
      ],
    },
  ],
};
