export const updateLocalization = async (tenantId, moduleName, masterName, resp) => {
    try {
        const result = await Digit.UiSchemaSearchService.search({
            tenantId: tenantId,
            uniqueIdentifiers: [`${moduleName}.${masterName}`],
            schemaCode: "Workbench.UISchema"
        });

        const localisableFields = result?.mdms[0]?.data?.localisation?.localisableFields;

        if (localisableFields) {
            const messages = localisableFields.map((field, index) => {
                const localisationFieldPath = field.fieldPath;
                const prefix = field.prefix;
                const module = field.module;
                const code = resp?.mdms[0]?.data[localisationFieldPath];

                return {
                    code: Digit.Utils.locale.getTransformedLocale(`${prefix}_${code}`),
                    message: code,
                    module: module,
                    id: index,
                    locale: "default"
                };
            });

            await Digit.CustomService.getResponse({
                url: `/localization/messages/v1/_upsert`,
                params: {},
                body: {
                    tenantId: tenantId,
                    messages: messages
                }
            });
        }
    } catch (error) {
        console.error('Error updating localization:', error);
    }
};
