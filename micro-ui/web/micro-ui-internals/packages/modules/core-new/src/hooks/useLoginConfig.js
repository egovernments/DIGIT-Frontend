import { useCommonMDMS, getConfigModuleName } from '@egovernments/digit-ui-libraries-new';

export const useLoginConfig = (stateCode) => {
    const moduleName = getConfigModuleName();

    return useCommonMDMS(
        stateCode,
        moduleName,
        ["LoginConfig"],
        {
            select: (data) => ({
                config: data?.[moduleName]?.LoginConfig,
            }),
            retry: false,
        }
    );
};