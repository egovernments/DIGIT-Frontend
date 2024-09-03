import React, { useRef, useEffect, useState } from "react";
import { Sidebar, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const DIGIT_UI_CONTEXTS = ["digit-ui", "works-ui", "workbench-ui", "health-ui", "sanitation-ui", "core-ui", "mgramseva-web"];

const EmployeeSideBar = () => {
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const { t } = useTranslation();
  const history = useHistory();

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

  const navigateToRespectiveURL = (history = {}, url = "") => {
    if (url == "/") {
      return;
    }
    if (url?.indexOf(`/${window?.contextPath}`) === -1) {
      const hostUrl = window.location.origin;
      const updatedURL = DIGIT_UI_CONTEXTS?.every((e) => url?.indexOf(`/${e}`) === -1) ? hostUrl + "/employee/" + url : hostUrl + url;
      window.location.href = updatedURL;
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

  function transformData(data) {
    const transformItem = (key, value) => {
      if (value.item) {
        return {
          label: value.item.displayName,
          icon: { icon: value.item.leftIcon, width: "1.5rem", height: "1.5rem" },
          navigationUrl: value.item.navigationURL,
        };
      }
      const children = Object.keys(value).map((childKey) => transformItem(childKey, value[childKey]));
      const iconKey = extractLeftIcon(value);
      return {
        label: key,
        icon: { icon: iconKey, width: "1.5rem", height: "1.5rem" },
        children: children,
      };
    };
    return Object.keys(data).map((key) => transformItem(key, data[key]));
  }

  const transformedData = transformData(splitKeyValue(configEmployeeSideBar));

  if (isLoading) {
    return <Loader />;
  }

  if (!configEmployeeSideBar) {
    return "";
  }

  return (
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
  );
};

export default EmployeeSideBar;
