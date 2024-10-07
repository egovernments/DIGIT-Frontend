export const setupMasterConfig = (existingUser = false) => ({
  tenantId: "pg",
  moduleName: "commonUiConfig",
  SetupMaster: [
    {
      header: "COMPLAINT_MANAGEMENT",
      module: "PGR",
      active: true,
      description: "COMPLAINT_MANAGEMENT_DESCRIPTION",
      masterDescription: "COMPLAINT_MANAGEMENT_SETUP_MASTER_DESCRIPTION",
      actionText: existingUser ? "EDIT_NOW" : "SETUP_NOW",
      features: [
        {
          id: 1,
          name: "COMPLAINT_MANAGEMENT_REGISTRATION_LOGIN_CREATION",
        },
        {
          id: 2,
          name: "COMPLAINT_MANAGEMENT_LODGING_FILE",
        },
        {
          id: 3,
          name: "COMPLAINT_MANAGEMENT_ASSIGNING_COMPLAINT",
        },
        {
          id: 4,
          name: "COMPLAINT_MANAGEMENT_RESOLVING_COMPLAINT",
        },
        {
          id: 5,
          name: "COMPLAINT_MANAGEMENT_MANAGE_COMPLAINTS",
        },
        {
          id: 6,
          name: "COMPLAINT_MANAGEMENT_TRACK_COMPLAINTS",
        },
        {
          id: 7,
          name: "COMPLAINT_MANAGEMENT_DASHBOARD_REPORTS",
        },
      ],
    },
    {
      header: "HCM",
      module: "HCM",
      active: true,
      description: "HCM_DESCRIPTION",
      masterDescription: "HCM_SETUP_MASTER_DESCRIPTION",
      actionText: existingUser ? "EDIT_NOW" : "SETUP_NOW",
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
      masterDescription: "HRMS_SETUP_MASTER_DESCRIPTION",
      actionText: existingUser ? "EDIT_NOW" : "SETUP_NOW",
      features: [
        {
          id: 1,
          name: "HRMS_REGISTRATION_LOGIN_CREATION",
        },
        {
          id: 2,
          name: "HRMS_MODIFY_EMPLOYEE",
        },
        {
          id: 3,
          name: "HRMS_VIEW_EMPLOYEE",
        },
        {
          id: 4,
          name: "HRMS_EDIT_EMPLOYEE",
        },
        {
          id: 5,
          name: "HRMS_DELETE_EMPLOYEE",
        },
      ],
    },
  ],
});
