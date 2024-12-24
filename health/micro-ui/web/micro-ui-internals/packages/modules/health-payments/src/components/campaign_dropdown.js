import { Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CampaignNameSelection = (props) => {
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState([]);

  // Get locale data from session storage
  const locale = Digit?.SessionStorage.get("staffProjects") || [];

  // Effect that only runs once when the component mounts
  useEffect(() => {
    // Check if locale data is valid and not already set
    if (locale.length > 0) {
      const formattedData = locale.map((target) => ({
        id: target.id,
        projectType: target.projectType,
        name: target.name,
        boundary: target?.address?.boundary,
        boundaryType: target?.address?.boundaryType,
        projectHierarchy: target.projectHierarchy
      }));

      // Use a function inside setState to ensure it's safely set outside render
      setFilteredData(formattedData);
    }
  }, []); // Empty dependency array ensures this runs only once

  console.log(filteredData);
  return (
    <React.Fragment>
      <div>
        <h2>Campaign Name</h2>
        {/* You can render the dropdown or other components here */}
         <Dropdown
         t={t} 
         optionKey={"code"}
         option={filteredData} 
         select={(value) => {
           // handleChange(value);
          }}
          disabled={false}
         />
      </div>
    </React.Fragment>
  );
};

export default CampaignNameSelection;
