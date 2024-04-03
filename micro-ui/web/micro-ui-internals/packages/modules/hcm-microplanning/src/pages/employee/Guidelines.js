import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Guidelines = ({ path }) => {
  const { t } = useTranslation();
  const newPath = String(window.contextPath).split("/").slice(0, -1).join("/");
  // Keeping inline style for now because design for this screen is not given yet
  return (
    <Link to={`/${newPath}/employee/create-microplan`}>
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
