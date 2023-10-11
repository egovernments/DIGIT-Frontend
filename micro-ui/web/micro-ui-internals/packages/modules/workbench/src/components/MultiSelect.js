import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader, RefreshIcon, InfoBannerIcon } from "@egovernments/digit-ui-react-components";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#f47738" : "#505a5f",
    borderRadius: "unset",
    "&:hover": {
      borderColor: "#f47738",
    },
  }),
};

/* Multiple support not added TODO jagan to fix this issue */
const CustomSelectWidget = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const {
    options,
    value,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    multiple = false,
    schema = { schemaCode: "", fieldPath: "" },
  } = props;
  const { schemaCode = `${moduleName}.${masterName}`, tenantId, fieldPath } = schema;
  const [showTooltipFlag, setShowTooltipFlag] = useState(false);
  const [mainData, setMainData] = useState([]);
  const handleChange = (selectedValue) => {
    onChange(multiple ? selectedValue?.value : selectedValue?.value);
    setCurrentSelectedOption(selectedValue)
  };
  /*
  logic added to fetch data of schemas in each component itself
  */
  const reqCriteriaForData = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: schemaCode,
        limit: 50,
        offset: 0
      },
    },
    config: {
      enabled: schemaCode && schemaCode?.length > 0,
      select: (data) => {
        const respData = data?.mdms?.map((e) => ({ label: e?.uniqueIdentifier, value: e?.uniqueIdentifier }));
        const finalJSONPath = `registry.rootSchema.properties.${Digit.Utils.workbench.getUpdatedPath(fieldPath)}.enum`;
        if (_.has(props, finalJSONPath)) {
          _.set(
            props,
            finalJSONPath,
            respData?.map((e) => e.value)
          );
        }
        setMainData(data?.mdms);
        return respData;
      },
    },
    changeQueryName: `data-${schemaCode}`,
  };

  const { isLoading, data } = Digit.Hooks.useCustomAPIHook(reqCriteriaForData);
  const optionsList = data || options?.enumOptions || options || [];
  const formattedOptions = React.useMemo(
    () => optionsList.map((e) => ({ label: t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${e?.label}`)), value: e.value })),
    [optionsList, schemaCode, data]
  );
  const selectedOption = formattedOptions?.filter((obj) => (multiple ? value?.includes(obj.value) : obj.value == value));
  const selectedDetails = mainData?.filter((obj) => (multiple ? value?.includes(obj.data.code) : obj.data.code == value));
  const [currentSeletedOption, setCurrentSelectedOption] = useState(selectedOption);
  const handleViewMoreClick = (detail) => {
    const schemaCode = detail?.schemaCode;
    const [moduleName, masterName] = schemaCode.split(".");
    const uniqueIdentifier = detail?.uniqueIdentifier;
    history.push(`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`);
  };
  function getDisplayValue(value) {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        // Handle arrays
        return value.join(', ');
      } else {
        // Handle objects
        return JSON.stringify(value);
      }
    } else {
      return String(value); // Convert to string
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        className="form-control form-select"
        classNamePrefix="digit"
        options={formattedOptions}
        isDisabled={disabled || readonly}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        closeMenuOnScroll={true}
        value={selectedOption}
        onChange={handleChange}
        isSearchable={true}
        isMulti={multiple}
        styles={customStyles}
      />
      <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
        <div className="info-icon" style={{ cursor: "pointer" }} onMouseEnter={() => setShowTooltipFlag(true)} onMouseLeave={() => setShowTooltipFlag(false)}>
          {selectedDetails && selectedDetails.length > 0 && (
            <span >
              <InfoBannerIcon />
            </span>
          )}
          {showTooltipFlag && selectedDetails && (
            <div className="option-details">
              {selectedDetails?.map((detail, index) => (
                <div key={detail.id}>
                  {Object.keys(detail.data).map((key) => (
                    <div key={key}>
                      <span style={{ fontWeight: "bold" }}>{t(Digit.Utils.locale.getTransformedLocale(key))}:</span> {getDisplayValue(detail.data[key])}
                    </div>
                  ))}
                  {index < selectedDetails.length - 1 && <hr style={{ margin: "10px 0", border: "none", borderBottom: "1px solid #ccc" }} />}
                  <span onClick={() => handleViewMoreClick(detail)} style={{ color: "blue" }}>View More</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div >

  );
};
export default CustomSelectWidget;
