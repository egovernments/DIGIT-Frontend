import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const SearchCase = () => {
  const history = useHistory();
  const location = useLocation();
  const propData = location.state || {}; // Access the passed prop object


  const handleNavigate = (path,caseData) => {
    const contextPath = window?.contextPath || "";
    history.push({
      pathname: `/${contextPath}${path}`,
      state: caseData
    });
  };

  return (
    <div>
      Case search screen
      <button
        onClick={() => handleNavigate("/employee/cases/join-case-advocate" , propData)}
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
        Proceed as advocate
      </button>
      <button
        onClick={() => handleNavigate("/employee/cases/join-case-litigant" , propData)}
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
        Proceed as litigant
      </button>
    </div>
  );
};
export default SearchCase;
