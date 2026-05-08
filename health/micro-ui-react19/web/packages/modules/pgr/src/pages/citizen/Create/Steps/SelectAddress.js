import { useEffect, useState } from "react";
import { CardLabel, Dropdown, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const { data: allCities } = Digit.Utils.getMultiRootTenant?.() ? Digit.Hooks.useTenants() : Digit.Hooks.pgr?.useTenants?.() || {};
  const cities = value?.pincode ? allCities?.filter((city) => city?.pincode?.some((pin) => pin == value.pincode)) : allCities;

  const [selectedCity, setSelectedCity] = useState(() => value?.city_complaint || (cities?.length === 1 ? cities[0] : null));
  const [selectedLocality, setSelectedLocality] = useState(value?.locality_complaint || null);
  const [localities, setLocalities] = useState(null);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "admin",
    { enabled: !!selectedCity },
    t
  );

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      const filtered = value?.pincode
        ? fetchedLocalities.filter((loc) => loc.pincode == value.pincode)
        : fetchedLocalities;
      setLocalities(filtered);
    }
  }, [selectedCity, fetchedLocalities]);

  const selectCity = (city) => {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  };

  return (
    <FormStep config={config} onSelect={() => onSelect({ city_complaint: selectedCity, locality_complaint: selectedLocality })} t={t} isDisabled={!selectedLocality}>
      <div>
        <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
        {cities?.length < 5 ? (
          <RadioButtons selectedOption={selectedCity} options={cities} optionsKey="i18nKey" onSelect={selectCity} />
        ) : (
          <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="i18nKey" t={t} />
        )}
        {selectedCity && localities && (
          <>
            <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>
            {localities.length < 5 ? (
              <RadioButtons selectedOption={selectedLocality} options={localities} optionsKey="i18nkey" onSelect={setSelectedLocality} />
            ) : (
              <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" option={localities} select={setSelectedLocality} t={t} />
            )}
          </>
        )}
      </div>
    </FormStep>
  );
};

export default SelectAddress;
