import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Button } from "@egovernments/digit-ui-react-components";
import MDMSSearchv2Popup from "../pages/employee/MDMSSearchv2Popup";
import OptionDetails from "./OptionDetails";
import SelectComponent from "./SelectComponent";
import InfoIconContainer from "./InfoIconContainer";
import useCustomSelectHook from "../hooks/CustomSelectHook";

const CustomSelectWidget = ({
  options, value, disabled, readonly, onChange, onBlur, onFocus, placeholder,
  multiple = false,
  schema = { schemaCode: "", fieldPath: "" },
}) => {
  const { t } = useTranslation();
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const { schemaCode = `${moduleName}.${masterName}`, tenantId, fieldPath } = schema;
  const [showTooltipFlag, setShowTooltipFlag] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSeeAll, setIsSeeAll] = useState(false);

  const { isLoading, data } = useCustomSelectHook({ tenantId, schemaCode, fieldPath, setMainData });

  const optionsList = data || options?.enumOptions || options || [];
  const optionsLimit = 10;

  const formattedOptions = useMemo(
    () =>
      optionsList.map((e) => ({
        label: t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${e?.label}`)),
        value: e?.value,
      })),
    [optionsList, schemaCode, data, t]
  );

  useEffect(() => {
    setLimitedOptions(formattedOptions.slice(0, optionsLimit));
    if (optionsLimit < formattedOptions.length) {
      setIsSeeAll(true);
    }
    setSelectedDetails(
      mainData?.filter((obj) =>
        multiple
          ? value?.includes(obj.uniqueIdentifier)
          : obj.uniqueIdentifier === value
      )
    );
  }, [formattedOptions, optionsLimit]);

  const handleChange = (selectedValue) => {
    setShowTooltipFlag(true);
    setIsSelect(true);
    setShowDetails(
      mainData?.filter((obj) =>
        multiple
          ? selectedValue.value?.includes(obj.uniqueIdentifier)
          : obj.uniqueIdentifier === selectedValue.value
      )
    );
  };

  const handleSelect = (detail) => {
    setShowTooltipFlag(false);
    setIsSelect(false);
    onChange(data ? detail.uniqueIdentifier : detail.value);
    setSelectedDetails([detail]);
  };

  const onClickSelect = (selectedValue) => {
    onChange(selectedValue.uniqueIdentifier);
    setSelectedDetails(
      mainData?.filter((obj) =>
        multiple
          ? selectedValue.value?.includes(obj.uniqueIdentifier)
          : obj.uniqueIdentifier === selectedValue.value
      )
    );
    setShowModal(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="multiselect">
      <SelectComponent
        value={value}
        disabled={disabled || readonly}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        multiple={multiple}
        formattedOptions={formattedOptions}
        handleSelect={handleSelect}
        handleChange={handleChange}
        isSeeAll={isSeeAll}
        limitedOptions={limitedOptions}
        mainData={mainData}
        setShowTooltipFlag={setShowTooltipFlag}
        data={data}
        setShowModal={setShowModal}
        setSelectedDetails={setSelectedDetails}
      />
      <InfoIconContainer
        setShowTooltipFlag={setShowTooltipFlag}
        selectedDetails={selectedDetails}
      />
      {showTooltipFlag && (
        <OptionDetails
          isSelect={isSelect}
          showDetails={showDetails}
          selectedDetails={selectedDetails}
          schemaCode={schemaCode}
          handleSelect={handleSelect}
          setShowTooltipFlag={setShowTooltipFlag}
          setIsSelect={setIsSelect}
        />
      )}
      {showModal && (
        <div className="modal-wrapper">
          <div className="modal-content">
            <div className="modal-inner">
              <MDMSSearchv2Popup
                masterNameInherited={schemaCode.split(".")[1]}
                moduleNameInherited={schemaCode.split(".")[0]}
                onClickSelect={onClickSelect}
              />
            </div>
            <Button label={"Close"} onButtonClick={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelectWidget;
