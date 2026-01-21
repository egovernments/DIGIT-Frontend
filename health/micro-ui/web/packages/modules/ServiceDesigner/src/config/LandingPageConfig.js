const LandingPageConfig = [
  {
    type: "Header",
    text: "STUDIO_CREATE_NEW_SERVICE_GROUP_HEADER",
  },
  {
    type: "SubHeader",
    text: "STUDIO_CREATE_NEW_SERVICE_GROUP_SUB_HEADER",
  },
  {
    type: "SectionHeader",
    text: "STUDIO_CREATE_NEW_SERVICE_SECTION_HEADER_1",
  },
  {
    type: "ToggleGroup",
    name: "serviceGroupToggle",
    options: [
      { code: "Published", name: "Published", i18nKey: "STUDIO_TOGGLE_PUBLISH" },
      { code: "Drafts", name: "Drafts", i18nKey: "STUDIO_TOGGLE_DRAFTS" },
    ],
    default: "Published",
  },
  {
    type: "CardGroup",
    dataKey: "templates",
    toggleData: true
  },
  {
    type: "SectionHeader",
    text: "STUDIO_CREATE_NEW_SERVICE_SECTION_HEADER_2",
  },
  {
    type: "CardGroup",
    dataKey: "templates"
  }
];

export default LandingPageConfig;