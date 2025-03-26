import { useQuery } from "react-query";
import _ from "lodash";

/**
 * Custom util to get the config based on the JSON Schema and UI Schema.
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.workbench.UIFormBodyGenerator({},{})
 *
 * @returns {Array<object>} Returns the Form Body config
 */
const UIFormBodyGenerator = (JSONSchema = {}, UISchema = {}) => {
  // const newConfig=[];
  const schema = JSONSchema?.properties;
  const referenceSchema = JSONSchema?.["x-ref-schema"] || [];

  const body = Object.keys(schema).map((property) => {
    let bodyConfig = {};
    const referenceSchemaObject = referenceSchema?.filter((e) => e.fieldPath == property);
    if (referenceSchemaObject && Array.isArray(referenceSchemaObject) && referenceSchemaObject.length > 0) {
      /* TODO Schema fetch also has to be integrated */
      bodyConfig = Digit.Utils.workbench.getConfig("select");
      const masterDetails = referenceSchemaObject?.[0]?.schemaCode?.split?.(".");
      bodyConfig.populators.mdmsConfig.moduleName = masterDetails?.[0];
      bodyConfig.populators.mdmsConfig.masterName = masterDetails?.[1];
      bodyConfig.populators.mdmsConfig.localePrefix = Digit.Utils.locale.getTransformedLocale(referenceSchemaObject?.[0]?.schemaCode);
      bodyConfig.key = "SELECT" + property;
      bodyConfig.populators.name = "SELECT" + property;
    } else {
      bodyConfig = Digit.Utils.workbench.getConfig(schema[property].type);
      bodyConfig.key = schema[property].type == "boolean" ? "SELECT" + property : property;
      bodyConfig.populators.name = schema[property].type == "boolean" ? "SELECT" + property : property;
    }

    bodyConfig.label = Digit.Utils.workbench.getMDMSLabel(property);

    bodyConfig.isMandatory = JSONSchema?.required?.includes?.(property);
    return { ...bodyConfig };
  });
  return body;
};

/**
 * Custom util to get the config based on the JSON Schema (MDMS schema) and UI Schema.
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.workbench.UICreateConfigGenerator({},{})
 *
 * @returns {Array<object>} Returns the Create screen config
 */
const UICreateConfigGenerator = (MDMSSchema = {}, UISchema = {}) => {
  // const newConfig=[];
  const body = UIFormBodyGenerator(MDMSSchema.definition, UISchema);
  const newConfig = [{ head: Digit.Utils.workbench.getMDMSLabel(MDMSSchema?.code), subHead: MDMSSchema?.description, body }];

  return newConfig;
};

/**
 * Custom util to get the mdms context path.
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.workbench.getMDMSContextPath()
 *
 * @returns {Array<object>} Returns the Create screen config
 */
const getMDMSContextPath = () => {
  return window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
};

const isSchemaCodeInMDMSAction = () => {
  return window?.globalConfigs?.getConfig("MDMS_SCHEMACODE_INACTION")===false?false : true;
};





/**
 * Custom function to get the schema of the screen to be rendered
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.workbench.getMDMSSchema(schemaCode,tenantId)
 *
 * @returns schema object
 */

const getMDMSSchema = (schemaCode, tenantId = Digit.ULBService.getCurrentTenantId()) => {
  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: tenantId,
        codes: [schemaCode],
      },
    },
  };
  const { isLoading: schemaLoading, data: schemaData, error: schemaError } = useQuery(
    ["API_SCHEMA", schemaCode, tenantId].filter((e) => e),
    () => Digit.CustomService.getResponse({ ...reqCriteria }),
    {
      cacheTime: 0,
      enabled: schemaCode && true,
      select: (data) => {
        return data?.SchemaDefinitions?.[0] || { noSchemaFound: true };
      },
    }
  );
  const reqCriteriaData = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        filters: {
          schemaCode: schemaCode,
        },
        schemaCode: "Workbench.UISchema",
      },
    },
  };
  const { isLoading: uiSchemaLoading, error, data } = useQuery(
    ["UI_SCHEMA", schemaCode, tenantId],
    () => Digit.CustomService.getResponse({ ...reqCriteriaData }),
    {
      cacheTime: 0,
      enabled: schemaCode && true,
      select: (data) => {
        const customUiConfigs = data?.mdms?.[0]?.data;
        const responseData = {};
        if (customUiConfigs) {
          responseData["customUiConfigs"] = customUiConfigs;
          responseData["uiSchema"] = customUiConfigs?.order ? { "ui:order": [...customUiConfigs?.order, "*"] } : {};
        }
        return responseData;
      },
    }
  );
  let finalResponse = {};
  if (!uiSchemaLoading && !schemaLoading) {
    finalResponse = { ...data };
    if (schemaData?.definition) {
      schemaData.definition = Digit.Utils.workbench.updateTitleToLocalisationCodeForObject(schemaData?.definition, schemaData?.code);
    }
    if (schemaData?.definition?.["x-ref-schema"]?.length > 0) {
      schemaData?.definition?.["x-ref-schema"]?.map((dependent) => {
        if (dependent?.fieldPath) {
          let updatedPath = Digit.Utils.workbench.getUpdatedPath(dependent?.fieldPath);
          if (_.get(schemaData?.definition?.properties, updatedPath)) {
            _.set(schemaData?.definition?.properties, updatedPath, {
              ..._.get(schemaData?.definition?.properties, updatedPath, {}),
              enum: [],
              schemaCode: dependent?.schemaCode,
              fieldPath: dependent?.fieldPath,
              tenantId,
            });
          }
        }
      });
    }
    if (schemaData && finalResponse?.customUiConfigs?.custom?.length > 0) {
      finalResponse?.customUiConfigs?.custom?.map((dependent) => {
        if (dependent?.fieldPath && dependent?.dataSource) {
          let updatedPath = Digit.Utils.workbench.getUpdatedPath(dependent?.fieldPath);
          if (_.get(schemaData?.definition?.properties, updatedPath)) {
            _.set(schemaData?.definition?.properties, updatedPath, {
              ..._.get(schemaData?.definition?.properties, updatedPath, {}),
              enum: [{ label: "WBH_NULL", value: null }],
              schemaCode: "CUSTOM",
              fieldPath: dependent?.fieldPath,
              tenantId,
            });
          }
        }
      });
    }
    finalResponse["schema"] = { ...schemaData };
  }
  return { isLoading: uiSchemaLoading || schemaLoading, error: schemaError || error, data: finalResponse };
};

export { UICreateConfigGenerator, getMDMSContextPath, getMDMSSchema, isSchemaCodeInMDMSAction };
