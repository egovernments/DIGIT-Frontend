import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { 
  PageBasedInput, 
  Loader, 
  RadioButtons, 
  CardHeader 
} from "@egovernments/digit-ui-components";
import { useGetInitData } from "@egovernments/digit-ui-libraries-new";

const LanguageSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: { languages = [], stateInfo = {} } = {}, isLoading } = useGetInitData();
  const selectedLanguage = window.Digit?.StoreData?.getCurrentLanguage?.() || "en_IN";

  const defaultLanguage = { 
    label: "English", 
    value: window.Digit?.Utils?.getDefaultLanguage?.() || "en_IN" 
  };
  
  let availableLanguages = languages;
  if (!availableLanguages || availableLanguages.length === 0) {
    availableLanguages = [defaultLanguage];
  }

  const texts = useMemo(
    () => ({
      header: t("CS_COMMON_CHOOSE_LANGUAGE"),
      submitBarLabel: t("CORE_COMMON_CONTINUE"),
    }),
    [t]
  );

  const radioButtonProps = useMemo(
    () => ({
      options: availableLanguages,
      optionsKey: "label",
      additionalWrapperClass: "citizen-language-selection-wrapper",
      onSelect: (language) => {
        if (window.Digit?.LocalizationService?.changeLanguage) {
          window.Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
        }
      },
      selectedOption: availableLanguages?.find((lang) => lang.value === selectedLanguage),
    }),
    [selectedLanguage, availableLanguages, stateInfo]
  );

  const handleSubmit = () => {
    navigate(`/${window?.contextPath}/citizen/select-location`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="citizen-language-selection">
      <PageBasedInput texts={texts} onSubmit={handleSubmit}>
        <CardHeader>{t("CS_COMMON_CHOOSE_LANGUAGE")}</CardHeader>
        <div className="language-selection-content">
          <RadioButtons {...radioButtonProps} />
        </div>
      </PageBasedInput>
    </div>
  );
};

export default LanguageSelection;