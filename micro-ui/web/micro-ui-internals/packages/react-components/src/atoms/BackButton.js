import React from "react";
import { ArrowLeft, ArrowLeftWhite } from "./svgindex";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = ({
  style,
  isSuccessScreen,
  isCommonPTPropertyScreen,
  getBackPageNumber,
  className = "",
  variant = "black",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (!isSuccessScreen) {
      if (!isCommonPTPropertyScreen) {
        if (location.pathname.includes("/citizen/pt/property/new-application/property-type")) {
          sessionStorage.setItem("docReqScreenByBack", true);
        }
        navigate(-1); // same as history.goBack()
      } else {
        navigate(getBackPageNumber()); // could be -2, -3, etc.
      }
    }
  };

  return (
    <div className={`back-btn2 ${className}`} style={style || {}} onClick={handleBack}>
      {variant === "black" ? (
        <>
          <ArrowLeft />
          <p>{t("CS_COMMON_BACK")}</p>
        </>
      ) : (
        <ArrowLeftWhite />
      )}
    </div>
  );
};

export default BackButton;
