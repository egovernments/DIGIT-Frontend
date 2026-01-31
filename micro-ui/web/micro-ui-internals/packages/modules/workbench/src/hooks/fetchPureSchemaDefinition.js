const usePureSchemaDefinition = () => {
    const { moduleName, masterName } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const reqCriteria = {
        url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
        params: {},
        body: {
            SchemaDefCriteria: {
                tenantId: tenantId,
                codes: [`${moduleName}.${masterName}`],
            },
        },
        config: {
            enabled: moduleName && masterName && true,
            select: (data) => {
                return data?.SchemaDefinitions?.[0] || {};
            },
        },
        changeQueryName: 'schema-bulk',
    };

    const { isLoading, data: schema } = Digit.Hooks.useCustomAPIHook(reqCriteria);
    return { isLoading, pureSchemaDefinition: schema?.definition };
};

export default usePureSchemaDefinition;
