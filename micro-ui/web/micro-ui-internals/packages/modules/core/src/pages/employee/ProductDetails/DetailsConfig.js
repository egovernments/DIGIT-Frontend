export const detailsConfig = [{
    heading: "TL_PRODUCT_DETAILS_HEADER",
    icon: "TLIcon",
    module:"TL",
    subsections: [
      {
        title: "TL_SECTION1_TITLE",
        type: "both",
        content: [
          {
            type: "paragraph",
            id: 1,
            text: "TL_SECTION1_PARA1",
          },
          
        ],
      },
      {
        title: "TL_SECTION2_TITLE",
        type: "both",
        content: [
          {
            type: "paragraph",
            text: "TL_SECTION2_PARA1",
          },
          {
            type: "paragraph",
            text: "TL_SECTION2_PARA2",
          },
          {
            type: "image",
            src : "https://s3-alpha-sig.figma.com/img/06d5/7749/72081f8538f650fa9358112d574aa785?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gkJaOMScTBUnzpR~5qj1QMvgjm5PeGg3byAOb0z5WfFD1UOtRfk4toT5E5E5O0sTW2GPdQa~cvNsqkOqWnEIy01~-QFnpXec9u2paof5VKKeGfF1OdkFu4-nT6lWzBPBJIA0Rr1HkTBVThery0IJQK~AF9F-G672xvnzjQjwlACbODyplDjGdTXYnCDedpgdLPUkF5Ufkeaj0qmkvhfMkZQL0KLiczV6lB7XL3OV8IeaD5C6AirbjoV5~XkXNQp6AcBt9Vp9GOZYDEMJL7xEIhHMNuvOEUveXfjG~4KF76bPpcegkWmOW7K5ZJEoBaZAl7vAnkCm7ehmgWbcj6L4Xw__",
            alt : "TL Figma Image"
          },
        ],
      },
      {
        title: "TL_SECTION3_TITLE",
        type: "both",
        content: [
          {
            type: "paragraph",
            text: "TL_SECTION3_PARA1",
          },
          {
            type: "paragraph",
            text: "TL_SECTION3_PARA2",
          },
          {
            type: "step-heading",
            text: "TL_CITIZEN_FEATURE_HEADER",
          },
          {
            type: "step",
            id: 1,
            text: "TL_CITIZEN_FEATURE1",
          },
          {
            type: "step",
            id: 2,
            text: "TL_CITIZEN_FEATURE2",
          },
          {
            type: "step",
            id: 3,
            text: "TL_CITIZEN_FEATURE3",
          },
          {
            type: "step",
            id: 4,
            text: "TL_CITIZEN_FEATURE4",
          },
          {
            type: "step",
            id: 5,
            text: "TL_CITIZEN_FEATURE5",
          },
          {
            type: "step",
            id: 6,
            text: "TL_CITIZEN_FEATURE6",
          },
          {
            type: "step-heading",
            text: "TL_EMPLOYEE_FEATURE_HEADER",
          },
          {
            type: "step",
            id: 7,
            text: "TL_EMPLOYEE_FEATURE1",
          },
          {
            type: "step",
            id: 8,
            text: "TL_EMPLOYEE_FEATURE2",
          },
          {
            type: "step",
            id: 9,
            text: "TL_EMPLOYEE_FEATURE3",
          },
        ],
      },
      {
        type: "card",
        icon: "People", // replace with actual icon if needed
        heading: "ROLE_LANDING_CITIZEN", // localization key for "Citizen"
        description: "ROLE_LANDING_CITIZEN_DESCRIPTION", // localization key for the description
        buttonName: "ROLE_LANDING_CITIZEN_BUTTON", // localization key for the button label
        action: "/citizen/login",
        isExternal:false

      },
      {
        type: "card",
        icon: "People", // replace with actual icon if needed
        heading: "ROLE_LANDING_GOV_ADMIN", // localization key for "Government Administrator"
        description: "ROLE_LANDING_GOV_ADMIN_DESCRIPTION", // localization key for the description
        buttonName: "ROLE_LANDING_GOV_ADMIN_BUTTON", // localization key for the button label
        action: "https://unified-dev.digit.org/digit-ui/employee/user/auto-login?username=PTTLSU3&password=eGov@123&city=pg.citya",
        userId: "PTTLSU3",
        password : "eGov@123",
        isExternal:true
      }
    ],
  }];
  