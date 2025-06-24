// import React from "react";
// import { ArrowLeft, ArrowLeftWhite } from "./svgindex";
// import { withRouter } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const BackButton = ({ history, style, isSuccessScreen, isCommonPTPropertyScreen, getBackPageNumber, className="" ,variant="black"}) => {
//   const { t } = useTranslation();

//   return (
//     <div className={`back-btn2 ${className}`} style={style ? style : {}} onClick={() => {!isSuccessScreen ?( !isCommonPTPropertyScreen ?  (history.goBack(), window.location.href.includes("/citizen/pt/property/new-application/property-type") ? sessionStorage.setItem("docReqScreenByBack",true) : null) : history.go(getBackPageNumber()) ): null}}>
//      {variant=="black"?( <React.Fragment><ArrowLeft />
//       <p>{t("CS_COMMON_BACK")}</p></React.Fragment>):<ArrowLeftWhite />}
//     </div>
//   );
// };
// export default withRouter(BackButton);

import React from "react";
import { ArrowLeft, ArrowLeftWhite } from "./svgindex";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = ({ style, isSuccessScreen, isCommonPTPropertyScreen, getBackPageNumber, className = "", variant = "black" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (!isSuccessScreen) {
      if (!isCommonPTPropertyScreen) {
        navigate(-1);
        if (window.location.href.includes("/citizen/pt/property/new-application/property-type")) {
          sessionStorage.setItem("docReqScreenByBack", true);
        }
      } else {
        navigate(getBackPageNumber());
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
