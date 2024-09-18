import React from "react";
import { Sidebar, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import MediaQuery from 'react-responsive';


const DIGIT_UI_CONTEXTS = ["digit-ui", "works-ui", "workbench-ui", "health-ui", "sanitation-ui", "core-ui", "mgramseva-web", "sandbox-ui"];

const EmployeeSideBar = (props) => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const {mobileView}= props;
  // Create a shallow copy of data and sort the actions
  const sortedData = data ? { ...data, actions: [...(data.actions || [])].sort((a, b) => a.orderNumber - b.orderNumber) } : null;

  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getStateId();

  // Create an object to store the hierarchical structure
  const configEmployeeSideBar = {};

  // Function to build the hierarchical structure as an object
  const buildHierarchy = (item) => {
    const keys = item.path?.split(".") || [];
    let currentLevel = configEmployeeSideBar;

    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        // Last key in the path, store the item itself
        currentLevel[key] = { item };
      } else {
        // If key doesn't exist, initialize it as an empty object
        currentLevel[key] = currentLevel[key] || {};
        currentLevel = currentLevel[key];
      }
    });
  };

  // Build hierarchy based on sorted actions
  sortedData?.actions
    .filter((e) => e.url === "url")
    .forEach(buildHierarchy);

  const navigateToRespectiveURL = (history = {}, url = "") => {
    if (url == "/") {
      return;
    }
    if (url?.indexOf(`/${window?.contextPath}`) === -1) {
      const hostUrl = window.location.origin;
      let updatedUrl = null;
      if (isMultiRootTenant) {
        url = url.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`);
        updatedUrl = url;
      } else {
        updatedUrl = DIGIT_UI_CONTEXTS?.every((e) => url?.indexOf(`/${e}`) === -1) ? hostUrl + "/employee/" + url : hostUrl + url;
      }
      history.push(updatedUrl);
    } else {
      history.push(url);
    }
  };

  const onItemSelect = ({ item, index, parentIndex }) => {
    if (item?.navigationUrl) {
      navigateToRespectiveURL(history, item?.navigationUrl);
    } else {
      return;
    }
  };

  function extractLeftIcon(data = {}) {
    for (const key in data) {
      const item = data[key];
      if (key === "item" && item?.leftIcon !== "") {
        return item?.leftIcon;
      }
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        const subResult = extractLeftIcon(data[key]);
        if (subResult) {
          return subResult;
        }
      }
    }
    return null;
  }

  // Modified transformData to respect the order in configEmployeeSideBar
  function transformData(data) {
    // Sort items by their orderNumber
    return Object.keys(data)
      .map((key) => {
        const value = data[key];
        if (value.item) {
          return {
            label: value.item.displayName,
            icon: { icon: value.item.leftIcon, width: "1.5rem", height: "1.5rem" },
            navigationUrl: value.item.navigationURL,
            orderNumber: value.item.orderNumber, // Adding orderNumber for sorting
          };
        }
        const children = transformData(value); // Recursively transform children
        const iconKey = extractLeftIcon(value);
        return {
          label: key,
          icon: { icon: iconKey, width: "1.5rem", height: "1.5rem" },
          children: children,
          orderNumber: children.length > 0 ? Math.min(...children.map((child) => child.orderNumber)) : Infinity,
        };
      })
      .sort((a, b) => a.orderNumber - b.orderNumber); // Sort based on orderNumber
  }

  const transformedData = transformData(configEmployeeSideBar);

  if (isLoading) {
    return <Loader />;
  }

  if (!Object.keys(configEmployeeSideBar).length) {
    return "";
  }


  return (
    <MediaQuery minWidth={768}>
    <Sidebar
      items={transformedData}
      hideAccessbilityTools={true}
      onSelect={({ item, index, parentIndex }) => onItemSelect({ item, index, parentIndex })}
      theme={"dark"}
      variant={"primary"}
      transitionDuration={""}
      className=""
      styles={{}}
      expandedWidth=""
      collapsedWidth=""
      onBottomItemClick={() => {}}
    />
    </MediaQuery>
  );
};

export default EmployeeSideBar;
