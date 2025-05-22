/**
 * config for campaign assignment screen: contains the custom component for the screen.
 * digit components used:CardLabel, Dropdown, LabelFieldPair, Loader, DatePicker, TextInput.
 * 
 */

export const campaignAssignmentConfig = [
  {
    head: "HR_CAMPAIGN_ASSIGNMENT_HEADER",
    body: [
      {
        type: "component",
        component: "CampaignsAssignment",
        key: "CampaignsAssignment",
        withoutLabel: true,
        populators: {
          name: "CampaignsAssignment",
        },
      },
    ],
  },
];
