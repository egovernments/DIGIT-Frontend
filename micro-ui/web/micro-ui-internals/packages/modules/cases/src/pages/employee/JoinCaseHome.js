import { Button } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import React from "react";

const JoinCaseHome = () => {
  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };
  return (
    <div>
      <button
        onClick={() => handleNavigate("/employee/cases/search-case")}
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
        Join a case
      </button>
    </div>
  );
};

export default JoinCaseHome;
