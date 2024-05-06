export const tourSteps = (t) => {

  return {
    microplanDetails: {
      name: "microplanDetails",
      run: true,
      steps: [
        {
          content: t("Idk either ok?"),
          target: ".microplan-campaign-detials",
          disableBeacon: true,
          placement: "bottom",
          title: "",
        },
        {
          content: t("This, this i know. This is where you name your microplan ok?"),
          target: ".microplan-name",
          disableBeacon: true,
          placement: "bottom",
          title: "",
        },
      ],
      tourActive: true,
    },
    upload: {
      name: "upload",
      run: true,
      steps: [
        {
          content: t("HELP_UPLOAD_FILETYPE_OPTION_CONTAINER"),
          target: ".upload-option-container",
          disableBeacon: true,
          placement: "top-end",
          title: "",
        }
      ],
      tourActive: true,
    },
    hypothesis: {
      name: "hypothesis",
      run: true,
      steps: [
        {
          content:
            t("HELP_HYPOTHESIS_INTERACTABLE_SECTION"),
          target: ".user-input-section",
          disableBeacon: true,
          placement: "top-start",
          title: "",
        },
        {
          content:
            t("HELP_HYPOTHESIS_ADD_BUTTON"),
          target: ".add-button",
          disableBeacon: true,
          placement: "top-end",
          title: "",
        },
        {
          content:
            t("HELP_HYPOTHESIS_DELETE_BUTTON"),
          target: ".select-and-input-wrapper-first .delete-button",
          disableBeacon: true,
          placement: "left-start",
          title: "",
        },        
      ],
      tourActive: true,
    },
    ruleEngine: {
      name: "ruleEngine",
      run: true,
      steps: [
        {
          content:
            t("HELP_RULE_ENGINE_INTERACTABLE_SECTION"),
          target: ".rule-engine-section",
          disableBeacon: true,
          placement: "top-start",
          title: "",
        },
        {
          content:
            t("HELP_RULE_ENGINE_INPUT"),
          target: ".user-input-section .interactable-section .select-and-input-wrapper-first .input",
          disableBeacon: true,
          placement: "top-end",
          title: "",
        },
        {
          content:
            t("HELP_RULE_ENGINE_ADD_BUTTON"),
          target: ".add-button",
          disableBeacon: true,
          placement: "top-end",
          title: "",
        },
        {
          content:
            t("HELP_RULE_ENGINE_DELETE_BUTTON"),
          target: ".select-and-input-wrapper-first .delete-button",
          disableBeacon: true,
          placement: "left-start",
          title: "",
        },        
      ],
      tourActive: true,
    },
    mapping: {
      name: "mapping",
      run: true,
      steps: [
        {
          content:
            t("HELP_MAPPING_BOUNDARY_SELECTION"),
          target: ".filter-by-boundary .button-primary",
          disableBeacon: true,
          placement: "right-start",
          title: "",
        },
        {
          content:
            t("HELP_MAPPING_BASE_MAP"),
          target: ".base-map-selector",
          disableBeacon: true,
          placement: "right-start",
          title: "",
        }
      ],
      tourActive: true,
    },
  };
};
