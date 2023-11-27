import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import _ from "lodash";

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
  const [prefix, setPrefix] = useState(schemaCode);
  const { configs, updateConfigs, updateSchema, schema: formSchema, formData } = Digit.Hooks.workbench.useWorkbenchFormContext();

  const handleChange = (selectedValue) => onChange(multiple ? selectedValue?.value : selectedValue?.value);
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
        offset: 0,
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
          const path = `definition.properties.${Digit.Utils.workbench.getUpdatedPath(fieldPath)}.enum`;
          const newSchema = _.cloneDeep(formSchema);
          _.set(
            newSchema,
            path,
            respData?.map((e) => e.value)
          );
          updateSchema(newSchema);
        }
        return respData;
      },
    },
    changeQueryName: `data-${schemaCode}`,
  };
  if (schemaCode === "CUSTOM" && configs?.customUiConfigs?.custom?.length > 0) {
    const customConfig = configs?.customUiConfigs?.custom?.filter((data) => data?.fieldPath == fieldPath)?.[0] || {};
    reqCriteriaForData.url = customConfig?.dataSource?.API;
    reqCriteriaForData.body = JSON.parse(customConfig?.dataSource?.requestBody);
    reqCriteriaForData.params = JSON.parse(customConfig?.dataSource?.requestParams);
    reqCriteriaForData.changeQueryName = `CUSTOM_DATA-${schemaCode}-${fieldPath}`;

    /*  It has dependency Fields*/
    if (customConfig?.dataSource?.dependentPath?.length > 0) {
      // const dependentValue=customConfig?.dataSource?.dependentPath?.length>0?:true;
      customConfig?.dataSource?.dependentPath?.every((obj) => obj.fieldPath && _.get(formData, obj.fieldPath));
      const dependencyObj = customConfig?.dataSource?.dependentPath?.reduce((acc, curr) => {
        acc[curr.depdendentKey] = _.get(formData, curr.fieldPath);
        return acc;
      }, {});
      const isEnabled = Object.keys(dependencyObj).every((key) => dependencyObj?.[key]);
      reqCriteriaForData.config.enabled = isEnabled;
      if (isEnabled) {
        let newQuery = "";
        Object.keys(dependencyObj).map((key) => {
          reqCriteriaForData.body = JSON.parse(customConfig?.dataSource?.requestBody?.replace(key, dependencyObj?.[key]));
          newQuery += `-${dependencyObj?.[key]}`;
        });
        reqCriteriaForData.changeQueryName = `CUSTOM_DATA-${schemaCode}-${fieldPath}${newQuery}`;
      }
    }
    const newPrefix = customConfig?.prefix;
    const suffix = customConfig?.suffix;

    newPrefix != prefix && setPrefix(newPrefix);
    reqCriteriaForData.config.select = (data) => {
      let respData = [];
      if (data) {
        respData = data;
      }
      if (customConfig?.dataSource?.responseJSON) {
        respData = _.get(data, customConfig?.dataSource?.responseJSON, []);
      }
      if (customConfig?.dataSource?.customFunction) {
        const customFun = Digit.Utils.createFunction(customConfig?.dataSource?.customFunction);
        respData = customFun?.(data);
      }
      const finalJSONPath = `registry.rootSchema.properties.${Digit.Utils.workbench.getUpdatedPath(fieldPath)}.enum`;
      if (_.has(props, finalJSONPath)) {
        _.set(
          props,
          finalJSONPath,
          respData?.map((item) => ({ label: item, value: item }))
        );
        const path = `definition.properties.${Digit.Utils.workbench.getUpdatedPath(fieldPath)}.enum`;
        const newSchema = _.cloneDeep(formSchema);
        _.set(
          newSchema,
          path,
          respData?.map((e) => e.value)
        );
        updateSchema(newSchema);
      }
      return respData?.map((item) => ({ label: item, value: item }));
    };
  }
  const { isLoading, data } = Digit.Hooks.useCustomAPIHook(reqCriteriaForData);
  const optionsList = data || options?.enumOptions || options || [];
  const formattedOptions = React.useMemo(
    () => optionsList.map((e) => ({ label: t(Digit.Utils.locale.getTransformedLocale(`${prefix}_${e?.label}`)), value: e.value })),
    [optionsList, prefix, data]
  );
  const selectedOption = formattedOptions?.filter((obj) => (multiple ? value?.includes(obj.value) : obj.value == value));
  if (isLoading) {
    return <Loader />;
  }
  return (
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
  );
};
export default CustomSelectWidget;
