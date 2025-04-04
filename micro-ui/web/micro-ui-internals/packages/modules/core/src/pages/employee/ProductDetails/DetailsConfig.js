export const detailsConfig = [{
    heading: "License Management",
    icon: "TLIcon",
    module:"TL",
    subsections: [
      {
        title: " ",
        type: "both",
        content: [
          {
            type: "paragraph",
            text: "The product allows users to easily obtain their license while ensuring compliance with the rules and regulations. Our product is highly customizable, where you have complete control over the  user experience.",
          },
          {
            type: "paragraph",
            text: "The default settings are configured for Trade License applications. Citizens can apply for a trade/business license, or a counter employee can apply on their behalf. Government employees can view, process, and approve/reject applications. The process follows four sequential steps.",
          },
          {
            type: "paragraph",
            text: "In this version of Sandbox, you can:",
          },
          {
            type: "image",
            src : "https://s3-alpha-sig.figma.com/img/06d5/7749/72081f8538f650fa9358112d574aa785?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gkJaOMScTBUnzpR~5qj1QMvgjm5PeGg3byAOb0z5WfFD1UOtRfk4toT5E5E5O0sTW2GPdQa~cvNsqkOqWnEIy01~-QFnpXec9u2paof5VKKeGfF1OdkFu4-nT6lWzBPBJIA0Rr1HkTBVThery0IJQK~AF9F-G672xvnzjQjwlACbODyplDjGdTXYnCDedpgdLPUkF5Ufkeaj0qmkvhfMkZQL0KLiczV6lB7XL3OV8IeaD5C6AirbjoV5~XkXNQp6AcBt9Vp9GOZYDEMJL7xEIhHMNuvOEUveXfjG~4KF76bPpcegkWmOW7K5ZJEoBaZAl7vAnkCm7ehmgWbcj6L4Xw__",
            alt : "TL Figma Image"
          },
          {
            type: "step",
            id: 1,
            text: "Modify the license specific information such as trade category,trade type etc",
          },
          {
            type: "step",
            id: 2,
            text: "Add/Edit employee data such as their demographic data, the roles each can perform",
          },
          {
            type: "paragraph",
            text: "Feel free to play around!",
          }
        ],
      },
      {
        title: "Key features available",
        type: "both",
        content: [
          {
            type: "step",
            id: 1,
            text: "Easy-to-use interface for filling out the application",
          },
          {
            type: "step",
            id: 2,
            text: "Upload relevant documents",
          },
          {
            type: "step",
            id: 3,
            text: "Make dummy payments ",
          },
          {
            type: "step",
            id: 4,
            text: "Receive notifications and alerts for status updates and upcoming renewals on SMS and email",
          },
          {
            type: "step",
            id: 5,
            text: "Configure foundational data such as trade categories, workflows, fee calculation etc.",
          },
          {
            type: "step",
            id: 6,
            text: "View custom dashboards to track statistics and monitor performance",
          },
          {
            type: "step",
            id: 7,
            text: "Filter applications easily find and manage license applications",
          },
        ],
      },
      {
        title: "Role Based Access",
        type: "paragraph",
        content: [
          {
            text: "DIGIT products have role-based access where users can have different roles assigned to them based on the requirement. For trade license, there are two types of users Citizen (who applies for the license) and Employee (who processes the license). On clicking explore, a new tab will open with the desired view. If you explore as an employee, by default, you will have a super-user view which has access to all features and functionalities.",
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
  