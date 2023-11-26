import React, { useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import { useTranslation } from "react-i18next";
import {
  Loader,
  InfoBannerIcon,
  Button,
} from "@egovernments/digit-ui-react-components";
import MDMSSearchv2Popup from "../pages/employee/MDMSSearchv2Popup";
import OptionDetails from "./OptionDetails";
import { customStyles } from "../configs/CustomStylesConfig";

const CustomSelectWidget = (props) => {
  const { t } = useTranslation();
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
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const { schemaCode = `${moduleName}.${masterName}`, tenantId, fieldPath } =
    schema;

  const [showTooltipFlag, setShowTooltipFlag] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSeeAll, setIsSeeAll] = useState(false);

  const { isLoading, data } = Digit.Hooks.useCustomAPIHook({
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: schemaCode,
        limit: 100,
        offset: 0,
      },
    },
    config: {
      enabled: schemaCode && schemaCode?.length > 0,
      select: (responseData) => {
        const respData = responseData?.mdms?.map((e) => ({
          label: e?.uniqueIdentifier,
          value: e?.uniqueIdentifier,
        }));
        const finalJSONPath = `registry.rootSchema.properties.${Digit.Utils.workbench.getUpdatedPath(
          fieldPath
        )}.enum`;

        if (_.has(props, finalJSONPath)) {
          _.set(
            props,
            finalJSONPath,
            respData?.map((e) => e.value)
          );
        }

        setMainData(responseData?.mdms);
        return respData;
      },
    },
    changeQueryName: `data-${schemaCode}`,
  });

  const optionsList = data || options?.enumOptions || options || [];
  const optionsLimit = 10;

  const formattedOptions = useMemo(
    () =>
      optionsList.map((e) => ({
        label: t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${e?.label}`)),
        value: e.value,
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
          : obj.uniqueIdentifier == value
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
          : obj.uniqueIdentifier == selectedValue.value
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
    selectedValue = {
      ...selectedValue,
      value: selectedValue.uniqueIdentifier,
      label: selectedValue.description,
    };
    onChange(selectedValue.uniqueIdentifier);
    setSelectedDetails(
      mainData?.filter((obj) =>
        multiple
          ? selectedValue.value?.includes(obj.uniqueIdentifier)
          : obj.uniqueIdentifier == selectedValue.value
      )
    );
    setShowModal(false);
  };

  const OptionWithInfo = (props) => {
    const { data } = props;
    const index = limitedOptions.findIndex(
      (option) => option.value === data.value
    );
    const handleInfoBannerClick = () => {
      const selectedDetail = mainData[index];
      setSelectedDetails([selectedDetail]);
      setShowTooltipFlag(true);
    };

    return (
      <components.Option {...props}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{data.label}</span>
          {/* <span
            style={{ cursor: "pointer" }}
            onClick={handleInfoBannerClick} // Add the click event handler
          >
            <InfoBannerIcon fill={"#f47738"} style={{ marginLeft: "10px" }} />
          </span> */}
        </div>
      </components.Option>
    );
  };

  const SelectMenuButton = (props) => (
    <div>
      <components.MenuList {...props}>{props.children}</components.MenuList>
      <div className="link-container">
        <div onClick={() => setShowModal(true)} className="view-all-link">
          View All
        </div>
      </div>
    </div>
  );

  const InfoIconContainer = () => (
    <div className="info-icon-container">
      <div
        className="info-icon"
        onClick={() => {
          setShowTooltipFlag(true);
        }}
      >
        {selectedDetails && selectedDetails.length > 0 && data && (
          <span>
            <InfoBannerIcon fill={"#f47738"} />
          </span>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="multiselect">
      <Select
        className="form-control form-select"
        classNamePrefix="digit"
        options={data ? limitedOptions : formattedOptions}
        isDisabled={disabled || readonly}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        closeMenuOnScroll={true}
        value={formattedOptions.filter((obj) =>
          multiple ? value?.includes(obj.value) : obj.value == value
        )}
        onChange={data ? handleChange : handleSelect}
        isSearchable={true}
        isMulti={multiple}
        styles={customStyles}
        components={
          isSeeAll ? { MenuList: SelectMenuButton, Option: OptionWithInfo } : { Option: OptionWithInfo }
        }
      />
      <InfoIconContainer />
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
                masterNameInherited={schema.schemaCode.split(".")[1]}
                moduleNameInherited={schema.schemaCode.split(".")[0]}
                onClickSelect={onClickSelect}
              />
            </div>
            <Button label={"Close"} onButtonClick={() => setShowModal(false)}></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelectWidget;