import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/casesSearchConfig";
import { useHistory } from "react-router-dom";

const AdvocateMain = () => {
  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div>
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
