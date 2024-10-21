import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardText, CardLabelError, Toast, CardLabel, Card, CardHeader, LinkLabel, Loader } from "@egovernments/digit-ui-components";
import QuickSetupComponent from ".";
import QuickSetup from "./QuickSetup";

const QuickSetupConfigComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const tenantId = Digit.ULBService.getStateId();

  // const transformURL = (url = "") => {
  //   if (url == "/") {
  //     return;
  //   }
  //   if (Digit.Utils.isContextPathMissing(url)) {
  //     let updatedUrl = null;
  //     if (isMultiRootTenant) {
  //       url = url.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`);
  //       updatedUrl = url;
  //     } else {
  //       updatedUrl = DIGIT_UI_CONTEXTS?.every((e) => url?.indexOf(`/${e}`) === -1) ? "/employee/" + url : url;
  //     }
  //     return updatedUrl;
  //   } else {
  //     return url;
  //   }
  // };

  const configEmployeeSideBar = data?.actions
    .filter((e) => e.url === "card" && e.parentModule)
    .reduce((acc, item) => {
      const module = item.parentModule;
      if (!acc[module]) {
        acc[module] = {
          module: module,
          label: Digit.Utils.locale.getTransformedLocale(`${module}_CARD_HEADER`),
          links: [],
        };
      }
      const linkUrl = Digit.Utils.transformURL(item.navigationURL, tenantId);
      const queryParamIndex = linkUrl.indexOf("?");
      acc[module].links.push({
        link: queryParamIndex === -1 ? linkUrl : linkUrl.substring(0, queryParamIndex),
        label: t(Digit.Utils.locale.getTransformedLocale(`${module}_LINK_${item.displayName}`)),
        queryParams: queryParamIndex === -1 ? null : linkUrl.substring(queryParamIndex),
        description: t(Digit.Utils.locale.getTransformedLocale(`${module}_LINK_${item.displayName}_DESCRIPTION`)),
      });
      return acc;
    }, {});

  if (!configEmployeeSideBar) {
    return "";
  }
  const QuickSetupConfig = [
    {
      sectionHeader: "WELCOME_TO_SANDBOX",
      sections: [
        {
          label: "SANDBOX_DESCRIPTION_1",
        },
        {
          label: "SANDBOX_DESCRIPTION_2",
        },
        {
          label: "SANDBOX_DESCRIPTION_3",
        },
      ],
    },
    {
      sectionHeader: "QUICK_SETUP",
      links: configEmployeeSideBar,
    },
  ];

  const cardConfig = [
    {
      id: 1,
      type: "faqs",
      actions: [
        {
          question: "SANDBOX_FAQ_QUES_14",
          isLabelLink: true,
          answer: [
            {
              label: "SANDBOX_FAQ_ANS_14_LABEL_1",
              fulllink:true,
              link:"https://egov-digit.gitbook.io/digit-sandbox/specifications/user-manual/walkthrough-videos",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_1",
          content: "SANDBOX_FAQ_CONTENT_1",
          isLabelLink: true,
          answer: [
            {
              label: "SANDBOX_FAQ_ANS_1_LABEL_1",
              link:"citizen/login",
              description: "SANDBOX_FAQ_ANS_1_DESCRIPTION_1",
            },
            {
              label: "SANDBOX_FAQ_ANS_1_LABEL_2",
              link: "employee/user/login",
              description: "SANDBOX_FAQ_ANS_1_DESCRIPTION_2",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_2",
          content: "SANDBOX_FAQ_CONTENT_2",
          answer: [
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_2_DESCRIPTION_1",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_2_DESCRIPTION_2",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_2_DESCRIPTION_3",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_2_DESCRIPTION_4",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_3",
          content: "SANDBOX_FAQ_CONTENT_3",
          answer: [
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_3_DESCRIPTION_1",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_3_DESCRIPTION_2",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_3_DESCRIPTION_3",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_3_DESCRIPTION_4",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_4",
          content: "SANDBOX_FAQ_CONTENT_4",
          answer: [
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_4_DESCRIPTION_1",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_4_DESCRIPTION_2",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_5",
          content: "SANDBOX_FAQ_CONTENT_5",
          answer: [
            {
              label: "SANDBOX_FAQ_ANS_5_LABEL_1",
              description: "SANDBOX_FAQ_ANS_5_DESCRIPTION_1",
            },
            {
              label: "SANDBOX_FAQ_ANS_5_LABEL_2",
              description: "SANDBOX_FAQ_ANS_5_DESCRIPTION_2",
            },
            {
              label: "SANDBOX_FAQ_ANS_5_LABEL_3",
              description: "SANDBOX_FAQ_ANS_5_DESCRIPTION_3",
            },
            {
              label: "SANDBOX_FAQ_ANS_5_LABEL_4",
              description: "SANDBOX_FAQ_ANS_5_DESCRIPTION_4",
            },
            {
              label: "SANDBOX_FAQ_ANS_5_LABEL_5",
              description: "SANDBOX_FAQ_ANS_5_DESCRIPTION_5",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_6",
          content: "SANDBOX_FAQ_CONTENT_6",
        },
        {
          question: "SANDBOX_FAQ_QUES_7",
          content: "SANDBOX_FAQ_CONTENT_7",
          answer: [
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_7_DESCRIPTION_1",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_7_DESCRIPTION_2",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_8",
          content: "SANDBOX_FAQ_CONTENT_8",
          answer: [
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_8_DESCRIPTION_1",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_8_DESCRIPTION_2",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_8_DESCRIPTION_3",
            },
            {
              label: null,
              description: "SANDBOX_FAQ_ANS_8_DESCRIPTION_4",
            },
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_9",
          content: "SANDBOX_FAQ_CONTENT_9",
          answer: [
            {
              label: "SANDBOX_FAQ_ANS_9_LABEL_1",
              description: "SANDBOX_FAQ_ANS_9_DESCRIPTION_1",
            },
            {
              label: "SANDBOX_FAQ_ANS_9_LABEL_2",
              description: "SANDBOX_FAQ_ANS_9_DESCRIPTION_2",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_10",
          content: "SANDBOX_FAQ_CONTENT_10",
          answer: [
            {
              label: "SANDBOX_FAQ_ANS_10_LABEL_1",
              description: "SANDBOX_FAQ_ANS_10_DESCRIPTION_1",
            },
            {
              label: "SANDBOX_FAQ_ANS_10_LABEL_2",
              description: "SANDBOX_FAQ_ANS_10_DESCRIPTION_2",
            },
            {
              label: "SANDBOX_FAQ_ANS_10_LABEL_3",
              description: "SANDBOX_FAQ_ANS_10_DESCRIPTION_3",
            },
            {
              label: "SANDBOX_FAQ_ANS_10_LABEL_4",
              description: "SANDBOX_FAQ_ANS_10_DESCRIPTION_4",
            }
          ]
        },
        {
          question: "SANDBOX_FAQ_QUES_11",
          content: "SANDBOX_FAQ_CONTENT_11",
        },
        {
          question: "SANDBOX_FAQ_QUES_12",
          content: "SANDBOX_FAQ_CONTENT_12",
        },
        {
          question: "SANDBOX_FAQ_QUES_13",
          content: "SANDBOX_FAQ_CONTENT_13",
        }     
      ],
    },
  ];

  // return <QuickSetupComponent config={QuickSetupConfig}></QuickSetupComponent>;
  return <QuickSetup cardConfig={cardConfig}></QuickSetup>;
};

export default QuickSetupConfigComponent;
