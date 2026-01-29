import React, { useRef, useEffect, useState } from "react";
import { SideNav, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MediaQuery from 'react-responsive';




const EmployeeSideBar = () => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getStateId();

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

  function mergeObjects(obj1, obj2) {
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
          if (!obj1[key]) {
            obj1[key] = {};
          }
          mergeObjects(obj1[key], obj2[key]);
        } else {
          if (!obj1[key]) {
            obj1[key] = obj2[key];
          }
        }
      }
    }
  }

  const configEmployeeSideBar = {};
  data?.actions
    .filter((e) => e.url === "url")
    .forEach((item) => {
      let index = item?.path?.split(".")?.[0] || "";
      if (item?.path !== "") {
        const keys = item?.path?.split(".");
        let hierarchicalMap = {};

        keys.reduce((acc, key, index) => {
          if (index === keys.length - 1) {
            acc[key] = { item };
          } else {
            acc[key] = {};
            return acc[key];
          }
        }, hierarchicalMap);
        mergeObjects(configEmployeeSideBar, hierarchicalMap);
      }
    });

  const splitKeyValue = (configEmployeeSideBar) => {
    const objectArray = Object.entries(configEmployeeSideBar);
    objectArray.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    const sortedObject = Object.fromEntries(objectArray);
    configEmployeeSideBar = sortedObject;
    return configEmployeeSideBar;
  };

  const navigateToRespectiveURL = (url = "") => {
    if (!url || url === "/") return;

    // Detect if it's an external link (starts with http or https)
    const isExternal = /^https?:\/\//i.test(url);

    if (isExternal) {
      // Open external links in a new tab
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Internal navigation logic
    if (!url.includes(`/${window?.contextPath}`)) {
      const hostUrl = window.location.origin;
      let updatedUrl;

      if (isMultiRootTenant) {
        const contextPath = window?.contextPath || "sandbox-ui";
        url = url.replace(`/${contextPath}/employee`, `/${contextPath}/${tenantId}/employee`);
        updatedUrl = url;
        navigate(updatedUrl);
      } else {
        updatedUrl = hostUrl + url;
        window.location.href = updatedUrl;
      }
    } else {
      navigate(url);
    }
  };

  const onItemSelect = ({ item, index, parentIndex }) => {
    if (item?.navigationUrl) {
      navigateToRespectiveURL(item?.navigationUrl);
    } else {
      return;
    } 
  };

  function transformData(data) {
    const transformItem = (key, value) => {
      if (value.item) {
        return {
          label: t(value.item.displayName),
          icon: { icon: value.item.leftIcon, width: "1.5rem", height: "1.5rem" },
          navigationUrl: value.item.navigationURL,
          orderNumber:value.item.orderNumber,
        };
      }
      const children = Object.keys(value).map((childKey) => transformItem(childKey, value[childKey]));
      const iconKey = extractLeftIcon(value);
      return {
        label: t(key),
        icon: { icon: iconKey, width: "1.5rem", height: "1.5rem" },
        children: children,
      };
    };
    return Object.keys(data).map((key) => transformItem(key, data[key]));
  }

  const sortDataByOrderNumber = (data) => {
    // Sort the current level of data by orderNumber, handling cases where orderNumber might be missing
    data.sort((a, b) => {
      const aOrder = a.orderNumber !== undefined ? a.orderNumber : Infinity; // Use Infinity if orderNumber is missing
      const bOrder = b.orderNumber !== undefined ? b.orderNumber : Infinity; // Use Infinity if orderNumber is missing
      return aOrder - bOrder;
    });
  
    // Recursively sort the children if they exist
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortDataByOrderNumber(item.children);
      }
    });
  
    return data;
  };

  const transformedData = transformData(splitKeyValue(configEmployeeSideBar));
  const sortedTransformedData= sortDataByOrderNumber(transformedData);
  if (isLoading) {
    return <Loader />;
  }

  if (!configEmployeeSideBar) {
    return "";
  }
  
  return (
    <MediaQuery minWidth={768}>
      <SideNav
        items={sortedTransformedData}
        hideAccessbilityTools={true}
        onSelect={({ item, index, parentIndex }) => onItemSelect({ item, index, parentIndex })}
        theme={"dark"}
        variant={"primary"}
        transitionDuration={""}
        className=""
        styles={{}}
        expandedWidth=""
        collapsedWidth=""
        onBottomItemClick={() => { }}
      />
    </MediaQuery>
  );
};

export default EmployeeSideBar;