import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../atoms";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";
import MultiSelectDropdown from "../atoms/MultiSelectDropdown";
import Toggle from "../atoms/Toggle";
import { createFunction } from "./techMolecules/createFunction";

const CustomDropdown = ({ t, config, inputRef, label, onChange, id, value, errorStyle, disabled, type, additionalWrapperClass = "", variant, mdmsv2 }) => {
  // Handle case when mdmsConfig is null or undefined
  // Ensure moduleName and masterName are not empty strings
  const hasMdmsConfig =
    config?.mdmsConfig &&
    config?.mdmsConfig?.moduleName &&
    config?.mdmsConfig?.moduleName.trim() !== "" &&
    config?.mdmsConfig?.masterName &&
    config?.mdmsConfig?.masterName.trim() !== "";

  const master = hasMdmsConfig ? { name: config.mdmsConfig.masterName } : { name: "" };
  if (hasMdmsConfig && config?.mdmsConfig?.filter) {
    master["filter"] = config.mdmsConfig.filter;
  }

  const { isLoading, data, isFetching, isError } = window?.Digit?.Hooks?.useCustomMDMS?.(
    Digit?.ULBService?.getStateId(),
    config?.mdmsConfig?.moduleName || "",
    [master],
    {
      select: config?.mdmsConfig?.select
        ? createFunction(config?.mdmsConfig?.select)
        : (data) => {
          // Safe check: ensure data exists and is properly structured
          if (!data || !config?.mdmsConfig?.moduleName || !config?.mdmsConfig?.masterName) {
            return [];
          }
          const optionsData = _.get(data, `${config?.mdmsConfig?.moduleName}.${config?.mdmsConfig?.masterName}`, []);
          // Ensure optionsData is an array before filtering
          if (!Array.isArray(optionsData)) {
            return [];
          }
          return optionsData
            .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
            .map((opt) => ({ ...opt, name: `${config?.mdmsConfig?.localePrefix}_${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
        },
      enabled: Boolean(hasMdmsConfig || !!mdmsv2),
    },
    mdmsv2
  ) || { isLoading: false, data: null, isFetching: false, isError: false };

  // Compute effective options handling all edge cases
  const getEffectiveOptions = () => {
    // If still loading or fetching, return empty array (blank dropdown)
    if (isLoading || isFetching) {
      return [];
    }

    // If there's an error, return empty array (blank dropdown)
    if (isError) {
      return [];
    }

    // If mdmsConfig is provided and we have data, use it
    if (hasMdmsConfig && data && Array.isArray(data) && data.length > 0) {
      return data;
    }

    // Fallback to config.options if available, ensuring it's a valid array
    if (config?.options && Array.isArray(config.options) && config.options.length > 0) {
      return config.options;
    }

    // Default to empty array if nothing is available
    return [];
  };

  const effectiveOptions = getEffectiveOptions();
  const showLoader = (isLoading || isFetching) && hasMdmsConfig;

  if (showLoader) {
    return <Loader />;
  }

  const renderField = () => {
    switch (type) {
      case "radio":
        return (
          <RadioButtons
            inputRef={inputRef}
            style={{ ...config.styles }}
            options={effectiveOptions}
            key={config.name}
            optionsKey={config?.optionsKey}
            value={value}
            onSelect={(e) => {
              onChange(e, config.name);
            }}
            id={id}
            disabled={disabled}
            selectedOption={value}
            defaultValue={value}
            t={t}
            errorStyle={errorStyle}
            additionalWrapperClass={additionalWrapperClass}
            innerStyles={config?.innerStyles}
            alignVertical={config?.alignVertical}
            isLabelFirst={config?.isLabelFirst}
          />
        );
      case "dropdown":
      case "radioordropdown":
      case "select":
        if (config?.allowMultiselect) {
          return (
            <MultiSelectDropdown
              options={effectiveOptions}
              optionsKey={config?.optionsKey}
              chipsKey={config?.chipsKey}
              props={config}
              id={id}
              isPropsNeeded={true}
              onSelect={(e) => {
                onChange(
                  e
                    ?.map((row) => {
                      return row?.[1] ? row[1] : null;
                    })
                    .filter((e) => e),
                  config?.name
                );
              }}
              selected={value || []}
              defaultLabel={t(config?.defaultText)}
              defaultUnit={t(config?.selectedText)}
              config={config}
              disabled={disabled}
              variant={variant}
              addSelectAllCheck={config?.addSelectAllCheck}
              addCategorySelectAllCheck={config?.addCategorySelectAllCheck}
              selectAllLabel={config?.selectAllLabel}
              categorySelectAllLabel={config?.categorySelectAllLabel}
              restrictSelection={config?.restrictSelection}
              isSearchable={config?.isSearchable}
              disablePortal={config?.disablePortal}
            />
          );
        }
        return (
          <Dropdown
            inputRef={inputRef}
            style={{ ...config.styles }}
            option={effectiveOptions}
            key={config.name}
            optionKey={config?.optionsKey}
            value={value}
            id={id}
            select={(e) => {
              onChange(e, config.name);
            }}
            disabled={disabled}
            selected={value || config.defaultValue}
            defaultValue={value || config.defaultValue}
            t={t}
            errorStyle={errorStyle}
            optionCardStyles={config?.optionsCustomStyle}
            showIcon={config?.showIcon}
            variant={variant}
            isSearchable={config?.isSearchable}
            disablePortal={config?.disablePortal}
            showToolTip={config?.showToolTip}
          />
        );
      case "toggle":
        return (
          <Toggle
            inputRef={inputRef}
            options={effectiveOptions}
            key={config.name}
            style={config?.style || {}}
            optionsKey={config?.optionsKey}
            value={value}
            id={id}
            onSelect={(e) => {
              onChange(e, config.name);
            }}
            disabled={disabled}
            selectedOption={value}
            defaultValue={value}
            t={t}
            errorStyle={errorStyle}
            additionalWrapperClass={additionalWrapperClass}
            innerStyles={config?.innerStyles}
          />
        );
      default:
        return null;
    }
  };
  return <React.Fragment key={config.name}>{renderField()}</React.Fragment>;
};

CustomDropdown.propTypes = {
  t: PropTypes.func.isRequired,
  config: PropTypes.shape({
    mdmsConfig: PropTypes.shape({
      masterName: PropTypes.string,
      moduleName: PropTypes.string,
      filter: PropTypes.object,
      select: PropTypes.string,
      localePrefix: PropTypes.string,
    }),
    name: PropTypes.string,
    optionsKey: PropTypes.string,
    styles: PropTypes.object,
    innerStyles: PropTypes.object,
    options: PropTypes.array,
    defaultValue: PropTypes.string,
    optionsCustomStyle: PropTypes.object,
    required: PropTypes.bool,
  }),
  inputRef: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  errorStyle: PropTypes.object,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  additionalWrapperClass: PropTypes.string,
};

export default CustomDropdown;