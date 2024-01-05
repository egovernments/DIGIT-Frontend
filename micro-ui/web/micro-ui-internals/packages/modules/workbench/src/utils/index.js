import _ from "lodash";


const CONFIGS_TEMPLATE = {
  string: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "text",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i,
      },
    },
  },
  object: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "object",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i,
      },
    },
  },
  array: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "array",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i,
      },
    },
  },
  number: {
    label: "",
    isMandatory: false,
    type: "number",
    disable: false,
    populators: {
      name: "number1",
      error: "invalid number field",
      validation: {
        min: 0,
        max: 9999999999,
      },
    },
  },
  boolean: {
    isMandatory: false,
    key: "radio1",
    type: "radio",
    label: "",
    disable: false,
    populators: {
      name: "radio1",
      optionsKey: "name",
      error: "select any one value",
      required: false,
      options: [
        {
          code: true,
          name: "True",
        },
        {
          code: false,
          name: "false",
        },
      ],
    },
  },
  select: {
    isMandatory: false,
    type: "dropdown",
    label: "",
    disable: false,
    populators: {
      name: "select1",
      optionsKey: "name",
      error: "select any one value",
      required: false,
      mdmsConfig: {
        masterName: "",
        moduleName: "",
        localePrefix: "",
      },
    },
  },
  default: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "text",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i,
      },
    },
  },
};

const getConfig = (type = "text") => {
  const config = CONFIGS_TEMPLATE?.[type] ? CONFIGS_TEMPLATE?.[type] : CONFIGS_TEMPLATE?.default;
  return {
    ...config,
    populators: {
      ...config.populators,
    },
  };
};

const getMDMSLabel = (code = "", masterName = "", moduleName = "", ignore = []) => {
  let ignoreThis = ignore?.some((url) => url === code);
  if (ignoreThis) {
    return null;
  }
  //enable this flag to get the localisation enabled for the mdms forms
  let flag = true;
  if (!flag) {
    return code
      .split(/(?=[A-Z])/)
      .reduce((acc, curr) => acc + curr.charAt(0).toUpperCase() + curr.slice(1) + " ", "")
      .trim();
  }
  if (masterName && moduleName) {
    return Digit.Utils.locale.getTransformedLocale(`SCHEMA_${moduleName}_${masterName}`);
  }
  return Digit.Utils.locale.getTransformedLocale(code);
};

const getFormattedData = (data = {}) => {
  const formattedData = {};
  Object.keys(data).map((key) => {
    if (key?.startsWith("SELECT")) {
      const newKey = key?.replace("SELECT", "");
      formattedData[newKey] = data[newKey]?.code;
    } else {
      formattedData[key] = data[key];
    }
  });
  return formattedData;
};

/* Method currently used to find the path to insert enum to the schema*/
const getUpdatedPath = (path = "") => {
  let tempPath = path;
  if (!tempPath?.includes(".")) {
    return tempPath;
  }
  if (tempPath?.includes(".*.")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".*.", "_ARRAY_OBJECT_");
  }
  if (tempPath?.includes(".*")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".*", "_ARRAY_");
  }
  if (tempPath?.includes(".")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".", "_OBJECT_");
  }
  let updatedPath = Digit.Utils.locale.stringReplaceAll(tempPath, "_ARRAY_OBJECT_", ".items.properties.");
  updatedPath = Digit.Utils.locale.stringReplaceAll(updatedPath, "_ARRAY_", ".items");
  updatedPath = Digit.Utils.locale.stringReplaceAll(updatedPath, "_OBJECT_", ".properties.");
  return updatedPath;
};
/* Method currently used to update the title for the all data with localisation code*/

const updateTitleToLocalisationCodeForObject = (definition, schemaCode) => {
  Object.keys(definition?.properties).map((key) => {
    const title = Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${key}`);
    definition.properties[key] = { ...definition.properties[key], title: title };
    if (definition.properties[key]?.type == "object") {
      updateTitleToLocalisationCodeForObject(definition.properties[key], schemaCode);
    }
    if (definition.properties[key]?.type == "array" && definition.properties[key]?.items?.type == "object") {
      updateTitleToLocalisationCodeForObject(definition.properties[key]?.items, schemaCode);
    }
  });
  return definition;
};
const formatDates = (value, type) => {
  if (type != "EPOC" && (!value || Number.isNaN(value))) {
    value = new Date();
  }
  switch (type) {
    case "date":
      return new Date(value)?.toISOString?.()?.split?.("T")?.[0];
    case "datetime":
      return new Date(value).toISOString();
    case "EPOC":
      return String(new Date(value)?.getTime());
  }
};

const generateId = async (format, tenantId = Digit.ULBService.getCurrentTenantId()) => {
  const requestCriteria = {
    url: "/egov-idgen/id/_generate",
    body: {
      idRequests: [
        {
          tenantId: tenantId,
          idName: format,
        },
      ],
    },
  };
  const response = await Digit.CustomService.getResponse({ url: requestCriteria?.url, body: requestCriteria?.body });
  return response?.idResponses?.[0]?.id;
};

const formatData = (value, type, schema) => {
  switch (type) {
    case "EPOC":
      return formatDates(value, type);
    case "REVERT-EPOC":
      return formatDates(typeof value == "string" && value?.endsWith?.("Z") ? value : parseInt(value), schema?.["ui:widget"]);
    case "REVERT-EPOC":
      return new Date(typeof value == "string" && value?.endsWith?.("Z") ? value : parseInt(value)).toISOString();
    default:
      return value;
  }
};
/*  preprocess the data before sending the data to mdms create api */
const preProcessData = async (data = {}, schema = {}) => {
  let fieldKey = "";
  let autoGenerateFormat = "";

  Object.keys(schema).map((key) => {
    if (typeof schema[key] == "object" && schema[key]?.["format"] && schema[key]?.["format"]?.includes?.("preprocess") && schema?.[key]?.formatType && data[key]) {
      /* this autogenerate format logic can be removed once we have the mdms v2 support to geenrate formatted id */
      if (schema?.[key]?.formatType == "autogenerate" && schema?.[key]?.autogenerate) {
        autoGenerateFormat = schema?.[key]?.autogenerate;
        fieldKey = key;
      } else {
        data[key] = formatData(data?.[key], schema?.[key]?.formatType, schema?.[key]);
      }
    }
  });
  if (fieldKey != "" && autoGenerateFormat != "") {
    data[fieldKey] = await generateId(autoGenerateFormat);
  }
  return { ...data };
};

/*  postprocess the data received from mdms search api to the form
    Digit.Utils.workbench.postProcessData(formData, inputUiSchema)
*/
const postProcessData = (data = {}, schema = {}) => {
  Object.keys(schema).map((key) => {
    if (
      typeof schema[key] == "object" &&
      schema[key]?.["format"] &&
      schema[key]?.["format"]?.includes?.("postprocess") &&
      schema?.[key]?.formatType &&
      data[key]
    ) {
      data[key] = formatData(data?.[key], `REVERT-${schema?.[key]?.formatType}`, schema?.[key]);
    }
  });
  return { ...data };
};

const getValueByPath = (obj, path) => {
  const result = [];

  const traverseObject = (currentObj, keys) => {
    const key = keys.shift();

    if (!key) {
      // End of the path, add the current object to the result
      result.push(currentObj);
      return;
    }

    if (key === '*') {
      // Handle wildcard '*' case
      for (const prop in currentObj) {
        traverseObject(currentObj[prop], keys.slice());
      }
    } else if (currentObj.hasOwnProperty(key)) {
      // Move to the next level in the object
      traverseObject(currentObj[key], keys.slice());
    }
  };

  const keys = path.split('.');
  traverseObject(obj, keys);

  return result;
};

const get = (path = "") => {
  let tempPath = path;
  if (!tempPath?.includes(".")) {
    return tempPath;
  }
  if (tempPath?.includes(".*.")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".*.", "_ARRAY_OBJECT_");
  }
  if (tempPath?.includes(".*")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".*", "_ARRAY_");
  }
  if (tempPath?.includes(".")) {
    tempPath = Digit.Utils.locale.stringReplaceAll(tempPath, ".", "_OBJECT_");
  }
  let updatedPath = Digit.Utils.locale.stringReplaceAll(tempPath, "_ARRAY_OBJECT_", ".items.properties.");
  updatedPath = Digit.Utils.locale.stringReplaceAll(updatedPath, "_ARRAY_", ".items");
  updatedPath = Digit.Utils.locale.stringReplaceAll(updatedPath, "_OBJECT_", ".properties.");
  return updatedPath;
};




/**
 * Custom function to get the CriteriaForSelectData
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Utils.workbench.getCriteriaForSelectData(allProps)
 *
 * @returns schema object
 */
const getCriteriaForSelectData = (allProps) => {
  const { configs, updateConfigs, updateSchema, schema: formSchema, formData } = Digit.Hooks.workbench.useWorkbenchFormContext();

  const { moduleName, masterName } = Digit.Hooks.useQueryParams();

  const { schema } = allProps;
  const { schemaCode = `${moduleName}.${masterName}`, tenantId, fieldPath } = schema;
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
        if (_.has(allProps, finalJSONPath)) {
          _.set(
            allProps,
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
          const dependencyConfig = customConfig?.dataSource?.dependentPath?.filter(obj => obj.depdendentKey == key)?.[0];
          if (dependencyConfig?.dependencyFor == "REQ_BODY" || dependencyConfig?.dependencyFor == "BOTH") {
            reqCriteriaForData.body = JSON.parse(customConfig?.dataSource?.requestBody?.replace(key, dependencyObj?.[key]));
          }
          if (dependencyConfig?.dependencyFor == "REQ_PARAM" || dependencyConfig?.dependencyFor == "BOTH") {
            reqCriteriaForData.params = JSON.parse(customConfig?.dataSource?.params?.replace(key, dependencyObj?.[key]));
          }
          newQuery += `-${dependencyObj?.[key]}`;
        });
        reqCriteriaForData.changeQueryName = `CUSTOM_DATA-${schemaCode}-${fieldPath}${newQuery}`;
      }
    }

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
      /* enahanced to support both string values and object label value*/
      const keyValuePairs=  respData?.map((item) => ({ label: item?.label|| item, value: item?.value||item }))
      if (_.has(allProps, finalJSONPath)) {
        _.set(
          allProps,
          finalJSONPath,
          keyValuePairs
        );
        const path = `definition.properties.${Digit.Utils.workbench.getUpdatedPath(fieldPath)}.enum`;
        const newSchema = _.cloneDeep(formSchema);
        _.set(
          newSchema,
          path,
          keyValuePairs?.map((item) => item.value)
        );
        updateSchema(newSchema);
      }
      return keyValuePairs;
    };
  }
  return reqCriteriaForData;

}

export default { getConfig, getMDMSLabel, getFormattedData, getUpdatedPath, updateTitleToLocalisationCodeForObject, preProcessData, postProcessData, getValueByPath, getCriteriaForSelectData };