export const SignUpConfig = [
  {
    texts: {
      header: "CORE_COMMON_LOGIN",
      submitButtonLabel: "CORE_COMMON_CONTINUE",
    },
    inputs: [
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
            maxLength: 50,
          },
          error: "ERR_ACCOUNT_NAME_REQUIRED",
        },
      },
      {isMandatory: false,
        key: "PrivacyComponent",
         key: "check",
        type: "component",
        component: "ForgotOrganizationTooltip",
        withoutLabel: true,
        disable: false,
        customProps: {
          module: "SandboxSignUp",
        },
        populators: {
          required: false,
          name: "check",
        },
      },
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
            maxLength: 64,
          },
          error: "ERR_EMAIL_REQUIRED",
        },
      },
      {isMandatory: false,
        key: "PrivacyComponent",
         key: "check",
        type: "component",
        component: "LoginSignupSelector",
        withoutLabel: true,
        disable: false,
        customProps: {
          module: "SandboxSignUp",
        },
        populators: {
          required: false,
          name: "check",
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
          module: "SandboxSignUp",
        },
        populators: {
          name: "check",
        },
      },
    ],
    bannerImages: [{
      id: 1,
      image: 'https://images.unsplash.com/photo-1746277121508-f44615ff09bb',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aut autem aperiam et modi saepe obcaecati doloremque voluptatem iusto quidem!"
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1547481887-a26e2cacb5b2',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
      title: 'Digital Headquarters for National Health Agencies',
      description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
    },
    ],
  },
];
