export const SignUpConfig = [
  {
    texts: {
      header: "CORE_COMMON_SIGN_UP",
      submitButtonLabel: "CORE_COMMON_SIGN_UP_BUTTON",
      // secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD",
    },
    inputs: [
      {
        label: "CORE_SIGNUP_EMAILID",
        type: "text",
        key: "email",
        isMandatory: true,
        populators: {
          name: "email",
          validation: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          },
          error: "ERR_EMAIL_REQUIRED",
        },
      },
      {
        label: "CORE_SIGNUP_ACCOUNT_NAME",
        type: "text",
        key: "accountName",
        isMandatory: true,
        populators: {
          name: "accountName",
          validation: {
            required: true,
            patter: /^[A-Za-z][A-Za-z-' ]*[A-Za-z]$/,
          },
          error: "ERR_ACCOUNT_NAME_REQUIRED",
        },
      },
      {
        isMandatory: false,
        key: "check",
        type: "component",
        component: "PrivacyComponent",
        withoutLabel: true,
        disable: false,
        customProps: {
          module: "HCM",
        },
        populators: {
          name: "check",
        },
      },
      // {
      //   isMandatory: true,
      //   type: "dropdown",
      //   key: "city",
      //   label: "CORE_COMMON_CITY",
      //   disable: false,
      //   populators: {
      //     name: "city",
      //     optionsKey: "name",
      //     error: "ERR_HRMS_INVALID_CITY",
      //     mdmsConfig: {
      //       masterName: "tenants",
      //       moduleName: "tenant",
      //       localePrefix: "TENANT_TENANTS",
      //       select:
      //         "(data)=>{ return Array.isArray(data['tenant'].tenants) && Digit.Utils.getUnique(data['tenant'].tenants).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}",
      //     },
      //   },
      // }
    ],
  },
];
