export const updateLocalization = async (tenantId, moduleName, masterName, resp) => {
    try {
        const result = await Digit.UiSchemaSearchService.search({
            tenantId: tenantId,
            uniqueIdentifiers: [`${moduleName}.${masterName}`],
            schemaCode: "Workbench.UISchema"
        });

        const localisableFields = result?.mdms[0]?.data?.localisation?.localisableFields;

        if (localisableFields) {
            const messages = localisableFields.flatMap((field, index) => {
                const localisationFieldPath = field?.fieldPath;
                const prefix = field.prefix;
                const module = field.module;
                if (resp?.mdms[0]?.data && localisationFieldPath) {
                    const codes = Digit.Utils.workbench.getValueByPath(resp?.mdms[0]?.data, localisationFieldPath);
                    if (codes && Array.isArray(codes)) {
                        return codes.map((code) => ({
                            code: Digit.Utils.locale.getTransformedLocale(`${prefix}_${code}`),
                            message: code,
                            module: module,
                            id: index,
                            locale: "default"
                        }));
                    }
                }
                return [];
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
