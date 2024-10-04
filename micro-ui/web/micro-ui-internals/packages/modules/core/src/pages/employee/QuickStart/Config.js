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
      title: "SANDBOX_GUIDE_1",
      content: "SANDBOX_CONTENT_1",
      actions: [
        {
          label: "SANDBOX_GUIDE_1_LABEL_1",
          description: "SANDBOX_GUIDE_1_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_1_LABEL_2",
          description: "SANDBOX_GUIDE_1_DESC_2",
        },
        {
          label: "SANDBOX_GUIDE_1_LABEL_3",
          description: "SANDBOX_GUIDE_1_DESC_3",
        },
      ],
    },
    {
      id: 2,
      title: "SANDBOX_GUIDE_2",
      content: "SANDBOX_CONTENT_2",
      actions: [
        {
          label: "SANDBOX_GUIDE_2_LABEL_1",
          description: "SANDBOX_GUIDE_2_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_2_LABEL_2",
          description: "SANDBOX_GUIDE_2_DESC_2",
        },
        {
          label: "SANDBOX_GUIDE_2_LABEL_3",
          description: "SANDBOX_GUIDE_2_DESC_3",
        },
        {
          label: "SANDBOX_GUIDE_2_LABEL_4",
          description: "SANDBOX_GUIDE_2_DESC_4",
        },
        {
          label: "SANDBOX_GUIDE_2_LABEL_5",
          description: "SANDBOX_GUIDE_2_DESC_5",
        },
        {
          label: "SANDBOX_GUIDE_2_LABEL_6",
          description: "SANDBOX_GUIDE_2_DESC_6",
        },
      ],
      style: {
        backgroundColor: "#fce4ec",
        color: "#880e4f",
      },
    },
    {
      id: 3,
      title: "SANDBOX_GUIDE_3",
      content: "SANDBOX_CONTENT_3",
      actions: [
        {
          label: "SANDBOX_GUIDE_3_LABEL_1",
          description: "SANDBOX_GUIDE_3_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_3_LABEL_2",
          description: "SANDBOX_GUIDE_3_DESC_2",
        },
        {
          label: "SANDBOX_GUIDE_3_LABEL_3",
          description: "SANDBOX_GUIDE_3_DESC_3",
        },
      ],
      style: {
        backgroundColor: "#fff9c4",
        color: "#f57f17",
      },
    },
    {
      id: 4,
      title: "SANDBOX_GUIDE_4",
      content: "SANDBOX_CONTENT_4",
      actions: [
        {
          label: "SANDBOX_GUIDE_4_LABEL_1",
          description: "SANDBOX_GUIDE_4_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_4_LABEL_2",
          description: "SANDBOX_GUIDE_4_DESC_2",
        },
        {
          label: "SANDBOX_GUIDE_4_LABEL_3",
          description: "SANDBOX_GUIDE_4_DESC_3",
        },
      ],
      style: {
        backgroundColor: "#fff9c4",
        color: "#f57f17",
      },
    },
    {
      id: 5,
      title: "SANDBOX_GUIDE_5",
      content: "SANDBOX_CONTENT_5",
      actions: [
        {
          label: "SANDBOX_GUIDE_5_LABEL_1",
          description: "SANDBOX_GUIDE_5_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_5_LABEL_2",
          description: "SANDBOX_GUIDE_5_DESC_2",
        },
      ],
    },
    {
      id: 6,
      title: "SANDBOX_GUIDE_6",
      content: "SANDBOX_CONTENT_6",
      actions: [],
    },
    {
      id: 7,
      title: "SANDBOX_GUIDE_7",
      content: "SANDBOX_CONTENT_7",
      actions: [
        {
          label: "SANDBOX_GUIDE_7_LABEL_1",
          description: "SANDBOX_GUIDE_7_DESC_1",
        },
        {
          label: "SANDBOX_GUIDE_7_LABEL_2",
          description: "SANDBOX_GUIDE_7_DESC_2",
        },
      ],
    },
    {
      id: 8,
      title: "SANDBOX_GUIDE_8",
      content: "SANDBOX_CONTENT_8",
      actions: [
        {
          label: "SANDBOX_GUIDE_8_LABEL_1",
          description: "SANDBOX_GUIDE_8_DESC_1",
        },
      ],
    },
    {
      id: 9,
      title: "SANDBOX_GUIDE_9",
      type: "faqs",
      content: null,
      actions: [
        {
          question: "SANDBOX_FAQ_QUES_ONE",
          answer: "SANDBOX_FAQ_ANS_ONE",
        },
        {
          question: "SANDBOX_FAQ_QUES_TWO",
          answer: "SANDBOX_FAQ_ANS_TWO",
        },
        {
          question: "SANDBOX_FAQ_QUES_THREE",
          answer: "SANDBOX_FAQ_ANS_THREE",
        },
        {
          question: "SANDBOX_FAQ_QUES_FOUR",
          answer: "SANDBOX_FAQ_ANS_FOUR",
        },
      ],
    },
  ];

  // return <QuickSetupComponent config={QuickSetupConfig}></QuickSetupComponent>;
  return <QuickSetup cardConfig={cardConfig}></QuickSetup>;
};

export default QuickSetupConfigComponent;
