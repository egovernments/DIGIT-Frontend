export const setupMasterConfig = {
  tenantId: "pg",
  moduleName: "commonUiConfig",
  SetupMaster: [
    {
      header: "COMPLAINT_MANAGEMENT",
      module: "PGR",
      active: true,
      description: "COMPLAINT_MANAGEMENT_DESCRIPTION",
      masterDescription: "COMPLAINT_MANAGEMENT_SETUP_MASTER_DESCRIPTION",
      actionText: "SETUP_NOW",
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
      masterDescription: "HRMS_SETUP_MASTER_DESCRIPTION",
      actionText: "SETUP_NOW",
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
      ],
    },
    {
      header: "TENANT_MANAGEMENT_INFO",
      subHeader:"new subheader",
      module: "TENANT_MANAGEMENT_INFO",
      active: true,
      description: "TENANT_MANAGEMENT_DESCRIPTION",
      masterDescription: "TENANT_MANAGEMENT_DESCRIPTION",
      actionText: "SETUP_NOW",
      add_organization: [
        {
          id: 1,
          name: "TENANT_CLICK_ORGANIZATION_CREATE",
        },
        {
          id: 2,
          name: "TENANT_ENTER_DETAILS",
        },
        {
          id: 3,
          name: "TENANT_SUBMIT_DETAILS",
        },
      ],
      view_organization: [
        {
          id: 1,
          name: "TENANT_CLICK_ORGANIZATION_SEARCH",
        },
        {
          id: 2,
          name: "TENANT_ORGANIZAZATION_LIST",
        },
        {
          id: 3,
          name: "TENANT_ORGANIZATION_ROW_VIEW",
        },
      ],
      edit_organization: [
        {
          id: 1,
          name: "TENANT_CLICK_ORGANIZATION_SEARCH",
        },
        {
          id: 2,
          name: "TENANT_LIST_DISPLAYED",
        },
        {
          id: 3,
          name: "TENANT_CHANGE_STATUS",
        },
      ],
    },
  ],
};
