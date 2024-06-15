import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/casesSearchConfig";
import { useHistory } from "react-router-dom";

const AdvocatePayment = () => {
  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div>
      Payment Description Page
      <button
        onClick={() => handleNavigate("/employee/cases/advocate-join-case")}
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
        Make payment
      </button>
    </div>
  );
};
export default AdvocatePayment;
