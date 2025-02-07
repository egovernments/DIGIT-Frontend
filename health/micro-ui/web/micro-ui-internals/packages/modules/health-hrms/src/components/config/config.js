export const newConfig = [
  {
    head: "HR_LOGIN_DETAILS_HEADER",
    body: [
      {
        type: "component",
        component: "SelectEmployeeId",
        key: "SelectEmployeeId",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectEmployeePassword",
        key: "SelectEmployeePassword",
        withoutLabel: true,
      },
    ],
  },
  {
    head: "HR_PERSONAL_DETAILS_HEADER",
    body: [
      {
        type: "component",
        component: "SelectEmployeeName",
        key: "SelectEmployeeName",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectEmployeePhoneNumber",
        key: "SelectEmployeePhoneNumber",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectEmployeeGender",
        key: "SelectEmployeeGender",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectDateofBirthEmployment",
        key: "SelectDateofBirthEmployment",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectEmployeeEmailId",
        key: "SelectEmployeeEmailId",
        withoutLabel: true,
      },
      {
        type: "component",
        component: "SelectEmployeeCorrespondenceAddress",
        key: "SelectEmployeeCorrespondenceAddress",
        withoutLabel: true,
      },
    ],
  },

  {
    head: "HR_NEW_EMPLOYEE_FORM_HEADER",
    body: [
      {
        type: "component",
        component: "SelectEmployeeType",
        key: "SelectEmployeeType",
        withoutLabel: true,
      }
      ,
      {
        type: "component",
        component: "SelectDateofEmployment",
        key: "SelectDateofEmployment",
        withoutLabel: true,
      }
      // ,
      // {
      //   type: "component",
      //   component: "SelectEmployeeDepartment",
      //   key: "SelectEmployeeDepartment",
      //   withoutLabel: true,
      // },
      // {
      //   type: "component",
      //   component: "SelectEmployeeDesignation",
      //   key: "SelectEmployeeDesignation",
      //   withoutLabel: true,
      // },
      // {
      //   type: "component",
      //   isMandatory: true,
      //   component: "Jurisdictions",
      //   key: "Jurisdictions",
      //   withoutLabel: true,
      // }
    ],
  },
];
