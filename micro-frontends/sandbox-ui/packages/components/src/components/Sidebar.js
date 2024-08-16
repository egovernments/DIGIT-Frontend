import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DigitUIComponents from "../DigitUIComponents";
import { sidebarIconRender } from "../utils/sidebarIconRender";
const { Sidebar } = DigitUIComponents;

import data from "../utils/dummyData";
import { useAuthState } from "../states/useAuthState";
import useCustomAPIHook from "../hooks/useCustomAPIHook";

/**
 * Sidebar Component
 *
 * A simple sidebar component with navigation links, styled using Tailwind CSS.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 */

/* the data used here is hardcoded from an api call....
api can be called.. just add the fetch function for it...
*/

const SidebarV2 = () => {
  const { data } = useAuthState();
  console.log(data, "data");

  const [search, setSearch] = useState("");
  const url = "http://localhost:9001/access/v1/actions/mdms/_get";
  const payload = {
    roleCodes: [
      "HRMS_ADMIN",
      "WORK_ORDER_CREATOR",
      "ESTIMATE_VERIFIER",
      "ESTIMATE_APPROVER",
      "MB_VERIFIER",
      "WORK_ORDER_VERIFIER",
      "PROJECT_VIEWER",
      "MB_CREATOR",
      "MUSTER_ROLL_VERIFIER",
      "OFFICER_IN_CHARGE",
      "PROJECT_CREATOR",
      "EMPLOYEE_COMMON",
      "BILL_VIEWER",
      "TECHNICAL_SANCTIONER",
      "BILL_CREATOR",
      "MUSTER_ROLL_APPROVER",
      "ESTIMATE_VIEWER",
      "WORK_ORDER_APPROVER",
      "MB_APPROVER",
      "ESTIMATE_CREATOR",
      "MB_VIEWER",
      "MUKTA_ADMIN",
    ],
    tenantId: "pg",
    actionMaster: "actions-test",
    enabled: true,
  };
  // let data = {};
  // const [transformedSidebarItems, setTransformedSidebarItems] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const { data: APIData } = useCustomAPIHook({
    url,
    body: payload,
  });
  console.log(APIData, "APIData");
  if (!APIData) {
    return null;
  }
  let transformedSidebarItems = [];

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
      if (search === "" && item.path !== "") {
        const keys = item.path.split(".");
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
      } else if (
        checkMatch(
          t(`ACTION_TEST_${index?.toUpperCase()?.replace(/[ -]/g, "_")}`),
          search
        ) ||
        checkMatch(
          t(
            Digit.Utils.locale.getTransformedLocale(
              `ACTION_TEST_${item?.displayName}`
            )
          ),
          search
        )
      ) {
        const keys = item.path.split(".");
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

  const transformConfig = (config) => {
    const result = [];

    const processItem = (key, value) => {
      const item = value.item;

      // Extract the icon name from the leftIcon property
      const iconName = item ? item.leftIcon.split(":").pop() : "";

      // Get the corresponding React component from the iconMap
      //const IconComponent = iconMap[iconName] || null;
      const obj = {
        // label: item ? item.displayName : key,
        label: key,
        //icon: item ? item.leftIcon : '', // Assuming icon is in leftIcon field
        //icon: item ? item.leftIcon.split(':').pop() : '',
        //icon: IconComponent ? <IconComponent /> : null,  // Render the icon component
        icon: sidebarIconRender(iconName),
        link: item ? item.navigationURL : "",
        children: [],
      };

      for (const childKey in value) {
        if (childKey !== "item" && typeof value[childKey] === "object") {
          obj.children.push(processItem(childKey, value[childKey]));
        } else {
          delete obj.children;
        }
      }

      return obj;
    };

    for (const key in config) {
      result.push(processItem(key, config[key]));
    }

    return result;
  };

  const sortSidebarItems = (items) => {
    // Sort items based on the label
    items.sort((a, b) => a.label.localeCompare(b.label));

    // Recursively sort children if they exist
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortSidebarItems(item.children);
      }
    });

    return items;
  };

  const removeLeadingNumbers = (items) => {
    // Function to clean up the label by removing the initial number
    const cleanLabel = (label) => label.replace(/^\d+\s*/, "");

    // Recursive function to process each item
    const processItem = (item) => {
      // Clean the label of the current item
      item.label = cleanLabel(item.label);

      // If there are children, process them recursively
      if (item.children && item.children.length > 0) {
        item.children = item.children.map(processItem);
      }

      return item;
    };

    return items.map(processItem);
  };

  function updateMenuWithIcons(menu) {
    menu.forEach((parent) => {
      if (parent.icon === null && parent.children) {
        // Find the first non-null icon in the children
        for (const child of parent.children) {
          if (child.icon?.props) {
            parent.icon = child.icon;
            break; // Stop after finding the first non-null icon
          }
        }
      }

      // Recursively process children (if any)
      if (parent.children) {
        updateMenuWithIcons(parent.children);
      }
    });

    return menu;
  }

  console.log("confug", configEmployeeSideBar);
  const transformedItems = transformConfig(configEmployeeSideBar);
  //console.log("transformed0", transformedSidebarItems);
  // Use the sorting function on the transformedSidebarItems
  const sortedItems = sortSidebarItems(transformedItems);

  const cleanedSidebarItems = removeLeadingNumbers(sortedItems);

  const updatedSidebarItemsWithIcons = updateMenuWithIcons(cleanedSidebarItems);
  console.log(updatedSidebarItemsWithIcons);
  // setTransformedSidebarItems(updatedSidebarItemsWithIcons); // Update state with transformed data
  transformedSidebarItems = updatedSidebarItemsWithIcons;
  console.log("transformed", transformedSidebarItems);

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white top-0 left-0 p-4">
      <h2 className="text-2xl font-semibold mb-6">Sidebar</h2>
      <Sidebar
        expandedWidth="500px"
        // transitionDuration={1.0}
        items={transformedSidebarItems}
      />
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/home" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/pwc/account-mgmt" className="hover:text-gray-400">
              Account-mgmt
            </Link>
          </li>
          <li>
            <Link to="/pwc/data-mgmt" className="hover:text-gray-400">
              Data-mgmt
            </Link>
          </li>
          <li>
            <Link to="/pwc/user" className="hover:text-gray-400">
              User
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarV2;
