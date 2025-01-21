import React, { useEffect, useState, useRef } from "react";
import { CardLabel, Dropdown, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const allCities = Digit.Hooks.pgr.useTenants();
  
  // const cities = value?.pincode ? allCities.filter((city) => city?.pincode?.some((pin) => pin == value["pincode"])) : allCities;
  const cities= allCities.filter((city) => city?.code=="pg.amhara");
  const language = JSON.parse(sessionStorage.getItem('Digit.locale'))?.value;

  const [selectedCity, setSelectedCity] = useState(() => {
    const { city_complaint } = value;
    return city_complaint ? city_complaint : (cities?.length === 1 ? cities[0] : null);
  });
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "admin",
    {
      enabled: !!selectedCity,
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
      const { pincode } = value;
      let __localityList = pincode ? fetchedLocalities.filter((city) => city["pincode"] == pincode) : fetchedLocalities;
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
  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <div>
        <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
        {cities?.length < 5 ? (
          <RadioButtons selectedOption={selectedCity} options={cities} optionsKey="i18nKey" onSelect={selectCity} />
        ) : (
          <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="i18nKey" t={t} />
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
