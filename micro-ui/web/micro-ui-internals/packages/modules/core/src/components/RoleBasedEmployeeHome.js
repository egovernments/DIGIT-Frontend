import React, { Fragment } from "react";
import { LandingPageCard, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import { orderConfig } from "../config/card-link-order";

const DIGIT_UI_CONTEXTS = ["digit-ui", "works-ui", "workbench-ui", "health-ui", "sanitation-ui", "core-ui", "mgramseva-web", "sandbox-ui"];

export const RoleBasedEmployeeHome = ({ modules, additionalComponent }) => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getStateId();
  let sortedConfigEmployeesSidebar= null;

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

  const sortCardAndLink = (configEmployeeSideBar) => {
    const sortedModules = Object.keys(configEmployeeSideBar)
      .sort((a, b) => {
        const cardOrderA = (orderConfig?.order?.cardorder?.[a]) || Number.MAX_SAFE_INTEGER;
        const cardOrderB = (orderConfig?.order?.cardorder?.[b]) || Number.MAX_SAFE_INTEGER;
        return cardOrderA - cardOrderB;
      })
      .reduce((acc, module) => {
        const sortedLinks = configEmployeeSideBar?.[module]?.links?.sort((linkA, linkB) => {
          const labelA = linkA?.label;
          const labelB = linkB?.label;
  
          // Add safety checks for undefined labels
          if (!labelA || !labelB) {
            console.warn(`Link labels are missing: linkA.label=${labelA}, linkB.label=${labelB}`);
            return 0; // Keep the original order if labels are missing
          }
  
          const orderA = (orderConfig?.order?.linkorder?.[module]?.[labelA]) || null;
          const orderB = (orderConfig?.order?.linkorder?.[module]?.[labelB]) || null;
  
  
          return orderA - orderB;
        });
  
        acc[module] = {
          ...configEmployeeSideBar[module],
          links: sortedLinks,
        };
  
        return acc;
      }, {});
      return sortedModules
  };

  if(isMultiRootTenant){
    sortedConfigEmployeesSidebar= sortCardAndLink(configEmployeeSideBar);
  }
  else{
    sortedConfigEmployeesSidebar = configEmployeeSideBar;
  }

  const children = Object.keys(sortedConfigEmployeesSidebar)?.map((current, index) => {
    const moduleData = sortedConfigEmployeesSidebar?.[current];
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
