import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/casesSearchConfig";
import { useHistory } from "react-router-dom";

const AdvocateEsign = () => {
  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div>
      E-sign Page
      {/* //TODO: use digit button */}
      <button
        onClick={() => handleNavigate("/employee/cases/advocate-payment")}
        style={{
          backgroundColor: "#007e7e",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          margin: "2px",
        }}
      >
        E-Sign Done
      </button>
    </div>
  );
};
export default AdvocateEsign;
