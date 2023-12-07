// MDMSSearchUtils.js

import utils from "./index";

const toDropdownObj = (master = "", mod = "") => {
    return {
        name: mod || master,
        code: Digit.Utils.locale.getTransformedLocale(
            mod
                ? `WBH_MDMS_${master}_${mod}`
                : `WBH_MDMS_MASTER_${master}`
        ),
    };
};

export const updateFields = (properties, schemaFields, Config, currentSchema) => {
    var fields = [];
    var resultFields = [];
    Object.keys(properties)?.forEach((key) => {
        if (schemaFields?.searchableFields?.includes(key)) {
            const fieldConfig = utils.getConfig(properties[key].type);
            fields.push({
                label: Digit.Utils.locale.getTransformedLocale(
                    `${currentSchema.code}_${key}`
                ),
                type: fieldConfig.type,
                code: key,
                populators: { name: key },
                i18nKey: Digit.Utils.locale.getTransformedLocale(
                    `${currentSchema.code}_${key}`
                ),
            });
            if (properties[key].default) {
                Config.sections.search.uiConfig.defaultValues[key] =
                    properties[key].default;
            }
        }
        if (schemaFields?.displayFields?.includes(key)) {
            resultFields.push({
                label: Digit.Utils.locale.getTransformedLocale(
                    `${currentSchema.code}_${key}`
                ),
                name: key,
                code: key,
                i18nKey: `${currentSchema.code}_${key}`,
            });
        }
    });
    fields.push({
        label: "WBH_ISACTIVE",
        type: "dropdown",
        isMandatory: false,
        disable: false,
        populators: {
            name: "isActive",
            optionsKey: "code",
            optionsCustomStyle: { top: "2.3rem" },
            options: [
                {
                    code: "WBH_COMMON_YES",
                    value: true,
                },
                {
                    code: "WBH_COMMON_NO",
                    value: false,
                },
                {
                    code: "WBH_COMMON_ALL",
                    value: "all",
                },
            ],
        },
    });
    return { fields: fields, resultFields: resultFields, searchAPI: schemaFields?.searchAPI };
};

export const updatedFieldsWithoutSchema = (properties, currentSchema) => {
    var dropDownOptions = [];
    Object.keys(properties)?.forEach((key) => {
        if (properties[key].type === "string" && !properties[key].format) {
            dropDownOptions.push({
                name: key,
                code: key,
                i18nKey: Digit.Utils.locale.getTransformedLocale(
                    `${currentSchema.code}_${key}`
                ),
            });
        }
    });
    return dropDownOptions;
};

export const updateConfig = (
    Config,
    currentSchema,
    fields,
    resultFields,
    searchAPI,
    masterName,
    moduleName
) => {
    Config.sections.search.uiConfig.fields = fields;
    Config.actionLink =
        Config.actionLink +
        `?moduleName=${masterName?.name}&masterName=${moduleName?.name}`;
    Config.additionalDetails = {
        currentSchemaCode: currentSchema.code,
        searchBySchema: true,
    };
    Config.sections.searchResult.uiConfig.columns = [
        ...resultFields.map((option) => {
            return {
                label: option.label,
                i18nKey: option.label,
                jsonPath: `data.${option.code}`,
                dontShowNA: true,
            };
        }),
        {
            label: "WBH_ISACTIVE",
            i18nKey: "WBH_ISACTIVE",
            jsonPath: `isActive`,
            additionalCustomization: true,
        },
    ];
    Config.apiDetails.serviceName = `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`;

    //SearchAPI changes
    if (searchAPI?.url) {
        Config.apiDetails.serviceName = searchAPI.url;
    }
    if (searchAPI?.requestJson) {
        Config.apiDetails.requestJson = searchAPI.requestJson;
    }
    if (searchAPI?.responseJson) {
        Config.apiDetails.tableFormJsonPath = searchAPI.requestJson;
        Config.apiDetails.filterFormJsonPath = searchAPI.requestJson;
        Config.apiDetails.searchFormJsonPath = searchAPI.requestJson;
    }
    if (searchAPI?.requestBody) {
        try {
            Config.apiDetails.requestBody = JSON.parse(searchAPI?.requestBody)
        } catch (error) {
            console.log("Error during requestBody assignment in search config : ", error)
        }
    }
};

export const updateConfigWithoutSchema = (
    Config,
    currentSchema,
    dropDownOptions,
    masterName,
    moduleName
) => {
    Config.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
    Config.actionLink =
        Config.actionLink +
        `?moduleName=${masterName?.name}&masterName=${moduleName?.name}`;
    Config.additionalDetails = {
        currentSchemaCode: currentSchema.code,
        searchBySchema: false,
    };

    Config.sections.searchResult.uiConfig.columns = [
        ...dropDownOptions.map((option) => {
            return {
                label: option.i18nKey,
                i18nKey: option.i18nKey,
                jsonPath: `data.${option.code}`,
                dontShowNA: true,
            };
        }),
        {
            label: "WBH_ISACTIVE",
            i18nKey: "WBH_ISACTIVE",
            jsonPath: `isActive`,
            additionalCustomization: true,
        },
    ];
    Config.apiDetails.serviceName = `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`;
};

export { toDropdownObj };
