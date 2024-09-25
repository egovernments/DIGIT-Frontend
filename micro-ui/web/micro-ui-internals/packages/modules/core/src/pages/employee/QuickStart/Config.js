import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardText, CardLabelError, Toast, CardLabel, Card, CardHeader, LinkLabel,Loader } from "@egovernments/digit-ui-components";
import QuickSetupComponent from ".";
import Drawer from "../../../components/Drawer";

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
      const linkUrl = Digit.Utils.transformURL(item.navigationURL,tenantId);
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
     sectionHeader:"WELCOME_TO_SANDBOX",
     sections:[
         {
             label:"SANDBOX_DESCRIPTION_1"
         },
         {
             label:"SANDBOX_DESCRIPTION_2"
         },
         {
             label:"SANDBOX_DESCRIPTION_3"
         }
     ]
    },
    {
     sectionHeader:"QUICK_SETUP",
     links:configEmployeeSideBar
    }
   ];
  return (
  //  <QuickSetupComponent config={QuickSetupConfig}></QuickSetupComponent>
   <Drawer config={QuickSetupConfig}></Drawer>
  );
};

export default QuickSetupConfigComponent;
