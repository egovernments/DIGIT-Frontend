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
            pattern: /^[A-Za-z]+( [A-Za-z]+)*$/,
            maxLength: 60,
          },
          error: "ERR_ACCOUNT_NAME_REQUIRED",
        },
        infoMessage:"SANDBOX_SIGNUP_ACCOUNT_NAME_TOOLTIP"
      },
      {
        isMandatory: false,
        key: "check",
        type: "component",
        component: "PrivacyComponent",
        withoutLabel: true,
        disable: false,
        customProps: {
          module: "SandboxSignUp",
        },
        populators: {
          name: "check",
        },
      },
    ],
  },
];
