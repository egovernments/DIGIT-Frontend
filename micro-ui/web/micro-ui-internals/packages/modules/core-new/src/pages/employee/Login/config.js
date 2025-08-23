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
              "(data)=>{ return Array.isArray(data['tenant'].tenants) && data['tenant'].tenants.filter(x => x.code.includes(Digit?.ULBService?.getStateId())).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}",
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
    ],
    bannerImages: [
      {
        id: 1,
        image: "https://cdn.jsdelivr.net/npm/digit-ui-assets@1.0.0/images/digit-home-banner-1.jpg",
        title: "DIGIT_BANNER_TITLE_1",
        description: "DIGIT_BANNER_DESC_1"
      },
      {
        id: 2,
        image: "https://cdn.jsdelivr.net/npm/digit-ui-assets@1.0.0/images/digit-home-banner-2.jpg",
        title: "DIGIT_BANNER_TITLE_2", 
        description: "DIGIT_BANNER_DESC_2"
      },
      {
        id: 3,
        image: "https://cdn.jsdelivr.net/npm/digit-ui-assets@1.0.0/images/digit-home-banner-3.jpg",
        title: "DIGIT_BANNER_TITLE_3",
        description: "DIGIT_BANNER_DESC_3"
      }
    ]
  },
];