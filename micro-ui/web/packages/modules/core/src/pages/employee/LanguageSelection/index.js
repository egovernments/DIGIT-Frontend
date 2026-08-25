import { Button, Card, SubmitBar, Loader } from "@egovernments/digit-ui-components";
import { CustomButton } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import Background from "../../../components/Background";
import ImageComponent from "../../../components/ImageComponent";
import { loginConfig as defaultLoginConfig } from "../Login/config";
import { useLoginConfig } from "../../../hooks/useLoginConfig";

const DEFAULT_LOCALE=Digit?.Utils?.getDefaultLanguage?.();

const defaultLanguage = { label: "English", value:  DEFAULT_LOCALE};

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { languages, stateInfo } = storeData || {};
  // Same LoginConfig (MDMS override, else local default) the Login screen uses for showTenant.
  const { data: loginMdmsData } = useLoginConfig(Digit.ULBService.getStateId());
  const loginScreenConfig = loginMdmsData?.config?.[0] || defaultLoginConfig?.[0];
  let defaultLanguages = languages;
  if (!defaultLanguages || defaultLanguages?.length == 0) {
    defaultLanguages = [defaultLanguage];
  }
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const [selected, setselected] = useState(selectedLanguage);
  const handleChangeLanguage = (language) => {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  function getContextPath(contextPath) {
    if (!contextPath || typeof contextPath !== "string") return "";
    return contextPath.split("/")[0];
  }
  
  const hasMultipleLanguages = languages?.length > 1;

  const handleSubmit = (event) => {
        navigate(`/${getContextPath(window.contextPath)}/user/login?ts=${Date.now()}`);
  };

  if (isLoading) return <Loader />;

  if (!hasMultipleLanguages) {
    return <Navigate to={`/${window?.contextPath}/employee/user/login`} replace />;
  }

  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader language-selector">
          <ImageComponent className="bannerLogo" src={stateInfo?.logoUrl} alt="Digit Banner Image" />

          {loginScreenConfig?.showTenant !== false && <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>}
        </div>
        <div className="language-selector-header">{t("CS_COMMON_CHOOSE_LANGUAGE_HEADER")}</div>
        <div className="language-selector" style={{ justifyContent: "space-around", padding: "0 5%" }}>
          {defaultLanguages.map((language, index) => (
            <div className="language-button-container" key={index}>
              <CustomButton
                selected={language.value === selected}
                text={t(language.label)}
                onClick={() => handleChangeLanguage(language)}
              ></CustomButton>
            </div>
          ))}
        </div>
        <SubmitBar style={{ width: "100%" }} label={t(`CORE_COMMON_CONTINUE`)} onSubmit={handleSubmit} />
      </Card>
      <div className="EmployeeLoginFooter">
        <ImageComponent
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />{" "}
      </div>
    </Background>
  );
};

export default LanguageSelection;
