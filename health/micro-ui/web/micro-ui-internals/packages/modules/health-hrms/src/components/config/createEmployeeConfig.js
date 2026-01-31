/**
 * Config for create/edit user screen: Used to take input about new users and existing users.
 * Digit components used: All standard digit components plus custom Jurisdictions component.
 * RolesAssigned field uses dropdown with multi-select capability.
 */
export const CreateEmployeeConfig = {
  tenantId: Digit.ULBService.getCurrentTenantId(),
  moduleName: "egov-hrms",
  CreateEmployeeConfig : [
    {
      form: [
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
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                validation: {
                  pattern: "/^[A-Za-z]+$/",
                  required: true,
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
                  required: true,
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
                  required: true,
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
                required: true,
                name: "SelectEmployeeName",
                error: "HRMS_EMPLOYEE_NAME_VALIDATION_ERROR_MSG",
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
                componentInFront: "+91",
                validation: {
                  required: true,
                  minLength: 10,
                  maxLength: 10,
                  min: 6000000000,
                  max: 9999999999,
                  
                }, // 10-digit phone number validation
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
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                styles : {
                  maxWidth : "37.5rem"
                },
                required: true,
                mdmsv2: true,
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
              type: "date", 
              disable: false,
              preProcess : {
                updateDependent : ["populators.validation.max"]
              },
              populators: {
                name: "SelectDateofBirthEmployment",
                required: true,
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                validation:{
                  max: "currentDate"
                },
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
                error: "EMAIL_VALIDATION",
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
                error: "CORE_COMMON_REQUIRED_ERRMSG",
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
                required: true,
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              //  mdmsv2: true,
                mdmsConfig: {
                  masterName: "EmployeeType",
                  moduleName: "egov-hrms",
                  localePrefix: "EGOV_HRMS_EMPLOYEETYPE",
                },
              },
            },
      
            {
              inline: true,
              label: "HR_APPOINTMENT_DATE_LABEL",
              isMandatory: true,
              key: "SelectDateofEmployment",
              type: "date", 
              disable: false,
              preProcess : {
                updateDependent : ["populators.validation.max"]
              },
              populators: { 
                name: "SelectDateofEmployment", 
                required: true,
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                validation:{
                  max: "currentDate"
                },
               },
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
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                required: true,
               // mdmsv2: true,
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
              label: "HR_EMPLOYMENT_DESIGNATION_LABEL",
              disable: false,
              populators: {
                name: "SelectEmployeeDesignation",
                optionsKey: "name",
                required: true,
                error: "CORE_COMMON_REQUIRED_ERRMSG",
               // mdmsv2: true,
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
              label: "HRMS_ROLES",
              disable: false,
              populators: {
                name: "RolesAssigned",
                optionsKey: "name",
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                required: true,
                addSelectAllCheck: true,
                isSearchable: true,
                allowMultiselect : true,
                isDropdownWithChip: true,
                chipsKey: "name",
               // mdmsv2: true,
                mdmsConfig: {
                  masterName: "roles",
                  moduleName: "ACCESSCONTROL-ROLES",
                  localePrefix: "ACCESSCONTROL_ROLES_ROLES",
                },
              },
            },
            // // INFO:: testing

            // {
            //   type: "component",
            //   isMandatory: true,
            //   component: "UserAssignment",
            //   key: "UserAssignment",
            //   withoutLabel: true,
            //   populators: {
            //     name: "UserAssignment",
            //   },
            // },
            {
              type: "component",
              isMandatory: true,
              component: "Jurisdictions",
              key: "Jurisdictions",
              withoutLabel: true,
              populators: {
                name: "Jurisdictions",
              },
            },
            
          ],
        },
      ],
    }
  ],
}
