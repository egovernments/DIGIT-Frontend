import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Guidelines = ({ path }) => {
  const { t } = useTranslation();
  // Keeping inline style for now because design for this screen is not given yet
  const { id="" } = Digit.Hooks.useQueryParams();
  return (
    <Link to={`/${window.contextPath}/employee/microplanning/create-microplan?id=${id}`}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "2rem",
          "font-weight": "700",
          "font-size": "2rem",
          "color":"rgb(0,0,0)"
        }}
      >
        {t("CREATE_MICROPLAN_GUIDELINES")}
      </div>
    </Link>
  );
};

export default Guidelines;
