export const loginConfig = [
  {
    texts: {
      header: "CORE_COMMON_LOGIN",
      submitButtonLabel: "CORE_COMMON_LOGIN",
      secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD",
    },
    inputs: [
      {
        label: "CORE_LOGIN_USERNAME",
        type: "text",
        key: "username",
        isMandatory: true,
        populators: {
          name: "username",
          validation: {
            required: true,
          },
          error: "ERR_USERNAME_REQUIRED",
        },
      },
      {
        label: "CORE_LOGIN_PASSWORD",
        type: "password",
        key: "password",
        isMandatory: true,
        populators: {
          name: "password",
          validation: {
            required: true,
          },
          error: "ERR_PASSWORD_REQUIRED",
        },
      },
      {
        isMandatory: true,
        type: "dropdown",
        key: "city",
        label: "CORE_COMMON_CITY",
        disable: false,
        populators: {
          name: "city",
          optionsKey: "name",
          error: "ERR_HRMS_INVALID_CITY",
          mdmsConfig: {
            masterName: "tenants",
            moduleName: "tenant",
            localePrefix: "TENANT_TENANTS",
            select:
              "(data)=>{ return Array.isArray(data['tenant'].tenants) && Digit.Utils.getUnique(data['tenant'].tenants).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}",
          },
        },
      },
      {
        key: "check",
        type: "component",
        disable: false,
        component: "PrivacyComponent",
        populators: {
          name: "check"
        },
        customProps: {
          module: "HCM"
        },
        isMandatory: false,
        withoutLabel: true
      },
      {
        key: "employeeSsoLoginOptions",
        type: "component",
        disable: false,
        component: "EmployeeSSOLoginOptions",
        populators: {
          name: "employeeSsoLoginOptions"
        },
        isMandatory: false,
        withoutLabel: true,
        renderAfterSubmit:true
      },
    ],

    // If you just want to show a popup when clicked on forgot password
    // forgotPasswordScreen: {
    //   mode: "popup",
    //   popupFields: {
    //     heading: "CORE_COMMON_FORGOT_PASSWORD_LABEL",
    //     description: "CORE_FORGOT_PASSWORD_POPUP_DESCRIPTION",
    //     buttonLabel: "CORE_FORGOT_PASSWORD_POPUP_OK",
    //   },
    // },
    // If you dont want to show tenant infromation before the logo icon in login page
    // showTenant : false
  },
];
