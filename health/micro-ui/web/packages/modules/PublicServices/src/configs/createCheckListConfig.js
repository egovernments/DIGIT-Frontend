import React from "react";

/**
 * Generates a checklist configuration used for form rendering.
 * Each field is configured based on its dataType and whether it has sub-conditions.
 * @param {Array} item - The checklist definition, usually with attributes.
 * @returns {Array} A configuration object compatible with FormComposer.
 */
export const CreateCheckListConfig = (item) => {
    if (!Array.isArray(item) || item.length === 0) return [];
    let response = item?.[0];

    /**
     * Builds individual field configuration.
     * @param {Object} field - Single checklist field (attribute).
     * @param {String} label - Parent label (typically checklist code).
     * @param {String} codes - Field code used for translations.
     * @param {Boolean} hide - Whether to initially hide this field in the form.
     */
    const createConfig = (field, label, codes, hide) => {
        let type = field.dataType === "SingleValueList" ? "radio" : "text"; // Determine input type

        if (type === "radio") {
            return {
                isMandatory: field.required,
                key: field.code,
                type: type,
                label: `${label}.${codes}`, // Translation key
                disable: false,
                populators: {
                    name: field.code,
                    optionsKey: "name",
                    wrapLabel: true,
                    hideInForm: hide, // Dynamic hiding for conditional fields
                    alignVertical: true,
                    options: field.values?.map(item => ({
                        code: item,
                        name: `${label}.${item}`, // Translatable option label
                    }))
                },
            };
        } else {
            return {
                isMandatory: field.required,
                key: field.code,
                type: type,
                label: `${label}.${codes}`,
                disable: false,
                populators: {
                    name: field.code,
                    hideInForm: false,
                    alignVertical: true,
                    wrapLabel: true,
                },
            };
        }
    };

    let config = [];
    let fields = response.attributes;

    fields.forEach(item => {
        const codeParts = item.code.split(".");
        if (codeParts.length === 1) {
            config.push(createConfig(item, response.code, item.code, false)); // Root level fields
        } else {
            config.push(createConfig(item, response.code, item.code, true)); // Conditional sub-fields
        }
    });

    return [
        {
            body: config
        }
    ];
};

/**
 * Updates visibility of form fields based on values selected.
 * Useful for dynamic conditional rendering in forms.
 * @param {Array} config - Current form configuration.
 * @param {Object} values - Current values selected in form.
 * @returns {Array} Updated configuration with hideInForm flags adjusted.
 */
export const updateCheckListConfig = (config, values) => {
    config[0].body.forEach(item => {
        const part = item.key.split(".");

        if (part.length > 1) {
            const code = part?.[0]; // Parent field
            const value = part[part.length - 2]; // Expected value to show this field
            const selectedValue = values[code]?.code || values[code]; // Current selection

            if (values[code] && selectedValue === value && item.populators.hideInForm === true) {
                item.populators.hideInForm = false; // Show field
            }

            if (values[code] && selectedValue !== value && item.populators.hideInForm === false) {
                item.populators.hideInForm = true; // Hide field
            }
        }
    });

    return config;
};

export default CreateCheckListConfig;
