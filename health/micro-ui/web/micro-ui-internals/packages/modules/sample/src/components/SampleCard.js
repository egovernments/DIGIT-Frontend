import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "beenHere", // Use a safe default icon
    moduleName: t("Sample") || "Sample", // Fallback if translation fails
    kpis: [], // Empty array is fine
    links: [
      {
        label: t("Sample Create") || "Sample Create",
        link: `/${window?.contextPath || ""}/employee/sample/sample-create`,
      },
      {
        label: t("Sample Search") || "Sample Search",
        link: `/${window?.contextPath || ""}/employee/sample/sample-search`,
      },
      {
        label: t("Sample View") || "Sample View",
        link: `/${window?.contextPath || ""}/employee/sample/sample-view`,
      },
      // ... rest of your links
    ],
    // Optional props you can add:
    // otherLinks: [
    //   {
    //     label: "Additional Action",
    //     link: "/some-link",
    //     placement: "top", // or "bottom"
    //     icon: "Add" // optional icon
    //   }
    // ],
    // className: "custom-class",
    // buttonSize: "medium"
  };

  try {
    // Start with minimal props, then switch to full props
    return <EmployeeModuleCard {...propsForModuleCard} />;
    // Once the above works, use: return <EmployeeModuleCard {...propsForModuleCard} />;
  } catch (error) {
    console.error("Error in SampleCard:", error);
    return (
      <div style={{ padding: "20px", border: "1px solid red" }}>
        <h3>Error rendering EmployeeModuleCard</h3>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default SampleCard;