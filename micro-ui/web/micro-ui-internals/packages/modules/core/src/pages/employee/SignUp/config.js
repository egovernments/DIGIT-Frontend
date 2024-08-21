export const SignUpConfig = [
  {
    texts: {
      header: "CORE_COMMON_SIGN_UP",
      submitButtonLabel: "CORE_COMMON_SIGN_UP_BUTTON",
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
    ],
  },
];
