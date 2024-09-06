import { BackLink, CardHeader, CardLabelError, PageBasedInput, SearchOnRadioButtons } from "@egovernments/digit-ui-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const LocationSelection = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  let hookResult = { data: null, isLoading: false };

// Check the value of window.globalPath
if (window?.globalPath === 'sandbox-ui') {
  // Call the useTenants hook only if the condition is met
  hookResult = Digit.Hooks.useTenants();
}

// Destructure the result
const { data: cities, isLoading } = hookResult;
  // Define the requestCriteria
let requestCriteria = null;

// Check the value of window.globalPath
if (window?.globalPath === 'sandbox-ui') {
  requestCriteria = {
    url: "/tenant-management/tenant/_search",
    params: {
      code: Digit.ULBService.getCurrentTenantId(),
      includeSubTenants: true
    },
    body: {
      apiOperation: "SEARCH",
    },
    config: {
      select: (data) => {
        return data?.Tenants;
      },
    },
  };
}

// Use the requestCriteria only if it's not null
const { data: subTenants, refetch, isLoading: isLoadingSubTenants } = requestCriteria
  ? Digit.Hooks.useCustomAPIHook(requestCriteria)
  : { data: null, refetch: () => {}, isLoading: false };

// Now you can use subTenants, refetch, and isLoadingSubTenants


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
      options: window?.globalPath === "sandbox-ui" ? subTenants : cities,
      optionsKey: window?.globalPath === "sandbox-ui"? "name" :"i18nKey",
      additionalWrapperClass: "digit-reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity,
    };
  }, [subTenants,cities, t, selectedCity]);

  function onSubmit() {
    if (selectedCity) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      const redirectBackTo = location.state?.redirectBackTo;
      if(window?.globalPath === "sandbox-ui"){
        history.push(`/${window?.contextPath}/citizen/all-services`);
      }
      if (redirectBackTo) {
        history.replace(redirectBackTo);
      } else history.push(`/${window?.contextPath}/citizen`);
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
