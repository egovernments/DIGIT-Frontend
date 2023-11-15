import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader, InfoBannerIcon, Button, Close } from "@egovernments/digit-ui-react-components";
import MDMSSearchv2Popup from "../pages/employee/MDMSSearchv2Popup";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#f47738" : "#505a5f",
    borderRadius: "unset",
    "&:hover": {
      borderColor: "#f47738",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#f47738" : "white", // Background color for selected options
    color: state.isSelected ? "white" : "black", // Text color for selected options
    "&:hover": {
      backgroundColor: "#ffe6cc", // Very light orange background color on hover
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
        limit: 100,
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
  const optionsLimit = 10;
  const formattedOptions = React.useMemo(
    () => optionsList.map((e) => ({ label: t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${e?.label}`)), value: e.value })),
    [optionsList, schemaCode, data]
  );
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isSeeAll, setIsSeeAll] = useState(false);

  const handleSeeAll = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const SelectMenuButton = (props) => {
    return (
      <div>
        <components.MenuList  {...props}>
          {props.children}
        </components.MenuList>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px", backgroundColor: "#BDC5D1" }}>
          <button onClick={handleSeeAll} style={{ backgroundColor: "#BDC5D1", color: "#f47738", fontSize: "16px", textDecoration: "underline" }}>
            View All
          </button>
        </div>
      </div>
    )
  }
  const selectedOption = formattedOptions?.filter((obj) => (multiple ? value?.includes(obj.value) : obj.value == value));
  const handleChange = (selectedValue) => {
    onChange(multiple ? selectedValue?.value : selectedValue?.value);
    setSelectedDetails(mainData?.filter((obj) => (multiple ? selectedValue.value?.includes(obj.data.code) : obj.data.code == selectedValue.value)))
  };

  useEffect(() => {
    setLimitedOptions(formattedOptions.slice(0, optionsLimit));
    if (optionsLimit < formattedOptions.length) {
      setIsSeeAll(true);
    }
    setSelectedDetails(mainData?.filter((obj) => (multiple ? value?.includes(obj.data.code) : obj.data.code == value)));
  }, [formattedOptions, optionsLimit]);
  const onClickSelect = (selectedValue) => {
    selectedValue = { "value": selectedValue.code, "label": selectedValue.description };
    onChange(multiple ? selectedValue?.value : selectedValue?.value);
    setSelectedDetails(mainData?.filter((obj) => (multiple ? selectedValue.value?.includes(obj.data.code) : obj.data.code == selectedValue.value)))
    setShowModal(false);
  };
  const handleViewMoreClick = (detail) => {
    const schemaCode = detail?.schemaCode;
    const [moduleName, masterName] = schemaCode.split(".");
    const uniqueIdentifier = detail?.uniqueIdentifier;
    history.push(`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`);
  };
  const OptionWithInfo = (props) => {
    const { data } = props;

    // Find the index of the selected option within limitedOptions
    const index = limitedOptions.findIndex(option => option.value === data.value);

    const handleInfoBannerClick = () => {
      // Create a singleton array with the selected detail
      const selectedDetail = mainData[index];
      setSelectedDetails([selectedDetail]);
      setShowTooltipFlag(true);
    };

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{data.label}</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={handleInfoBannerClick} // Add the click event handler
          >
            <InfoBannerIcon fill={"#f47738"} style={{ marginLeft: "10px" }} />
          </span>
        </div>
      </components.Option>
    );
  };


  if (isLoading) {
    return <Loader />;
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        className="form-control form-select"
        classNamePrefix="digit"
        options={limitedOptions}
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
        components={isSeeAll ? { MenuList: SelectMenuButton, Option: OptionWithInfo } : { Option: OptionWithInfo }}
      />

      <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
        <div className="info-icon" style={{ cursor: "pointer" }}
          // onMouseEnter={() => setShowTooltipFlag(true)} onMouseLeave={() => setShowTooltipFlag(false)}
          onClick={() => { setShowTooltipFlag(true) }}
        >
          {selectedDetails && selectedDetails.length > 0 && (
            <span >
              <InfoBannerIcon fill={"#f47738"} />
            </span>
          )}

        </div>

      </div>
      {showTooltipFlag && selectedDetails && (
        <div className="option-details">
          {selectedDetails?.map((detail, index) => (
            <div style={{ marginTop: "20px" }} key={detail.id}>
              {Object.keys(detail.data).map((key) => {
                const value = detail.data[key];
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                  // Display only if the value is a string, number, or boolean
                  return (
                    <div style={{ margin: "30px", display: "flex", justifyContent: "space-between" }} key={key}>
                      <span style={{ fontWeight: "bold" }}>{t(Digit.Utils.locale.getTransformedLocale(key))}</span>{" "}
                      <span>{String(value)}</span>
                    </div>
                  );
                }
                return null; // Don't display for complex values
              })}
              {index < selectedDetails.length - 1 && (
                <hr style={{ margin: "10px 0", border: "none", borderBottom: "1px solid #ccc" }} />
              )}
              <div style={{ textAlign: "center" }}>
                <span onClick={() => handleViewMoreClick(detail)} style={{ color: "blue", cursor: "pointer" }}>
                  View More
                </span>
              </div>
            </div>
          ))}

          <div className="close-button" onClick={() => setShowTooltipFlag(false)}>
            <Close />
          </div>
        </div>
      )}


      {
        showModal && (
          <div className="modal-wrapper">
            <div className="modal-content">
              <div className="modal-inner">
                <MDMSSearchv2Popup masterNameInherited={schema.schemaCode.split(".")[1]} moduleNameInherited={schema.schemaCode.split(".")[0]} onClickSelect={onClickSelect} />
              </div>
              <Button label={"Close"} onButtonClick={handleCloseModal}></Button>
            </div>
          </div>
        )
      }
    </div >

  );
};
export default CustomSelectWidget;




