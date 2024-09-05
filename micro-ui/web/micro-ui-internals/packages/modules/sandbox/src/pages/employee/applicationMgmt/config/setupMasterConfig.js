export const setupMasterConfig = {
  tenantId: "pg",
  moduleName: "commonUiConfig",
  SetupMaster: [
    {
      header: "COMPLAINT_MANAGEMENT",
      module: "PGR",
      active: true,
      description: "COMPLAINT_MANAGEMENT_DESCRIPTION",
      actionText: "SETUP_NOW",
      features: [
        {
          id: 1,
          name: "COMPLAINT_MANAGEMENT_REGISTRATION",
        },
        {
          id: 2,
          name: "COMPLAINT_MANAGEMENT_FEATURE_LOGIN_CREATION",
        },
        {
          id: 3,
          name: "COMPLAINT_MANAGEMENT_LODGING_FILE",
        },
        {
          id: 4,
          name: "COMPLAINT_MANAGEMENT_ASSIGNING_COMPLAINT",
        },
        {
          id: 5,
          name: "COMPLAINT_MANAGEMENT_RESOLVING_COMPLAINT",
        },
        {
          id: 6,
          name: "COMPLAINT_MANAGEMENT_MANAGE_COMPLAINTS",
        },
        {
          id: 7,
          name: "COMPLAINT_MANAGEMENT_TRACK_COMPLAINTS",
        },
        {
          id: 8,
          name: "COMPLAINT_MANAGEMENT_DASHBOARD_REPORTS",
        },
      ],
    },
    {
      header: "HCM",
      module: "HCM",
      active: true,
      description: "HCM_DESCRIPTION",
      actionText: "SETUP_NOW",
      features: [
        {
          id: 1,
          name: "HCM_FEATURE_1",
        },
      ],
    },
    {
      header: "HRMS",
      module: "HRMS",
      active: true,
      description: "HRMS_DESCRIPTION",
      actionText: "SETUP_NOW",
      features: [
        {
          id: 1,
          name: "HRMS_REGISTRATION",
        },
        {
          id: 2,
          name: "HRMS_LOGIN_CREATION",
        },
      ],
    },
  ],
};
