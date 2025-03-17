export const newConfig = [
  {
    head: "HR_LOGIN_DETAILS_HEADER",
    body: [
      {
        inline: true,
        label: "HR_EMP_ID_LABEL",
        isMandatory: true,
        type: "text",
        disable: false,
        key: "SelectEmployeeId",

        populators: {
          name: "SelectEmployeeId",
          error: "Required",
          validation: {
            pattern: "/^[A-Za-z]+$/",

            ValidationRequired: true,
          },
        },
      },

      {
        inline: true,
        label: "HR_EMP_PASSWORD_LABEL",
        isMandatory: true,
        type: "password",
        disable: false,
        key: "employeePassword",

        populators: {
          name: "employeePassword",
          error: "CORE_COMMON_APPLICANT_PASSWORD_INVALID",
          validation: {
            pattern: "/^[A-Za-z]+$/",
            type: "password",
            ValidationRequired: true,
          },
        },
      },

      {
        inline: true,
        label: "HR_EMP_CONFIRM_PASSWORD_LABEL",
        isMandatory: true,
        type: "password",
        disable: false,
        key: "employeeConfirmPassword",

        populators: {
          name: "employeeConfirmPassword",
          error: "CORE_COMMON_APPLICANT_CONFIRM_PASSWORD_INVALID",
          validation: {
            pattern: "/^[A-Za-z]+$/",
            type: "password",
            ValidationRequired: true,
          },
        },
      },
    ],
  },
  {
    head: "HR_PERSONAL_DETAILS_HEADER",
    body: [
      {
        inline: false,
        label: "HR_EMP_NAME_LABEL",
        isMandatory: true,
        type: "text",
        disable: false,
        key: "SelectEmployeeName",
        populators: {
          name: "SelectEmployeeName",
          error: "Required",
          validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i },
        },
      },

      {
        label: "HR_MOB_NO_LABEL",
        isMandatory: true,
        key: "SelectEmployeePhoneNumber",
        type: "number",
        disable: false,
        populators: {
          name: "SelectEmployeePhoneNumber",
          error: "CORE_COMMON_MOBILE_ERROR",
          validation: { minLength: 10, min: 0, max: 9999999999, ValidationRequired: true }, // 10-digit phone number validation
        },
      },

      {
        isMandatory: true,
        type: "radio",
        key: "genders",
        label: "HR_GENDER_LABEL",
        disable: false,
        populators: {
          name: "gender",
          optionsKey: "name",
          error: "sample required message",
          required: true,
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },

      {
        inline: true,
        label: "HR_BIRTH_DATE_LABEL",
        isMandatory: true,
        key: "SelectDateofBirthEmployment",
        type: "date", // Input type is date picker
        disable: false,
        populators: {
          // max:convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18)),
          name: "SelectDateofBirthEmployment",
          required: true,
          error: "Required",
        },
      },

      {
        inline: false,
        label: "HR_EMAIL_LABEL",
        isMandatory: false,
        type: "text",
        disable: false,
        key: "SelectEmployeeEmailId",
        populators: {
          required: false,
          name: "SelectEmployeeEmailId",
          error: "Required",
          validation: {
            pattern: /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i,
          },
        },
      },

      {
        inline: false,
        label: "HR_CORRESPONDENCE_ADDRESS_LABEL",
        isMandatory: false,
        type: "text",
        disable: false,
        populators: {
          required: false,
          name: "SelectEmployeeCorrespondenceAddress",
          error: "Required",
          validation: {
            pattern: /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i,
          },
        },
      },
    ],
  },

  {
    head: "HR_NEW_EMPLOYEE_FORM_HEADER",
    body: [
      {
        isMandatory: true,
        key: "SelectEmployeeType",
        type: "dropdown",
        label: "HR_EMPLOYMENT_TYPE_LABEL",
        disable: false,
        populators: {
          name: "SelectEmployeeType",
          optionsKey: "name",
          error: "Required",
          mdmsConfig: {
            masterName: "EmployeeType",
            moduleName: "egov-hrms",
            localePrefix: "EGOV_HRMS_EMPLOYEETYPE",
          },
        },
      },

      {
        inline: true,
        label: "Date of appointment",
        isMandatory: true,
        key: "SelectDateofEmployment",
        type: "date", // Input type is date picker
        disable: false,
        populators: { name: "SelectDateofEmployment", required: true, error: "Required" },
      },

      {
        isMandatory: true,
        key: "SelectEmployeeDepartment",
        type: "dropdown",
        label: "HR_EMPLOYMENT_DEPARTMENT_LABEL",
        disable: false,
        populators: {
          name: "SelectEmployeeDepartment",
          optionsKey: "name",
          error: "Required",
          mdmsConfig: {
            masterName: "Department",
            moduleName: "common-masters",
            localePrefix: "COMMON_MASTERS_DEPARTMENT",
          },
        },
      },

      {
        isMandatory: true,
        key: "SelectEmployeeDesignation",
        type: "dropdown",
        label: "HR_EMPLOYMENT_Designation_LABEL",
        disable: false,
        populators: {
          name: "SelectEmployeeDesignation",
          optionsKey: "name",
          error: "Required",
          mdmsConfig: {
            masterName: "Designation",
            moduleName: "common-masters",
            localePrefix: "COMMON_MASTERS_DESIGNATION",
          },
        },
      },

      {
        isMandatory: true,
        key: "RolesAssigned",
        type: "dropdown",
        label: "HR_COMMON_TABLE_COL_ROLE",
        disable: false,
        populators: {
          allowMultiSelect: true,
          name: "RolesAssigned",
          optionsKey: "name",
          error: "Required",
          mdmsConfig: {
            masterName: "roles",
            moduleName: "ACCESSCONTROL-ROLES",
            localePrefix: "ACCESSCONTROL_ROLES_ROLES",
          },
        },
      },

      {
        type: "component",
        isMandatory: true,
        component: "BoundaryComponent",
        key: "BoundaryComponent",
        withoutLabel: true,
        populators: {
          name: "BoundaryComponent",
        },
      },
    ],
  },
];
