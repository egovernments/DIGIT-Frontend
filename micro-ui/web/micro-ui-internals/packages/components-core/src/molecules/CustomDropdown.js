import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../atoms/Loader";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";
import Toggle from "../atoms/Toggle";
import { createFunction } from "./techMolecules/createFunction";

const CustomDropdown = ({ t, config, inputRef, label, onChange, value, errorStyle, disabled, type, additionalWrapperClass = "",variant }) => {
  const master = { name: config?.mdmsConfig?.masterName };
  if (config?.mdmsConfig?.filter) {
    master["filter"] = config?.mdmsConfig?.filter;
  }

  const { isLoading, data } = window?.Digit?.Hooks.useCustomMDMS(Digit?.ULBService?.getStateId(), config?.mdmsConfig?.moduleName, [master], {
    select: config?.mdmsConfig?.select
      ? createFunction(config?.mdmsConfig?.select)
      : (data) => {
        const optionsData = _.get(data, `${config?.mdmsConfig?.moduleName}.${config?.mdmsConfig?.masterName}`, []);
        return optionsData
          .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
          .map((opt) => ({ ...opt, name: `${config?.mdmsConfig?.localePrefix}_${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
      },
    enabled: config?.mdmsConfig ? true : false,
  });

  if (isLoading) {
    return <Loader />;
  }

  const renderField = () => {
    switch (type) {
      case "radio":
        return (
          <RadioButtons
            inputRef={inputRef}
            style={{...config.styles }}
            options={data || config?.options || []}
            key={config.name}
            optionsKey={config?.optionsKey}
            value={value}
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
      case "dropdown":
      case "radioordropdown":
      case "select":
        return (
          <Dropdown
            inputRef={inputRef}
            style={{...config.styles }}
            option={data || config?.options || []}
            key={config.name}
            optionKey={config?.optionsKey}
            value={value}
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
          />
        );
      case "toggle":
        return (
         <Toggle
            inputRef={inputRef}
            options={data || config?.options || []}
            key={config.name}
            optionsKey={config?.optionsKey}
            value={value}
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
