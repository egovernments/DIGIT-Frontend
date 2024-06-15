import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/casesSearchConfig";
import { useHistory } from "react-router-dom";
import { advocateSearchconfig } from "../../configs/advocateSearchConfig";
import { useLocation } from "react-router-dom";



const defaultSearchValues = {
  barRegistrationNumber: ""
};

const AdvocateMain = () => {
  const location = useLocation();
  const caseData = location.state || {};
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = advocateSearchconfig();

  console.log(caseData, " rrrrrrrrrrrrrrrrrrrrrrrrrr")

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };


  return (
    <div>
      <Header >{t(indConfigs?.label)}</Header>
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
      </div>
      Advocate Main Page
      Bar registration  search screen
      <button
        onClick={() => handleNavigate("/employee/cases/advocate-vakalath")}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          margin: "2px",
        }}
      >
        Proceed
      </button>
    </div>
  );
};
export default AdvocateMain;
