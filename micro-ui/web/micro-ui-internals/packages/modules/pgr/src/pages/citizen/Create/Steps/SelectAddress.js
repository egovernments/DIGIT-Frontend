import React, { useEffect, useState, useRef } from "react";
import { CardLabel, Dropdown, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";
import { subtract } from "lodash";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { data: allCities, isLoading } = isMultiRootTenant ? Digit.Hooks.useTenants() : Digit.Hooks.pgr.useTenants();

  // For multiRootTenant, always show all cities (ignore pincode filtering)
  // For non-multiRootTenant, filter by pincode if provided
  const cities = isMultiRootTenant
    ? allCities
    : (value?.pincode ? allCities?.filter((city) => city?.pincode?.some((pin) => pin == value["pincode"])) : allCities);

  const language = JSON.parse(sessionStorage.getItem('Digit.locale'))?.value;

  const [selectedCity, setSelectedCity] = useState(() => {
    const { city_complaint } = value;
    return city_complaint ? city_complaint : (cities?.length === 1 ? cities[0] : null);
  });

  const { isLoading: hierarchyLOading, data:hierarchyType } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
     "sandbox-ui",
      [
        { name: "ModuleMasterConfig",filter:'[?(@.module == "PGR")].master[?(@.type == "boundary")]' 

        }
      ],
      {
        select: (data) => {
          const formattedData = data?.["sandbox-ui"]?.["ModuleMasterConfig"]
          return formattedData?.[0]?.code;
        },
      }
    );

   const stateId = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() :  selectedCity?.code;
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    stateId,
     Digit.Utils.getMultiRootTenant() ? hierarchyType : "admin",
    {
      enabled: Digit.Utils.getMultiRootTenant() ? !!selectedCity && !!hierarchyType :  !!selectedCity,
    },
    t,
    language
  );
  const [localities, setLocalities] = useState(null);

  const [selectedLocality, setSelectedLocality] = useState(() => {
    const { locality_complaint } = value;
    return locality_complaint ? locality_complaint : null;
  });

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      // For multiRootTenant, show all localities for the selected city (no pincode filtering)
      // For non-multiRootTenant, filter localities by pincode if provided
      const { pincode } = value;
      let __localityList = isMultiRootTenant
        ? fetchedLocalities
        : (pincode ? fetchedLocalities.filter((city) => city["pincode"] == pincode) : fetchedLocalities);
      setLocalities(__localityList);
    }
  }, [selectedCity, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    // Digit.SessionStorage.set("city_complaint", city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    // Digit.SessionStorage.set("locality_complaint", locality);
  }

  function onSubmit() {
    onSelect({ city_complaint: selectedCity, locality_complaint: selectedLocality });
  }

  // Show loading if cities data is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <div>
        <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
        {cities && cities.length > 0 ? (
          cities.length < 5 ? (
            <RadioButtons selectedOption={selectedCity} options={cities} optionsKey={"i18nKey"} onSelect={selectCity} />
          ) : (
            <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey={"i18nKey"} t={t} />
          )
        ) : (
          <div>No cities available</div>
        )}
        {selectedCity && localities && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
        {selectedCity && localities && (
          <React.Fragment>
            {localities?.length < 5 ? (
              <RadioButtons selectedOption={selectedLocality} options={localities} optionsKey="i18nkey" onSelect={selectLocality} />
            ) : (
              <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" option={localities} select={selectLocality} t={t} />
            )}
          </React.Fragment>
        )}
      </div>
    </FormStep>
  );
};

export default SelectAddress;
