import React, { Fragment, useState, useEffect } from "react";
import { Button, LandingPageCard, LandingPageWrapper, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const DIGIT_UI_CONTEXTS = ["digit-ui", "works-ui", "workbench-ui", "health-ui", "sanitation-ui", "core-ui", "mgramseva-web", "sandbox-ui"];

export const RoleBasedEmployeeHome = ({ modules, additionalComponent }) => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getStateId();
  let sortedConfigEmployeesSidebar = null;
  const [mdmsOrderData, setMdmsOrderData] = useState([{}]);

  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HomeScreenOrder",
    [
      {
        name: "CardsAndLinksOrder",
      },
    ],
    {
      select: (data) => {
        return data?.["HomeScreenOrder"]?.["CardsAndLinksOrder"];
      },
    }
  );

  useEffect(() => {
    setMdmsOrderData(MdmsRes);
  }, [MdmsRes]);

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
        displayName: item.displayName,
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
    // Sort card modules based on the order in MdmsRes
    const sortedModules = Object.keys(configEmployeeSideBar)
      .sort((a, b) => {
        // Find the card order in mdmsOrderData based on module names (HRMS, PGR, etc.)
        const cardOrderA = mdmsOrderData?.find((item) => item.moduleType === "card" && item.name === a)?.order || null;
        const cardOrderB = mdmsOrderData?.find((item) => item.moduleType === "card" && item.name === b)?.order || null;
        return cardOrderA - cardOrderB;
      })
      .reduce((acc, module) => {
        // Sort links based on the order in MdmsRes
        const sortedLinks = configEmployeeSideBar?.[module]?.links?.sort((linkA, linkB) => {
          const labelA = linkA?.displayName;
          const labelB = linkB?.displayName;

          // Find the order for links inside the module
          const orderA =
            mdmsOrderData?.find((item) => item.moduleType === "link" && item.name === `${module}.${labelA.replace(/\s+/g, "_")}`)?.order || null;
          const orderB =
            mdmsOrderData?.find((item) => item.moduleType === "link" && item.name === `${module}.${labelB.replace(/\s+/g, "_")}`)?.order || null;

          return orderA - orderB;
        });

        acc[module] = {
          ...configEmployeeSideBar[module],
          links: sortedLinks,
        };

        return acc;
      }, {});

    return sortedModules;
  };

  if (isMultiRootTenant) {
    sortedConfigEmployeesSidebar = sortCardAndLink(configEmployeeSideBar);
  } else {
    sortedConfigEmployeesSidebar = configEmployeeSideBar;
  }

  const children = Object.keys(sortedConfigEmployeesSidebar)?.map((current, index) => {
    const moduleData = sortedConfigEmployeesSidebar?.[current];
    const configureData = moduleData?.links?.find((item) => item?.label === "Configure");
    const propsForModuleCard = {
      icon: "SupervisorAccount",
      moduleName: t(moduleData?.label),
      metrics: [],
      links: Digit.Utils.getMultiRootTenant() ? moduleData.links?.filter((item) => item.label !== "Configure") : moduleData.links,
      centreChildren: [<div>{t(Digit.Utils.locale.getTransformedLocale(`MODULE_CARD_DESC_${current}`))}</div>],
      endChildren: Digit.Utils.getMultiRootTenant()
        ? [
            <Button
              variation="teritiary"
              label={configureData?.label}
              icon={configureData?.icon}
              type="button"
              size={"medium"}
              onClick={() => history?.push(configureData?.link)}
              style={{ padding: "0px" }}
            />,
          ]
        : null,
    };
    return <LandingPageCard buttonSize={"medium"} {...propsForModuleCard} />;
  });
  return (
    <>
      <LandingPageWrapper>{React.Children.map(children, (child) => React.cloneElement(child))}</LandingPageWrapper>
    </>
  );
};
