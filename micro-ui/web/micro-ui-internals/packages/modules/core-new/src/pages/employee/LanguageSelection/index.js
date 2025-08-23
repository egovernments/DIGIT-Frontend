import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Card, SubmitBar, Loader } from "@egovernments/digit-ui-components";
import { useGetInitData } from "@egovernments/digit-ui-libraries-new";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = useGetInitData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { languages = [], stateInfo = {} } = storeData || {};
  
  const defaultLanguage = { 
    label: "English", 
    value: window.Digit?.Utils?.getDefaultLanguage?.() || "en_IN" 
  };
  
  let availableLanguages = languages;
  if (!availableLanguages || availableLanguages.length === 0) {
    availableLanguages = [defaultLanguage];
  }
  
  const selectedLanguage = window.Digit?.StoreData?.getCurrentLanguage?.() || "en_IN";
  const [selected, setSelected] = useState(selectedLanguage);

  const handleChangeLanguage = (language) => {
    setSelected(language.value);
    if (window.Digit?.LocalizationService?.changeLanguage) {
      window.Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
    }
  };

  const handleSubmit = () => {
    navigate(`/${window?.contextPath}/employee/user/login`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="language-selection-wrapper">
      <Card className="language-selection-card">
        <div className="card-header">
          <div className="logo-container">
            {stateInfo?.logoUrl && (
              <img 
                className="state-logo" 
                src={stateInfo.logoUrl} 
                alt="State Logo" 
              />
            )}
          </div>
          <h1 className="state-name">
            {t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}
          </h1>
        </div>
        
        <div className="language-selection-content">
          <h2 className="selection-title">
            {t("CS_COMMON_CHOOSE_LANGUAGE")}
          </h2>
          
          <div className="language-options">
            {availableLanguages.map((language, index) => (
              <Button
                key={index}
                className={`language-button ${language.value === selected ? 'selected' : ''}`}
                label={t(language.label)}
                onClick={() => handleChangeLanguage(language)}
                variation={language.value === selected ? "primary" : "secondary"}
              />
            ))}
          </div>
        </div>
        
        <SubmitBar
          className="language-submit-bar"
          label={t("CORE_COMMON_CONTINUE")}
          onSubmit={handleSubmit}
        />
      </Card>
      
      <div className="footer-section">
        {window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW") && (
          <img
            className="footer-logo"
            alt="Powered by DIGIT"
            src={window.globalConfigs.getConfig("DIGIT_FOOTER_BW")}
            onClick={() => {
              const digitHomeUrl = window.globalConfigs.getConfig("DIGIT_HOME_URL");
              if (digitHomeUrl) {
                window.open(digitHomeUrl, "_blank").focus();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;