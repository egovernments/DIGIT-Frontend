
export const newConfig = [
  {
    head: "HR_LOGIN_DETAILS_HEADER",
    body: [
      {
        type: "component",
        component: "SelectEmployeeId",
        key: "SelectEmployeeId",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeId"
        }
      },
      {
        type: "component",
        component: "SelectEmployeePassword",
        key: "SelectEmployeePassword",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeePassword"
        }
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
        populators:{
          name:"SelectEmployeeName"
        }
      },
      {
        type: "component",
        component: "SelectEmployeePhoneNumber",
        key: "SelectEmployeePhoneNumber",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeePhoneNumber"
        }
      },
      {
        type: "component",
        component: "SelectEmployeeGender",
        key: "SelectEmployeeGender",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeGender"
        }
      },
      {
        type: "component",
        component: "SelectDateofBirthEmployment",
        key: "SelectDateofBirthEmployment",
        withoutLabel: true,
        populators:{
          name:"SelectDateofBirthEmployment"
        }
      },
      {
        type: "component",
        component: "SelectEmployeeEmailId",
        key: "SelectEmployeeEmailId",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeEmailId"
        }
      },
      {
        type: "component",
        component: "SelectEmployeeCorrespondenceAddress",
        key: "SelectEmployeeCorrespondenceAddress",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeCorrespondenceAddress"
        }
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
        populators:{
          name:"SelectEmployeeType"
        }
      },
      {
        type: "component",
        component: "SelectDateofEmployment",
        key: "SelectDateofEmployment",
        withoutLabel: true,
        populators:{
          name:"SelectDateofEmployment"
        }
      },
      {
        type: "component",
        component: "SelectEmployeeDepartment",
        key: "SelectEmployeeDepartment",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeDepartment"
        }
      },

      {
        type: "component",
        component: "SelectEmployeeDesignation",
        key: "SelectEmployeeDesignation",
        withoutLabel: true,
        populators:{
          name:"SelectEmployeeDesignation"
        }
      },
      {
        type: "component",
        isMandatory: true,
        component: "RolesAssigned",
        key: "RolesAssigned",
        withoutLabel: true,
        populators:{
          name:"RolesAssigned"
        }
      },
      {
        type: "component",
        isMandatory: true,
        component: "BoundaryComponent",
        key: "BoundaryComponent",
        withoutLabel: true,
        populators:{
          name:"BoundaryComponent"
        }
      },
    ],
  },
];




