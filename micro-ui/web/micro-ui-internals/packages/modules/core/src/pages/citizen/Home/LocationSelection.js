import { BackLink } from "@egovernments/digit-ui-components";
import { CardHeader, CardLabelError, PageBasedInput, SearchOnRadioButtons } from "@egovernments/digit-ui-react-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const LocationSelection = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  let hookResult = { data: null, isLoading: false };

// Check the value of window.globalPath
if (Digit.Utils.getMultiRootTenant()) {
  // Call the useTenants hook only if the condition is met
  hookResult = Digit.Hooks.useTenants();
}
const {
  data: { stateInfo, uiHomePage } = {},
  isLoading: initisLoading,
} = Digit.Hooks.useStore.getInitData();

const redirectURL = uiHomePage?.redirectURL;

// Destructure the result
const { data: cities, isLoading } = hookResult;

// Use the requestCriteria only if it's not null
const { data: TenantMngmtSearch, isLoading: isLoadingTenantMngmtSearch } = Digit.Hooks.useTenantManagementSearch({
  stateId: Digit.ULBService.getStateId(),
  includeSubTenants: true,
  config : {
    enabled: Digit.Utils.getMultiRootTenant()
  }
});

  const [selectedCity, setSelectedCity] = useState(() => ({ code: Digit.ULBService.getCitizenCurrentTenant(true) }));
  const [showError, setShowError] = useState(false);

  const texts = useMemo(
    () => ({
      header: t("CS_COMMON_CHOOSE_LOCATION"),
      submitBarLabel: t("CORE_COMMON_CONTINUE"),
    }),
    [t]
  );

  function selectCity(city) {
    setSelectedCity(city);
    setShowError(false);
  }

  const RadioButtonProps = useMemo(() => {
    return {
      options: Digit.Utils.getMultiRootTenant() ? TenantMngmtSearch : cities,
      optionsKey: Digit.Utils.getMultiRootTenant() ? "name" :"i18nKey",
      additionalWrapperClass: "digit-reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity,
    };
  }, [TenantMngmtSearch,cities, t, selectedCity]);

  function onSubmit() {
    if (selectedCity) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      const redirectBackTo = location.state?.redirectBackTo;
      if(redirectURL){
        history.push(`/${window?.contextPath}/citizen/${redirectURL}`);
      }
      else{
      if (redirectBackTo) {
        history.replace(redirectBackTo);
      } else history.push(`/${window?.contextPath}/citizen`);
    }
    } else {
      setShowError(true);
    }
  }

  return isLoading ? (
    <loader />
  ) : (
    <div className="selection-card-wrapper">
      <BackLink />
      <PageBasedInput texts={texts} onSubmit={onSubmit} className="location-selection-container">
        <CardHeader>{t("CS_COMMON_CHOOSE_LOCATION")}</CardHeader>
        <SearchOnRadioButtons {...RadioButtonProps} placeholder={t("COMMON_TABLE_SEARCH")} />
        {showError ? <CardLabelError>{t("CS_COMMON_LOCATION_SELECTION_ERROR")}</CardLabelError> : null}
      </PageBasedInput>
    </div>
  );
};

export default LocationSelection;
