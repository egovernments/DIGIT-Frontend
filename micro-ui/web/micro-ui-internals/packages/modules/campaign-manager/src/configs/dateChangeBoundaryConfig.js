export const dateChangeBoundaryConfig = [
  {
    body: [
      {
        type: "component",
        component: "DateWithBoundary",
        withoutLabel: true,
        withoutLabelFieldPair: true,
        key: "dateWithBoundary",
        validation: {},
        populators: {
          validation: {},
        },
        customProps: {
          module: "Campaign",
        },
      },
      // {
      //   type: "component",
      //   component: "UpdateCampaignDates",
      //   withoutLabel: true,
      //   key: "campaignDates",
      //   validation: {},
      //   populators: {
      //     validation: {},
      //   },
      //   customProps: {
      //     module: "Campaign",
      //   },
      // },
    ],
  },
];
