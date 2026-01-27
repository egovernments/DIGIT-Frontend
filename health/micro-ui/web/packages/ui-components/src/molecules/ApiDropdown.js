import React, { Fragment, useState, useEffect,useMemo } from "react";
import PropTypes from "prop-types";
import MultiSelectDropdown from "../atoms/MultiSelectDropdown";
import Dropdown from "../atoms/Dropdown";
import { Loader } from "../atoms";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const ApiDropdown = ({ populators, formData, props, inputRef, errors ,disabled}) => {
  const [options, setOptions] = useState([]);

  const { t } = useTranslation();

  const reqCriteria = Digit?.Customizations?.[populators?.masterName]?.[populators?.moduleName]?.[populators?.customfn]();
  const {
    isLoading: isApiLoading,
    data: apiData,
    revalidate,
    isFetching: isApiFetching,
  } = reqCriteria
    ? window?.Digit?.Hooks.useCustomAPIHook(reqCriteria)
    : { isLoading: false, data: [], revalidate: null, isFetching: false };

  const memoizedApiData = useMemo(() => apiData, [JSON.stringify(apiData)]);

  useEffect(() => {
    if (!_.isEqual(memoizedApiData, options)) {
      setOptions(memoizedApiData);
    }
  }, [memoizedApiData]);

  if (isApiLoading) return <Loader />;

  // Support both old format (props.onChange) and new format (props.field.onChange)
  const field = props?.field || props;

  return (
    <>
      {populators.allowMultiSelect && (
        <div style={{ display: "grid", gridAutoFlow: "row",width:"100%"}}>
          <MultiSelectDropdown
            options={options || []}
            optionsKey={populators?.optionsKey}
            props={props} //these are props from Controller
            isPropsNeeded={true}
            onSelect={(e) => {
              field?.onChange?.(
                e
                  ?.map((row) => {
                    return row?.[1] ? row[1] : null;
                  })
                  .filter((e) => e)
              );
            }}
            selected={field?.value}
            defaultLabel={t(populators?.defaultText)}
            defaultUnit={t(populators?.selectedText)}
            config={populators}
            chipsKey={populators?.chipsKey}
            disabled={disabled}
            variant={populators?.variant}
            addSelectAllCheck={populators?.addSelectAllCheck}
            addCategorySelectAllCheck={populators?.addCategorySelectAllCheck}
            selectAllLabel={populators?.selectAllLabel}
            categorySelectAllLabel={populators?.categorySelectAllLabel}
            restrictSelection={populators?.restrictSelection}
            isSearchable={populators?.isSearchable}
          />
        </div>
      )}
      {!populators.allowMultiSelect && (
        <Dropdown
          inputRef={inputRef}
          option={options || []}
          key={populators.name}
          optionKey={populators?.optionsKey}
          value={field?.value?.[0]}
          select={(e) => {
            field?.onChange?.([e], populators.name);
          }}
          selected={field?.value?.[0] || populators.defaultValue}
          defaultValue={field?.value?.[0] || populators.defaultValue}
          t={t}
          errorStyle={errors?.[populators.name]}
          optionCardStyles={populators?.optionsCustomStyle}
          style={{...populators.styles }}
          disabled={disabled}
          showIcon={populators?.showIcon}
          variant={populators?.variant}
          isSearchable={populators?.isSearchable}
        />
      )}
    </>
  );
};

ApiDropdown.propTypes = {
  populators: PropTypes.shape({
    allowMultiSelect: PropTypes.bool.isRequired,
    masterName: PropTypes.string,
    moduleName: PropTypes.string,
    customfn: PropTypes.string,
    optionsKey: PropTypes.string,
    defaultText: PropTypes.string,
    selectedText: PropTypes.string,
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    optionsCustomStyle: PropTypes.object,
  }).isRequired,
  formData: PropTypes.object,
  props: PropTypes.shape({
    isApiLoading: PropTypes.bool,
    options: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
  }).isRequired,
  inputRef: PropTypes.object,
  errors: PropTypes.object,
};

export default ApiDropdown;
