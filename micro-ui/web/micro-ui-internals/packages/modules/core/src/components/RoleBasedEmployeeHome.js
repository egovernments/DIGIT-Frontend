import React, { Fragment } from "react";
import { LandingPageCard, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const DIGIT_UI_CONTEXTS = ["digit-ui", "works-ui", "workbench-ui", "health-ui", "sanitation-ui", "core-ui", "mgramseva-web", "sandbox-ui"];

export const RoleBasedEmployeeHome = ({ modules, additionalComponent }) => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getStateId();

  const transformURL = (url = "") => {
    if (url == "/") {
      return;
    }
    if (url?.indexOf(`/${window?.contextPath}`) === -1) {
      let updatedUrl = null;
      if (isMultiRootTenant) {
        url = url.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`);
        updatedUrl = url;
      } else {
        updatedUrl = DIGIT_UI_CONTEXTS?.every((e) => url?.indexOf(`/${e}`) === -1) ? "/employee/" + url : url;
      }
      return updatedUrl;
    } else {
      return url;
    }
  };

  const configEmployeeSideBar = data?.actions
    .filter((e) => e.url === "card" && e.parentModule)
    .reduce((acc, item) => {
      const module = item.parentModule;
      if (!acc[module]) {
        acc[module] = {
          module: module,
          kpis: [],
          icon: item.leftIcon ? Digit.Utils.iconRender(item.leftIcon, "white") : "", // Set icon if available
          label: Digit.Utils.locale.getTransformedLocale(`${module}_CARD_HEADER`), // Set label if needed or leave as an empty string
          links: [],
        };
      }
      const linkUrl = transformURL(item.navigationURL);
      const queryParamIndex = linkUrl.indexOf("?");
      acc[module].links.push({
        // link: linkUrl,
        link: linkUrl,
        icon: linkUrl.includes("create")
          ? "Person"
          : linkUrl.includes("inbox")
          ? "AllInbox"
          : linkUrl.includes("search")
          ? "Search"
          : linkUrl.includes("edit")
          ? "Edit"
          : "PhonelinkSetup",
        // link: queryParamIndex === -1 ? linkUrl : linkUrl.substring(0, queryParamIndex),
        queryParams: queryParamIndex === -1 ? null : linkUrl.substring(queryParamIndex),
        label: t(Digit.Utils.locale.getTransformedLocale(`${module}_LINK_${item.displayName}`)),
      });
      return acc;
    }, {});

  if (isLoading) {
    return <Loader />;
  }

  if (!configEmployeeSideBar) {
    return "";
  }

  const children = Object.keys(configEmployeeSideBar)?.map((current, index) => {
    const moduleData = configEmployeeSideBar?.[current];
    const propsForModuleCard = {
      // Icon: moduleData?.icon,
      icon: "SupervisorAccount",
      moduleName: t(moduleData?.label),
      metrics: [],
      links: moduleData.links,
    };
    return <LandingPageCard buttonSize={"medium"} {...propsForModuleCard} />;
  });
  return (
    <>
      <div className="employee-app-container digit-home-employee-app">
        <div className="ground-container moduleCardWrapper gridModuleWrapper digit-home-moduleCardWrapper">
          {/* {Object.keys(configEmployeeSideBar)?.map((current, index) => {
            const moduleData = configEmployeeSideBar?.[current];
            const propsForModuleCard = {
              // Icon: moduleData?.icon,
              icon: "SupervisorAccount",
              moduleName: t(moduleData?.label),
              metrics: [],
              links: moduleData.links,
            };
            return <LandingPageCard buttonSize={"medium"} {...propsForModuleCard} />;
            // return <EmployeeModuleCard {...propsForModuleCard} />;
          })} */}
          {React.Children.map(children, (child) => React.cloneElement(child))}
        </div>
      </div>
    </>
  );
};
