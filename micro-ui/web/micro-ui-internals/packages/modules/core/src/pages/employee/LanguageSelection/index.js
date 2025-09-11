import { Button, Card, SubmitBar, Loader } from "@egovernments/digit-ui-components";
import { CustomButton } from "@egovernments/digit-ui-react-components";
import React, { useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import ImageComponent from "../../../components/ImageComponent";
const defaultLanguage = { label: "English", value: Digit.Utils.getDefaultLanguage() };
const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const history = useHistory();
  const { languages, stateInfo } = storeData || {};
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

  const handleSubmit = (event) => {    
    history.push(`/${getContextPath(window.contextPath)}/user/login?ts=${Date.now()}`);
  };


  // Clear old data and refresh localization when accessing login page
  useEffect(() => {
    // Clear expired/stale data but preserve essential config
    const preserveKeys = ['Employee.tenantId', 'Citizen.tenantId', 'CONTEXT_PATH'];
    const sessionData = {};
    const localData = {};
    
    // Backup preserved keys from both storages
    preserveKeys.forEach(key => {
      const sessionValue = window.Digit.SessionStorage.get(key);
      const localValue = window.Digit.LocalStorage?.get(key) || localStorage.getItem(key);
      
      if (sessionValue) sessionData[key] = sessionValue;
      if (localValue) localData[key] = localValue;
    });

    // Clear both session and local storage
    window.sessionStorage.clear();
    window.localStorage.clear();
    
    // Restore preserved keys
    Object.keys(sessionData).forEach(key => {
      window.Digit.SessionStorage.set(key, sessionData[key]);
    });
    
    Object.keys(localData).forEach(key => {
      if (window.Digit.LocalStorage?.set) {
        window.Digit.LocalStorage.set(key, localData[key]);
      } else {
        localStorage.setItem(key, localData[key]);
      }
    });

    // Clear React Query cache for fresh data
    if (window.Digit?.QueryClient) {
      window.Digit.QueryClient.clear();
    }

    // Clear API cache service
    if (window.Digit?.ApiCacheService) {
      window.Digit.ApiCacheService.clearAllCache();
    }

    // Trigger fresh localization loading
    if (window.Digit?.Localization) {
      window.Digit.Localization.invalidateLocalizationCache();
    }
  }, []); // Run only once when component mounts


  if (isLoading) return <Loader />;
  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader">
          <ImageComponent className="bannerLogo" src={stateInfo?.logoUrl} alt="Digit Banner Image" />
        </div>
        <div className="language-selector" style={{ justifyContent: "space-around", marginBottom: "24px", padding: "0 5%" }}>
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
