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
        icon: item.leftIcon,
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

  const getHowItWorksLink = (moduleData) => {
    return moduleData?.links?.find((item) => {
      if (moduleData.module === "PGR") {
        return item?.displayName === "HOW_IT_WORKS_PGR";
      } else if (moduleData.module === "HRMS") {
        return item?.displayName === "HOW_IT_WORKS_HRMS";
      } else {
        return false;
      }
    });
  };

  const getUserManualLink = (moduleData) => {
    return moduleData?.links?.find((item) => {
      if (moduleData.module === "PGR") {
        return item?.displayName === "PGR_INFO_LINK";
      } else if (moduleData.module === "HRMS") {
        return item?.displayName === "HRMS_INFO_LINK";
      } else {
        return false; // No match for other modules
      }
    });
  };

  const getFilteredLinks = (moduleData) => {
    return moduleData.links?.filter((item) => {
      const displayName = item.displayName;
      const isPGR = moduleData.module === "PGR";
      const isHRMS = moduleData.module === "HRMS";
      const isNotConfigureMaster = displayName !== "Configure_master";
      const isNotHowItWorksPGR = !(isPGR && displayName === "HOW_IT_WORKS_PGR");
      const isNotHRMSInfoLink = !(isHRMS && displayName === "HRMS_INFO_LINK");
      const isNotHowItWorksHRMS = !(isHRMS && displayName === "HOW_IT_WORKS_HRMS");
      const isNotPGRInfoLink = !(isPGR && displayName === "PGR_INFO_LINK");
  
      return (
        isNotConfigureMaster &&
        isNotHowItWorksPGR &&
        isNotHRMSInfoLink &&
        isNotHowItWorksHRMS &&
        isNotPGRInfoLink
      );
    });
  };

  const children = Object.keys(sortedConfigEmployeesSidebar)?.map((current, index) => {
    const moduleData = sortedConfigEmployeesSidebar?.[current];
    const configureData = moduleData?.links?.find((item) => item?.displayName === "Configure_master");
    const howItWorks = getHowItWorksLink(moduleData);
    const userManual = getUserManualLink(moduleData);
    const propsForModuleCard = {
      icon: "SupervisorAccount",
      moduleName: t(moduleData?.label),
      metrics: [],
      links: Digit.Utils.getMultiRootTenant()? getFilteredLinks(moduleData): moduleData.links,    
      centreChildren: [<div>{t(Digit.Utils.locale.getTransformedLocale(`MODULE_CARD_DESC_${current}`))}</div>,
        <Button
        variation="teritiary"
        label={userManual?.label}
        icon={userManual?.icon}
        type="button"
        size={"medium"}
        onClick={() => window.open(userManual?.link, "_blank")}
        style={{ padding: "0px" }}
      />,
      ],
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
            <Button
            variation="teritiary"
            label={howItWorks?.label}
            icon={howItWorks?.icon}
            type="button"
            size={"medium"}
            onClick={() => window.open(howItWorks?.link, "_blank")}
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
